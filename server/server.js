var express = require('express');
var path = require('path');

var server = express();

server.use(express.static(path.join(__dirname,'../public')));

var port = 5500;
server.listen(port, function() {
	console.log('server listening on port '+port);
});