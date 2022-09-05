const { SerialPort } = require('serialport');
const Readline = require('readline');
/*
SerialPort.list().then(
    ports => ports.forEach(console.log),
    err => console.error(err),
)
*/

let connected = true;

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

port.on("readable", () => {
    console.log('readable');
    console.log(port.read());
});
 
port.on("data", (data) => {
    console.log(data);
});

/*port.open((err) => {
    if (err) {
        console.log(err);
    }
});*/


const keepAlive = () => {
    try {
        console.log('ping');
    } finally {
        setTimeout(() => {
            console.log('pong');
            if (connected === true) {
                const teste = Buffer.from([143, 193, 129, 129, 80]);
                console.log(teste);
                //const buffer = new ArrayBuffer([0x8F, 0xC1, 0x81, 0x81, 0x50]);
                port.write(teste);
            }
            keepAlive();
        }, 30);
    }
}

keepAlive();