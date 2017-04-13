/*
 * server.node.js
 * Copyright (C) 2017 Sushil Chhetri <chhetrisushil@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */
/*jshint esnext: true, strict: false*/
import express from 'express';
import http from 'http';
import socket from 'socket.io';
// import path from 'path';

let app = express();
let server = http.Server(app);
let io = socket(server);
let port = 3000;

app.get('/', function (req, res) {
  res.sendfile('public/index.html');
});

server.listen(port, function () {
  console.log('server listening on port ' + port);
});

io.on('connection', function (socket) {
  socket.on('disconnect', function () {
    console.log('leaving now...');
  });
});
