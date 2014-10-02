var _ = require('lodash');

var http = require('http');
var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: 9000 });

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
  response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  response.end(JSON.stringify({peers: connectedPeers}));
}).listen(9090);
