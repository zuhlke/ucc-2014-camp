myapp.factory('audioService', function ($window) {

  $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

  var context = new AudioContext();
  var currentPlayingSource;

  var stop = function () {
    if (currentPlayingSource) currentPlayingSource.stop();
  };

  return {

    play: function (file) {
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        context.decodeAudioData(e.target.result, function (buffer) {
          stop();
          currentPlayingSource = context.createBufferSource();
          currentPlayingSource.buffer = buffer;
          currentPlayingSource.connect(context.destination);
          currentPlayingSource.start(0);
        });
      };
      fileReader.readAsArrayBuffer(file);
    },

    stop: stop
  };
});