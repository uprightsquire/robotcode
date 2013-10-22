var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var com = require("serialport");
var ros = require('rosnodejs');
var exec = require('child_process').exec;

var port = 5000;
var sPort = "/dev/ttyAMA0";

app.configure(function() {
    app.use(express.static(__dirname + '/'));
});

try {
var serialPort = new com.SerialPort(sPort, {
    baudrate: 38400,
    parser: com.parsers.readline('\n')
    });
    }catch(e){
    } 

//Startup messages

serialPort.on('open',function() {
    console.log('\x1b[32;1mSerial port ' + sPort + ' open\x1b[0m');
    });

server.listen(port, function(){
    console.log('\x1b[32;1mListening for sockets on port: ' + port + '\x1b[0m');
    });

//Forward serial data from robot to webpage (Incoming data)

serialPort.on('data', function(data) {
    console.log(data);
    io.sockets.emit('data', data);
    });



//Forward data from webpage to robot (outgoing data)

io.sockets.on('connection', function(socket) {
    socket.on('speed', function(data, data2) {
    serialPort.write("M"+data+data2+"\n");
    console.log('-> Set speed: ' + 'M' + data + data2);
    });
    });
