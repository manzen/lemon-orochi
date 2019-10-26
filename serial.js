require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const querystring = require('querystring');
const player = require('play-sound')(opts = {})

// audio.kill();

const word = "アイルビーバック";
const twiml = '<Response><Say voice="woman" language="ja-jp">' + word + '</Say></Response>';

const PATH = '/dev/cu.usbmodem14401'
const BOARD_RATE = 9600

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort(PATH, { baudRate: 9600 })
const parser = port.pipe(new Readline({ delimiter: '\n' }))

let isFlag = false

port.on('open', () => {
    console.log('serial port open')
})

parser.on('data', data => {
    console.log('data: ', data)
    if(!isFlag) {
        const audio = player.play('sample.mp3', function(err){
            if (err && !err.killed) throw err
        });
        isFlag = true
    }

    client.calls
        .create({
            url: 'http://twimlets.com/echo?Twiml=' + querystring.escape(twiml),
            to: process.env.TO,
            from: process.env.FROM
        })
        .then(call => console.log(call.sid));
})

