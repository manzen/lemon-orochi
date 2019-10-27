require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const player = require('play-sound')(opts = {})
const client = require('twilio')(accountSid, authToken);
const querystring = require('querystring');
const url = "https://remon-orochi.s3-ap-northeast-1.amazonaws.com/illbeback.mp3";
const twiml = '<Response><Play loop="1">' + url + '</Play></Response>';

const PATH = '/dev/cu.usbmodem14401'

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort(PATH, { baudRate: 9600 })
const parser = port.pipe(new Readline({ delimiter: '\n' }))

port.on('open', () => {
    console.log('serial port open')
})

let play_count = 0
let audio = null

parser.on('data', data => {
    console.log('data: ', data)

    let is_operation = true
    let is_play = true
    let pressure = 0
    let volume = null

    // 音量設定
    if (!isNaN(pressure) && pressure > 0 && pressure < 500) { // 感圧センサーから強い圧力を感じたら、音量を大きく
        volume = 10
    } else { // 感圧センサーから弱い圧力を感じたら、音量を小さく
        volume = 1
    }

    if (is_operation) {
        play_count += 1
        // 音声再生
        if (is_play) {
            // TODO　音声ファイルを出し分ける
            audio = player.play('sample.mp3', { afplay: ['-v', volume ] }, function(err){
                if (err) throw err
                // 音声が停止したらTwilioAPIを呼び出して電話をかける
                client.calls
                    .create({
                        url: 'http://twimlets.com/echo?Twiml=' + querystring.escape(twiml),
                        to: process.env.TO,
                        from: process.env.FROM
                    })
                    .then(call => console.log(call.sid));
            });
        } else if (!is_play && !audio) {
            audio.kill()
        }
    }
})

