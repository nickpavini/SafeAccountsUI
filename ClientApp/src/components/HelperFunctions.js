var CryptoJS = require("crypto-js");

// aes encrypt string to hex string
export function Encrypt(str) {
    var KEY = window.localStorage.getItem("UserKey").substring(0, 32); //32 bit
    var IV = "1234567890000000";//16 bits
    var keyAsBytes = CryptoJS.enc.Utf8.parse(KEY);
    var iv = CryptoJS.enc.Utf8.parse(IV);

    var srcs = CryptoJS.enc.Utf8.parse(str); // incoming string is not hex string
    var encrypted = CryptoJS.AES.encrypt(srcs, keyAsBytes, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString();
}

// aes decrypt hex string
export function Decrypt(str) {
    var KEY = window.localStorage.getItem("UserKey").substring(0, 32); //32 bit
    var IV = "1234567890000000";//16 bits
    var keyAsBytes = CryptoJS.enc.Utf8.parse(KEY);
    var iv = CryptoJS.enc.Utf8.parse(IV);
    var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
    var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = CryptoJS.AES.decrypt(srcs, keyAsBytes, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
