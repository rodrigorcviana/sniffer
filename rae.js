const { SerialPort } = require('serialport');
const Readline = require('readline');
/*
SerialPort.list().then(
    ports => ports.forEach(console.log),
    err => console.error(err),
)
*/

let connected = true;
let msgCounter = 0;
let index = 0;
let message = true;
const raeLinkResponse = Buffer.from([
    '0xEC', '0x28', '0x01', '0x02',
    '0xC2', '0x01', '0x00', '0x00',
    '0x00', '0x00', '0x00', '0x00',
    '0x39', '0x37', '0x35', '0x2d',
    '0x30', '0x30', '0x30', '0x38',
    '0x36', '0x37', '0x44', '0x00',
    '0x01', '0x00', '0x00', '0x00',
    '0x00', '0x00', '0x01', '0x00',
    '0x00', '0x00', '0x00', '0x00',
    '0x00', '0x00', '0x00', '0x00',
    '0x50', '0x89'
]);
const qraeResponse = Buffer.from([
    '0xed', '0x35', '0x01', '0x02',  '0x00',
    '0x2c', '0x6a', /**/'0x05', '0x08',/**/ '0x00', /* device id*/
    '0x00', '0x00', '0x00', '0x00', '0x00',
    '0x4d', '0x30', '0x32', '0x48', '0x30',
    '0x30', '0x30', '0x31', '0x52', '0x31',
    '0x04', '0x02', '0x01', '0x02', '0x00', 
    '0x00', '0x5d', '0x90', '0x0b', '0x00', 
    '0x01', '0x00', '0x27', '0x02', '0x00',
    '0x00', '0x00', '0x04', '0x80', '0x0c', 
    '0x00', '0x01', '0x00', '0x00', '0x22',
    '0x00', '0x00', '0x00', '0x00', '0x1f',
])

const expectedMsg = Buffer.from(['0xF1', '0x03', '0x02', '0x01', '0x09']);
const expectedSubMsg = Buffer.from(['0xFA', '0x04', '0x02', '0x01', '0x00', '0xFF']);

const port = new SerialPort({
    path: "COM3",
    baudRate: 19200,
    parity: "none",
    autoOpen: true,
});

port.on("error", (err) => {
    if (err) {
        connected = false;
        console.log(err);
    }
});

/*port.on("readable", () => {
    console.log('readable');
    console.log(port.read());
});*/

port.on("data", (data) => {
    console.log('received', data);
    if (expectedMsg.compare(data) === 0) {
    
        port.write(raeLinkResponse);

        console.log('RAELink Response', raeLinkResponse);
        console.log('--------------------------------------------');
    }
    if (expectedSubMsg.compare(data) === 0) {
        port.write(qraeResponse);

        console.log('QRAE Response', qraeResponse);
        console.log('********************************************');
    }
});

/*port.open((err) => {
    if (err) {
        console.log(err);
    }
});*/


const keepAlive = () => {
    try {
        console.log('init');
    } finally {
        setTimeout(() => {
            console.log('alive');
            
            keepAlive();
        }, 1000);
    }
}

keepAlive();