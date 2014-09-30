myapp.factory('audioService', function ($window, $rootScope) {

  $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

  var context = new AudioContext();
  var currentPlayingSource;
  var currentTrack;

  var play = function () {
    if (currentPlayingSource) {
      currentPlayingSource.start(0);
      $rootScope.$broadcast('playing', currentTrack);
    }
  };

  var stop = function () {
    if (currentPlayingSource) {
      currentPlayingSource.stop();
      $rootScope.$broadcast('stopped', currentTrack);
    }
  };

  return {

    loadAndPlay: function (file) {
      currentTrack = file;
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        context.decodeAudioData(e.target.result, function (buffer) {
          stop();
          currentPlayingSource = context.createBufferSource();
          currentPlayingSource.buffer = buffer;
          currentPlayingSource.connect(context.destination);
          play();
        });
      };
      fileReader.readAsArrayBuffer(file);
    },

    play: play,

    stop: stop

  };
});