var app = require('express')();

var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var port = 5500;
var sockets = [];
var sockIds = [];
var pairs = [];
var pairedSockets = [];

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

io.on('connection', function(socket){
	socket.on('disconnect', function() {
		// if this socket id is in the sockIds array, the user disconnected
		// before being paired. remove it from the arrays
		var sockLoc = sockIds.indexOf(socket.id);
		if (sockLoc > -1) {
			sockets.splice(sockLoc, 1);
			sockIds.splice(sockLoc, 1);
		}
	});
	socket.on('action', function(msg) {
		console.log('action received from participant:'+msg);
		console.log(typeof pairedSockets[msg]);
		pairedSockets[msg].emit('clicked', '');
	});
	socket.on('choiceMade', onChoiceMade);
	// TODO we should freeze these arrays at this point, so that no deletion happens between saves
	sockets.push(socket);
	sockIds.push(socket.id);
	console.log(sockets.length + ' connections');
	if (sockets.length == 2) {
		pairs.push({first:sockets[0], second:sockets[1]});
		pairedSockets[sockIds[1]] = sockets[1];

		pairedSockets[sockIds[0]] = sockets[0];
		 sockets = [];
		 sockIds = [];
	}
	if (sockets.length > 2) {
		var secondSocket = 0; 
		while (secondSocket == 0) {
			secondSocket = parseInt(Math.random() * sockets.length);
		}
		pairs.push({first:sockets[0], second:sockets[secondSocket]});
		console.log('save in location '+sockIds[secondSocket]+' element of type '+typeof sockets[secondSocket]);
		pairedSockets[sockIds[secondSocket]] = sockets[secondSocket];

		pairedSockets[sockIds[0]] = sockets[0];
		
		sockets.splice(secondSocket, 1);
		sockIds.splice(secondSocket, 1);
		sockets.splice(0,1);
		sockIds.splice(0,1);
	}
	while (pairs.length) {
		handlePair(pairs[0]);
		pairs.splice(0,1);
	}
})

function onChoiceMade(msg) {
	console.log('choiceMade ', msg);
	var sock1 = pairedSockets[msg.this],
		sock2 = pairedSockets[msg.pair],
		otherChoice = (msg.position === 'heads')?'tails':'heads'
	sock1.emit('choiceMade', {choice:msg.position});
	sock2.emit('choiceMade', {choice:otherChoice});
	setTimeout(function() {
		var result = (parseInt(Math.random() * 1000) %2) ? 'heads' : 'tails';
		sock1.emit('gameResult', {flip:result});
		sock2.emit('gameResult', {flip:result});
	}, 1000);
}

function handlePair(pair) {
	console.log(pair.first.id, pair.second.id);
	var msg0='first', msg1='second',
		rand = (parseInt(Math.random() * 1000) %2);
	if (rand) {
		msg1 = 'first';
		msg0 = 'second';
	}

	pair.first.emit('paired', {pair:pair.second.id, position: msg0});
	pair.second.emit('paired', {pair:pair.first.id, position: msg1});
	
}

http.listen(port, function() {
	console.log('server listening on port ' + port);
});