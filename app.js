const express = require('express');
const app = express();
const SerialPort = require("serialport");
const port = 3000;
const arduinoCOMPort = "COM3";

const player = require('play-sound')(opts = {})

const audio = player.play('sample.mp3', function(err){
    if (err && !err.killed) throw err
});
// audio.kill();

const arduinoSerialPort = new SerialPort(arduinoCOMPort, {
    baudRate: 9600
});

arduinoSerialPort.on('open',function() {
    console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

app.get('/', function (req, res) {
    return res.send('Working');
});

app.get('/:action', function (req, res) {

    var action = req.params.action || req.param('action');

    if(action == 'led'){
        arduinoSerialPort.write("w");
        return res.send('Led light is on!');
    }
    if(action == 'off') {
        arduinoSerialPort.write("t");
        return res.send("Led light is off!");
    }

    return res.send('Action: ' + action);

});

app.listen(port, function () {
    console.log('Example app listening on port http://0.0.0.0:' + port + '!');
});
