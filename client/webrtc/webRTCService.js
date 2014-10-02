myapp.factory('webRTCService', function ($window, $http, $q, $rootScope) {

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
      console.log('Received call:' + call);
      console.log("received metadata: " + call.metadata.trackName);

      $rootScope.$broadcast('webRTCService.streamReceived', call.metadata.trackName);

      call.answer();

      call.on('stream', function (stream) {
        var player = new Audio();
        player.src = URL.createObjectURL(stream);
        player.play();
      });

    });

    peer.on('error', function (err) {
      console.log(err);
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
    console.log(id);
  });

  return webRTCService;

});