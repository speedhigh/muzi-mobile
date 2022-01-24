import CryptoJS from 'crypto-js' // 引用AES源码js
const key = CryptoJS.enc.Utf8.parse('1234567812345678') // 十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse("1234567812345678"); //十六位十六进制数作为密钥偏移量
// 解密方法
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

// 加密方法
function Encrypt(word) {
  let encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
export default {
  Decrypt,
  Encrypt
}