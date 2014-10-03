myapp.factory('webRTCService', function ($window, $http, $q, $rootScope, $log, audioPlayer) {

  var peer;
  var myPeerId;
  var myPeers = {}; // map of friends
  var webRTCService = {};
  var defaultUsername = "unknown";
  var username = defaultUsername;

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
          $log.debug('Username received for ' + data.id + ' set to ' + data.name);
          myPeers[data.id].username = data.name;
        }
        if (data.type === 'track') {
          $log.debug('Track received for ' + data.id + ' set to ' + data.track);
          myPeers[data.id].track = data.track;
        }
        if (data.type === 'listen') {
          $log.debug('Stream request received for ' + data.id);
          webRTCService.sendStream(data.id, audioPlayer.getRemoteStream(), "The thingy we sent");
        }
        $rootScope.$apply();
      });
    });

    return deferred.promise;
  };

  webRTCService.setUsername = function(name) {
    username = name;
  };

  webRTCService.setPeers = function (peerIds) {
    _(peerIds).forEach(function(peerId) {
      if (!myPeers[peerId]) {
        myPeers[peerId] = {
          username: defaultUsername,
          connection: peer.connect(peerId)
        };
      }
    });
    for (var peerId in myPeers) {
      if (!_.contains(peerIds, peerId)) {
        delete myPeers[peerId];
      }
    }
    webRTCService.pushUsername();
  };

  webRTCService.getPeers = function () {
    return myPeers;
  };

  webRTCService.pushTrack = function(track) {
    pushAll({
      id: myPeerId,
      track: track,
      type: 'track'
    });
  };

  webRTCService.pushUsername = function() {
    pushAll({
      id: myPeerId,
      name: username,
      type: 'username'
    });
  };

  webRTCService.requestStream = function (otherPeerId) {
    push(otherPeerId, {
      id: myPeerId,
      type: 'listen'
    })
  };

  function pushAll(data) {
    for (var id in myPeers) {
      push(id, data);
    }
  }

  function push(id, data) {
    var conn = myPeers[id].connection;
    $log.debug('pushed ' + data + ' to ' + id);
    if (conn.open) conn.send(data);
    else conn.on('open', function () {
      conn.send(data);
    });
    conn.on('error', function (msg) {
      $log.debug('error: ' + msg);
    });
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
