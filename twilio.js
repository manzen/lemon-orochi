// Download the helper library from https://jp.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const querystring = require('querystring');

const word = "アイルビーバック";
const twiml = '<Response><Say voice="woman" language="ja-jp">' + word + '</Say></Response>';

client.calls
    .create({
        url: 'http://twimlets.com/echo?Twiml=' + querystring.escape(twiml),
        to: process.env.TO,
        from: process.env.FROM
    })
    .then(call => console.log(call.sid));
