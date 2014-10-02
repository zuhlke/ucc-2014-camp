myapp.factory('audioService', function ($window, $q, webRTCService) {

  $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

  var context = new AudioContext();
  var currentPlayingSource;
  var currentTrack;

  var audioService = {};

  audioService.play = function () {
    if (!audioService.isPlaying && currentPlayingSource) {
      currentPlayingSource.start(0);
      audioService.isPlaying = true;
    }
  };

  audioService.stop = function () {
    if (audioService.isPlaying && currentPlayingSource) {
      currentPlayingSource.stop();
      audioService.isPlaying = false;
    }
  };

  audioService.loadAndPlay = function (file) {
    currentTrack = file;

    var p = $q.defer();

    var fileReader = new FileReader();
    fileReader.onload = function (e) {
      context.decodeAudioData(e.target.result, function (buffer) {
        audioService.stop();

        currentPlayingSource = context.createBufferSource();
        currentPlayingSource.buffer = buffer;
        currentPlayingSource.connect(context.destination);

        var remote = context.createMediaStreamDestination();

        currentPlayingSource.connect(remote);

        audioService.play();

        p.resolve();

        audioService.sendStream(remote.stream);
      });
    };

    fileReader.readAsArrayBuffer(file);
    return p.promise;
  };

  audioService.sendStream = function (stream) {
    webRTCService.getPeers()
      .then(function (result) {
        _(result.data.peers).filter(function (p) {
          return p !== webRTCService.id();
      })
      .first(function (peer) {
        console.log('Sending stream to: ' + peer);
        webRTCService.sendStream(peer, stream);
      });
    });
  };

  audioService.isPlaying = false;

  return audioService;
});
