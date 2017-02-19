var app = require('express')();

var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var port = 5500;
var sockets = [];
var pairs = [];

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

io.on('connection', function(socket){
	sockets.push(socket);
	console.log(sockets.length + ' connections');
	if (sockets.length == 2) {
		pairs.push({first:sockets[0], second:sockets[1]});
		sockets = [];
	}
	if (sockets.length > 2) {
		var secondSocket = 0; 
		while (secondSocket == 0) {
			secondSocket = parseInt(Math.random() * sockets.length);
		}
		pairs.push({first:sockets[0], second:sockets[secondSocket]});
		sockets.splice(0,1);
		sockets.splice(secondSocket, 1);
	}
	while (pairs.length) {
		handlePair(pairs[0]);
		pairs.splice(0,1);
	}
})

function handlePair(pair) {
	console.log(pair.first, pair.second);
}

http.listen(port, function() {
	console.log('server listening on port '+port);
});