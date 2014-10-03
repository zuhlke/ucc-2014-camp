var _ = require('lodash');

var httpServer = require('http');
httpServer.createServer();

// dataServer serving client with peer information
var dataServer = require('socket.io')(httpServer).listen(9090);

// p2p server
var PeerServer = require('peer').PeerServer;
var peerServerInstance = new PeerServer({port: 9000});

console.log('Server listening at localhost:9000');

// keeping track of peers
var clientConnections = {};

dataServer.on('connection', function (socket) {
    socket.on('logon', function (clientID) {
        console.log('Browser connected: ' + clientID);
        clientConnections[clientID] = socket;
        updateFriends(clientID);

        socket.on('disconnect', function () {
            console.log('Browser disconnected: ' + clientID);
            clientConnections[clientID] = null;
            updateFriends(clientID);
        });
    });
});

function updateFriends (user) {
    for(var clientID in clientConnections){
        if (clientConnections[clientID]) {
            var friends = getFriends(clientID);
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

