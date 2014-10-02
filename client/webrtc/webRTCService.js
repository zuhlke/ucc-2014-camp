myapp.factory('webRTCService', function ($window, $http, $q, $rootScope, $log) {

  var peer;
  var myPeerId;
  var myPeers;
  var webRTCService = {};

  webRTCService.connect = function () {
    var deferred = $q.defer();

    if (peer) {
      deferred.resolve(myPeerId);
      return deferred.promise;
    }

    peer = new Peer({
      config: {'iceServers': [
        {url:'stun:stun.l.google.com:19302'},
        {url:'stun:stun1.l.google.com:19302'},
        {url:'stun:stun2.l.google.com:19302'},
        {url:'stun:stun3.l.google.com:19302'},
        {url:'stun:stun4.l.google.com:19302'}
      ]},
      host: $window.location.hostname,
      port: 9000
    });

    peer.on('open', function (id) {
      myPeerId = id;
      deferred.resolve(myPeerId);
      $rootScope.$broadcast('webrtc:open', myPeerId);
    });

    peer.on('call', function(call) {
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

    return deferred.promise;
  };

  webRTCService.id = function () {
    return myPeerId;
  };

  webRTCService.setPeers = function (peers) {
    myPeers = peers;
  };

  webRTCService.getPeers = function () {
    return myPeers;
  };

  webRTCService.sendStream = function (peerId, stream, trackName) {
    peer.call(peerId, stream, { metadata: { trackName: trackName }});
  };

  return webRTCService;
});
