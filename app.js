const express = require('express');
const app = express();
const SerialPort = require("serialport");
const port = 3000;

const player = require('play-sound')(opts = {})

// Download the helper library from https://jp.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const querystring = require('querystring');

const VOICE_URLS = [
    "https://remon-orochi.s3-ap-northeast-1.amazonaws.com/illbeback.mp3",
    "https://remon-orochi.s3-ap-northeast-1.amazonaws.com/saichen.mp3",
    "https://remon-orochi.s3-ap-northeast-1.amazonaws.com/lemon.mp3"
]

const url = VOICE_URLS[Math.floor(Math.random() * VOICE_URLS.length)];
const twiml = '<Response><Play loop="1">' + url + '</Play></Response>';

player.play('voices/gya1.mp3', { afplay: ['-v', 1 ] }, function(err){
    if (err) throw err
    client.calls
        .create({
            url: 'http://twimlets.com/echo?Twiml=' + querystring.escape(twiml),
            to: process.env.TO,
            from: process.env.FROM
        })
        .then(call => console.log(call.sid));
});

app.get('/', function (req, res) {
    return res.send('Working');
});

app.listen(port, function () {
    console.log('Example app listening on port http://0.0.0.0:' + port + '!');
});
