var httpServer = require('http');
httpServer.createServer();

// dataServer serving client with peer information
var dataServer = require('socket.io')(httpServer).listen(9090);

// p2p server
var PeerServer = require('peer').PeerServer;
var peerServerInstance = new PeerServer({port: 9000 });

// keeping track of peers
var connectedPeers = [];

peerServerInstance.on('connection', function (id) {
  connectedPeers.push(id);
});

peerServerInstance.on('disconnect', function (id) {
  _(connectedPeers).remove(function (t) {
    return t === id;
  });
});

dataServer.on('connection', function (socket) {
  socket.on('logon', function (data){
    socket.emit('friends-update', connectedPeers);
  });
});

/*http.createServer(function (request, response) {
 response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
 response.end(JSON.stringify({peers: connectedPeers}));
 }).listen(9090);*/
