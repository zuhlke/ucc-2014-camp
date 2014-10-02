myapp.factory('webRTCService', function ($window, $http, $q) {

  var peer;
  var myPeerId;

  return {

    connect: function () {
      var deferred = $q.defer();
      peer = new Peer({host: $window.location.hostname, port: 9000 });

      peer.on('open', function (id) {
        myPeerId = id;
        deferred.resolve(myPeerId);
      });

      peer.on('connection', function (conn) {
        conn.on('data', function (data) {
          console.log(data);
        });
      });

      return deferred.promise;
    },

    id: function () {
      return myPeerId;
    },

    getPeers: function () {
      return $http.get("http://" + $window.location.hostname + ":9090");
    },

    sendMessage: function (peerId, message) {
      var conn = peer.connect(peerId);
      conn.on('open', function () {
        conn.send('hi from ' + navigator.userAgent);
      });
    }
  }

});
