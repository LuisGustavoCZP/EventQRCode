const qrcode = require('qrcode-generator');
const fs = require('fs');

function generatePage (text)
{
    const qr = qrcode(7, 'M');
    qr.addData(text);
    qr.make();
    const d = qr.createDataURL();
    //const qr = qrcode.stringToBytes("coiso");
    const file = fs.readFileSync('./src/client/genqr.html').toString('utf8').replace('<div><img id="qrcode"', `<div><img id="qrcode" src="${d}"`);
    //console.log(file);
    return file;
}

function generate (text)
{
    const qr = qrcode(7, 'M');
    qr.addData(text);
    qr.make();
    return qr.createDataURL();
}

module.exports = { generate }; //flex-grow:1; flex-direction: row;