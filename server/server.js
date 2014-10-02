var _ = require('lodash');

var httpServer = require('http');
httpServer.createServer();

// dataServer serving client with peer information
var dataServer = require('socket.io')(httpServer).listen(9090);

// p2p server
var PeerServer = require('peer').PeerServer;
var peerServerInstance = new PeerServer({port: 9000});

// keeping track of peers
var clientConnections = {};

peerServerInstance.on('connection', function (id) {
  clientConnections[id] = {};
});

peerServerInstance.on('disconnect', function (id) {
  delete clientConnections[id];
});

dataServer.on('connection', function (socket) {
  socket.on('logon', function (clientID){
    clientConnections[clientID] = socket;
    updateFriends(clientID);

    socket.on('disconnect', function () {
      clientConnections[clientID] = null;
      updateFriends(clientID);
    });
  });

});

function updateFriends (user) {
  for(var clientID in clientConnections){
    var friends = getFriends(clientID);
    if (clientConnections[clientID] !== null) {
      clientConnections[clientID].emit('friends-update', friends);
    }
  }
}

function getFriends(user) {
  var friends = [];
  for(var clientID in clientConnections){
    if (clientConnections[clientID] !== null && clientID !== user) {
      friends.push(clientID);
    }
  }
  return friends;
}

/*http.createServer(function (request, response) {
 response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
 response.end(JSON.stringify({peers: connectedPeers}));
 }).listen(9090);*/
