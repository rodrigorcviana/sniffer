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
    // ??,  req byte, u id,    ??,     ??
    ['0xF1', '0x03', '0x01', '0x01', '0x0A'],
    ['0xF1', '0x03', '0x02', '0x01', '0x09'],
    ['0xF1', '0x03', '0x03', '0x01', '0x08'],
    ['0xF1', '0x03', '0x04', '0x01', '0x07'],
];

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
            if (connected === true) {

                const send = Buffer.from(msg[1]);
                console.log('sended: ', send);
                port.write(send);


            }
            keepAlive();
        }, 1000);
    }
}

keepAlive();