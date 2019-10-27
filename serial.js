require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const player = require('play-sound')(opts = {})
const client = require('twilio')(accountSid, authToken);
const querystring = require('querystring');

const VOICE_URLS = [
    "https://remon-orochi.s3-ap-northeast-1.amazonaws.com/illbeback.mp3",
    "https://remon-orochi.s3-ap-northeast-1.amazonaws.com/saichen.mp3"
]

const PATH = '/dev/cu.usbmodem143201'

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort(PATH, { baudRate: 9600 })
const parser = port.pipe(new Readline({ delimiter: '\n' }))

port.on('open', () => {
    console.log('serial port open')
})

let play_count = 0
let audio = null
let is_play = false

let HIGH_VOICES = [
    'voices/gya1.mp3',
    'voices/lemonshiru.mp3',
    'voices/uhooooo.mp3',
    'voices/uryyyyy.mp3'
]

let LOW_VOICES = [
    'voices/a.mp3',
    'voices/ita.mp3',
    'voices/i.mp3',
    'voices/ua.mp3'
]

parser.on('data', data => {
    console.log('data: ', data)
    console.log(play_count + "回目")

    let input = data.split(',');

    console.log(input)

    let is_push = input[2].slice(0, 1)
    let pressure = input[0]
    let volume = null

    console.log(volume)

    if (is_push === "1" && !is_play) {
        play_count += 1
        is_play = true
        let voice = null

        // 音量設定
        if (!isNaN(pressure) && pressure > 0 && pressure < 500) { // 感圧センサーから強い圧力を感じたら、音量を大きく
            volume = 10
            voice = HIGH_VOICES[Math.floor(Math.random() * HIGH_VOICES.length)]
        } else { // 感圧センサーから弱い圧力を感じたら、音量を小さく
            volume = 1
            voice = LOW_VOICES[Math.floor(Math.random() * LOW_VOICES.length)]
        }

        if (play_count % 5 === 0) {
            voice = 'voices/arigato.mp3'
        }

        // 音声再生
        if (is_play) {
            port.write(Buffer.from([play_count]), (err, results) => {
                if(err) {
                    console.log(`error : ${err}`)
                }
                console.log(`result : ${results}`)
            })
            console.log("再生します")
            audio = player.play(voice, { afplay: ['-v', volume ] }, function(err){
                if (err) throw err
                is_play = false
                const url = VOICE_URLS[Math.floor(Math.random() * VOICE_URLS.length)];
                let twiml = '<Response><Play loop="1">' + url + '</Play></Response>';
                if (play_count === 100) {
                    let url = "https://remon-orochi.s3-ap-northeast-1.amazonaws.com/lemon.mp3"
                    twiml = '<Response><Play loop="1">' + url + '</Play></Response>';
                }
                // 音声が停止したらTwilioAPIを呼び出して電話をかける
                client.calls
                    .create({
                        url: 'http://twimlets.com/echo?Twiml=' + querystring.escape(twiml),
                        to: process.env.TO,
                        from: process.env.FROM
                    })
                    .then(call => console.log(call.sid));
            });
        }
    }
})

