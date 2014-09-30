'use strict';

var peer = new Peer({host: 'localhost', port: 9000, path: '/music-player' });
peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
});

var myapp = angular.module('myapp', []);
