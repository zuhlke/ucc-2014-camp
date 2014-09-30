var _ = require('lodash');

var http = require('http');
var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: 9000, path: '/music-player'});
var connectedPeers = [];

server.on('connection', function (id) {
  connectedPeers.push(id);
});

server.on('disconnect', function (id) {
  _(connectedPeers).remove(function (t) {
    return t === id;
  });
});

http.createServer(function (request, response) {
  response.writeHead(501, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(connectedPeers));
}).listen(9090);
