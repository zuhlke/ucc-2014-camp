myapp.factory('audioService', function ($rootScope, $log, AudioPlayer, webRTCService) {

  var audioService = {};

  var audioPlayer;

  audioService.selectTrack = function (track) {
    audioPlayer = new AudioPlayer(track);
  };

  audioService.play = function () {
    audioPlayer && audioPlayer.play();
  };

  audioService.stop = function () {
    audioPlayer && audioPlayer.stop();
  };

  audioService.setVolume = function (value) {
    audioPlayer && audioPlayer.setVolume(value);
  };

  $rootScope.$on('AudioPlayer.isPlaying', function (event, audio) {
    if (audio.isPlaying) {
      var peers = webRTCService.getPeers();
        if(peers.length > 0) {
          $log.debug('Sending stream to: ' + peers[0]);
          webRTCService.sendStream(peers[0], audio.stream, audio.trackName);
        }
    }
  });

  $rootScope.$on('webRTCService.streamReceived', function (event, received) {
    var player = new Audio();
    player.src = URL.createObjectURL(received.stream);
    player.play();
  });

  return audioService;
});
