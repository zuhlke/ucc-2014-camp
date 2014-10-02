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
      call.answer();
      call.on('stream', function (stream) {
        console.log('Received stream:' + stream);
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

  webRTCService.sendMessage = function (peerId, message) {
    var conn = peer.connect(peerId);
    conn.on('open', function () {
      conn.send('hi from ' + navigator.userAgent);
    });
  };

  webRTCService.sendStream = function (peerId, stream) {
    peer.call(peerId, stream);
  };

  webRTCService.connect().then(function (id) {
    console.log(id);
  });

  return webRTCService;

});