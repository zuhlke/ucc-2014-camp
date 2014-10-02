myapp.factory('webRTCService', function ($window, $http, $q, $rootScope) {

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

        //var audioCtx = new AudioContext();
        //var source = audioCtx.createMediaStreamSource(stream);

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

  webRTCService.setPeers = function (peers) {
    myPeers = peers;
  };

  webRTCService.getPeers = function () {
    return myPeers;
  };

  webRTCService.sendMessage = function (peerId, message) {
    var conn = peer.connect(peerId);
    conn.on('open', function () {
      conn.send('hi from ' + navigator.userAgent);
    });
  };

  webRTCService.sendStream = function (peerId, stream) {
        //peer.call(friends[id], stream);
  };

  return webRTCService;

});
