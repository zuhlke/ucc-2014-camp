myapp.factory('webRTCService', function ($window, $http, $q, $log, $rootScope) {

  var peer;
  var myPeerId;
  var webRTCService = {};

  webRTCService.connect = function () {
    var deferred = $q.defer();

    if (peer) {
      deferred.resolve(myPeerId);
      return deferred.promise;
    }

    peer = new Peer({
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
      $log.debug("received metadata: " + call.metadata.trackName);

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

  webRTCService.getPeers = function () {
    return $http.get("http://" + $window.location.hostname + ":9090");
  };

  webRTCService.sendStream = function (peerId, stream, trackName) {
    peer.call(peerId, stream, { metadata: { trackName: trackName }});
  };

  webRTCService.connect().then(function (id) {
    $log.debug(id);
  });

  return webRTCService;

});