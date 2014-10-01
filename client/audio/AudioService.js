myapp.factory('audioService', function ($window, $q) {

  $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

  var context = new AudioContext();
  var currentPlayingSource;
  var currentTrack;

  var audioService = {};
  audioService.play = function (newBuffer) {
    if (!audioService.isPlaying) {
      var buffer = (newBuffer) ? buffer : currentPlayingSource.buffer;
      currentPlayingSource = context.createBufferSource();
      currentPlayingSource.buffer = buffer;
      currentPlayingSource.connect(context.destination);
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
        audioService.play(buffer);
        p.resolve();
      });
    };
    fileReader.readAsArrayBuffer(file);
    return p.promise;
  };

  audioService.isPlaying = false;

  return audioService;
});
