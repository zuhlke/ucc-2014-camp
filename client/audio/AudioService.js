myapp.factory('audioService', function ($rootScope, $window, $q, $log, webRTCService) {

  $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

  var context = new AudioContext();
  var currentPlayingSource;
  var currentBuffer;
  var currentTrackName;
  var gainNode = context.createGain();

  var audioService = {};

  audioService.isPlaying = false;

  audioService.setVolume = function(value) {
    gainNode.gain.value = value;
  };

  audioService.play = function () {
    if (!audioService.isPlaying) {

      audioService.isPlaying = true;
      $rootScope.$broadcast('audioService.isPlaying', audioService.isPlaying);

      currentBuffer.then(function (buffer) {
        var remote = context.createMediaStreamDestination();
        currentPlayingSource = context.createBufferSource();
        currentPlayingSource.buffer = buffer;
        currentPlayingSource.connect(context.destination);
        gainNode.connect(context.destination);
        currentPlayingSource.connect(gainNode);

        currentPlayingSource.connect(remote);
        audioService.play();

        audioService.sendStream(remote.stream);
        currentPlayingSource.start(0);
      });
    }
  };

  audioService.stop = function () {
    if (audioService.isPlaying) {
      audioService.isPlaying = false;
      $rootScope.$broadcast('audioService.isPlaying', audioService.isPlaying);
    }

    if (currentPlayingSource) {
      currentPlayingSource.stop();
      currentPlayingSource = false
    }
  };

  audioService.load = function(track) {
    $log.debug("Loading track " + track);
    $rootScope.$broadcast('audioService.trackChanged', track);
    currentTrackName = track.name;
    var deferred = $q.defer();
    currentBuffer = deferred.promise;
    var fileReader = new FileReader();
    fileReader.onload = function (e) {
      context.decodeAudioData(e.target.result, function (buffer) {
        deferred.resolve(buffer);
      });
    };
    fileReader.readAsArrayBuffer(track.file);
  };

  audioService.sendStream = function (stream) {
    webRTCService.getPeers()
      .then(function (result) {
        _(result.data.peers).filter(function (p) {
          return p !== webRTCService.id();
      })
      .first(function (peer) {
        $log.debug('Sending stream to: ' + peer);
        webRTCService.sendStream(peer, stream, currentTrackName);
      });
    });
  };

  $rootScope.$on('webRTCService.streamReceived', function(event, received) {
    var player = new Audio();
    player.src = URL.createObjectURL(received.stream);
    player.play();
  });

  return audioService;
});
