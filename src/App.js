/* eslint-disable */
// import 
// import ethers from "ethers";
import ethSigUtil from "@metamask/eth-sig-util";
import RSAEncrypt from "lit-js-sdk";
// import ascii85 from "ascii85";
// const ascii85 = require('./ascii85/index.js');

function App() {


async function encryptFile(file, publicKeyReceiver) {
  const { encryptedFile, symmetricKey } = await RSAEncrypt.encryptFile(
   {
     file
  }
  );
  let symmetricKeyString =  RSAEncrypt.uint8arrayToString(symmetricKey, "base16");
  console.log('eF', encryptFile,"sk", symmetricKeyString);
  console.log("sk", symmetricKeyString);
  
 

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  })
  console.log('acc', accounts);
  

// Key is returned as base64
const keyB64 = await window.ethereum.request({
  method: 'eth_getEncryptionPublicKey',
  params: [accounts[0]],
})

const publicKey = Buffer.from(keyB64, 'base64');

  // let eSK =  ethSigUtil.encrypt(publicKeyReceiver, symmetricKey);
  const eSK = ethSigUtil.encrypt({
    publicKey: publicKey.toString('base64'),
    data: ascii85.encode(symmetricKey).toString(),
    version: 'x25519-xsalsa20-poly1305',
  });
  console.log("esk", eSK, "eF", encryptedFile)
}
async function decryptData(account, data) {
  // Reconstructing the original object outputed by encryption
  const structuredData = {
    version: 'x25519-xsalsa20-poly1305',
    ephemPublicKey: data.slice(0, 32).toString('base64'),
    nonce: data.slice(32, 56).toString('base64'),
    ciphertext: data.slice(56).toString('base64'),
  };
  // Convert data to hex string required by MetaMask
  const ct = `0x${Buffer.from(JSON.stringify(structuredData), 'utf8').toString('hex')}`;
  // Send request to MetaMask to decrypt the ciphertext
  // Once again application must have acces to the account
  const decrypt = await window.ethereum.request({
    method: 'eth_decrypt',
    params: [ct, account],
  });
  
  // Decode the base85 to final bytes
  return ascii85.decode(decrypt);
}

  return (
    <div className="App">

    <input type="file" name="" id="" onChange={(e)=>{
       encryptFile(e.currentTarget.files[0], "0x0dd68c06Af920CA069CDc27d05AA9EB65F85990A")
    }}/>
      <button>Encrypt file</button>
      <button>Decryption</button>
    </div>
  );
}

export default App;
