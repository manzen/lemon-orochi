require('dotenv').config();
const player = require('play-sound')(opts = {})
const PATH = '/dev/cu.usbmodem14401'

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort(PATH, { baudRate: 9600 })
const parser = port.pipe(new Readline({ delimiter: '\n' }))

let counter = 0

port.on('open', () => {
	console.log('serial port open')
	setInterval(() => {
		counter++
		port.write(Buffer.from([counter]), (err, results) => {
			if(err) {
				console.log(`error : ${err}`)
			}
			console.log(`result : ${results}`)
		})
	}, 5000)
})

parser.on('data', (data) => {
	console.log(data)
})

