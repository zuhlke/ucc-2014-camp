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
      /*config: {'iceServers': [
        { url: 'stun1.l.google.com:19302' },
        { url: 'stun2.l.google.com:19302' },
        { url: 'stun3.l.google.com:19302' },
        { url: 'stun4.l.google.com:19302' }
      ]},*/
      host: $window.location.hostname,
      port: 9000
    });

    peer.on('open', function (id) {
      myPeerId = id;
      deferred.resolve(myPeerId);
      $rootScope.$broadcast('webrtc:open', myPeerId);
    });

    peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        //$rootScope.$broadcast('webrtc:data', data);

        var context = new AudioContext();
        var currentPlayingSource;
        currentPlayingSource = context.createBufferSource();
        currentPlayingSource.buffer = buffer;
        currentPlayingSource.connect(context.destination);
        currentPlayingSource.start(0);

      });
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
    var conn = peer.connect(peerId);
    conn.on('open', function () {
      conn.send(stream);
    });
  };

  return webRTCService;

});