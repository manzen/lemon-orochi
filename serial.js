const PATH = '/dev/cu.usbmodem14401'
const BOARD_RATE = 9600

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort(PATH, { baudRate: 9600 })
const parser = port.pipe(new Readline({ delimiter: '\n' }))

port.on('open', () => {
    console.log('serial port open')
})

parser.on('data', data => {
    console.log('data: ', data)
})
