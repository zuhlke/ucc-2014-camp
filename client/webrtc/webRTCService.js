myapp.factory('webRTCService', function ($window, $http, $q, $rootScope, $log) {

  var peer;
  var myPeerId;
  var myPeers = {}; // map of friends
  var webRTCService = {};
  var username = "<unkonwn>";

  webRTCService.connect = function () {
    var deferred = $q.defer();

    if (peer) {
      deferred.resolve(myPeerId);
      return deferred.promise;
    }

    peer = new Peer({
      config: {'iceServers': [
        {url: 'stun:stun.l.google.com:19302'},
        {url: 'stun:stun1.l.google.com:19302'},
        {url: 'stun:stun2.l.google.com:19302'},
        {url: 'stun:stun3.l.google.com:19302'},
        {url: 'stun:stun4.l.google.com:19302'}
      ]},
      host: $window.location.hostname,
      port: 9000
    });

    peer.on('open', function (id) {
      myPeerId = id;
      deferred.resolve(myPeerId);
      $rootScope.$broadcast('webrtc:open', myPeerId);
    });

    peer.on('call', function (call) {
      $log.debug('Received call:' + call);
      $log.debug("Received metadata: " + call.metadata.trackName);

      call.answer();

      call.on('stream', function (stream) {
        $rootScope.$broadcast('webRTCService.streamReceived', {
          trackName: call.metadata.trackName,
          stream: stream
        });
      });
    });

    peer.on('error', function (err) {
      $log.error(err);
    });

    peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        $log.debug(data.name + ' received from ' + data.id);
        if (data.type === 'username') {
          myPeers[data.id].username = data.name;
          $log.debug('Username received for ' + data.id + ' set to' + data.name);
          $rootScope.$apply();
        }
      });
    });

    return deferred.promise;
  };

  webRTCService.setUsername = function(name) {
    username = name;
  };

  webRTCService.setPeers = function (peers) {
    for (var i = 0; i < peers.length; ++i) {
      myPeers[peers[i]] = {
        username: username
      };
    }
    for (var id in myPeers) {
      if (!_.contains(peers, id)) {
        delete myPeers[id];
      } else {
        myPeers[id] = {};
        if (!myPeers[id].connection) {
          var p2pConn = peer.connect(id);
          myPeers[id].connection = p2pConn;
        }
      }
    }
  };

  webRTCService.getPeers = function () {
    return myPeers;
  };

  webRTCService.pushTrack = function(track) {
    push({
      id: myPeerId,
      track: track,
      type: 'track'
    });
  };

  webRTCService.pushUsername = function() {
    push({
      id: myPeerId,
      name: username,
      type: 'username'
    });
  };

  function push (data) {
    for (var id in myPeers) {
      var conn = myPeers[id].connection;
      $log.debug('pushed ' + data + ' to ' + id);
      conn.send(data);
      conn.on('error', function (msg) {
        $log.debug('error: ' + msg);
      });
    }
  }

  webRTCService.sendStream = function (peerId, stream, trackName) {
    peer.call(peerId, stream, { metadata: { trackName: trackName }});
  };

  webRTCService.connect().then(function(id) {
    var socket = io('http://' + $window.location.hostname + ':9090');
    socket.emit('logon', myPeerId);
    socket.on('friends-update', function (newFriends) {
      console.log('friends update received');
      console.log(newFriends);
      webRTCService.setPeers(newFriends);
      $rootScope.$apply();
    });
  });

  return webRTCService;
});
