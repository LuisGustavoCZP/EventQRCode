const crypto = require("crypto");

const algorithm = "aes-256-cbc"; 
const securityKey = 'e9de8858a76c406eb2cdde4a33f6e1b286ee3efccfb94506a7dfcfd04e9720bc46634d7679db40b1afa94cfe2d2f201';
/* const initVector = crypto.randomBytes(16);
const securityKey = crypto.randomBytes(32); */
const iv = Buffer.from(securityKey.slice(0, 32), 'hex');
const key = Buffer.from(securityKey.slice(securityKey.length-64), 'hex');

function lock (data)
{
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(JSON.stringify(data), "utf-8", "hex");
    encryptedData += cipher.final("hex");
    //console.log("Encrypted message: " + encryptedData);
    return encryptedData;
}

function unlock (lockedData)
{
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedData = decipher.update(lockedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    //console.log("Decrypted message: " + decryptedData);
    return decryptedData;
}

module.exports = { lock, unlock };