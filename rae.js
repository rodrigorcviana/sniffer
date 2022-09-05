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
const msg = [
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
];

const expectedMsg = ['0xF1', '0x03', '0x02', '0x01', '0x09'];

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
    if (data === Buffer.from(expectedMsg)) {
        port.write(Buffer.from(msg));
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