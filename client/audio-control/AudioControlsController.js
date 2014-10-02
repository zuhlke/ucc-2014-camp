myapp.controller('AudioControlsController', function ($scope, audioService, webRTCService) {

  $scope.currentTrackName = "";

  $scope.play = function () {
    _.debounce(function() { audioService.play(); $scope.$apply(); }, 150)();
  };

  $scope.pause = function () {
    _.debounce(function() { audioService.stop(); $scope.$apply(); }, 150)();
  };

  $scope.$on('audioService.trackChanged', function(event, track) {
    $scope.$apply(function() {
      $scope.currentTrackName = track.name;
    });
  });

  $scope.$on('webRTCService.streamReceived', function(event, received) {
    $scope.$apply(function() {
      $scope.currentTrackName = received.trackName;
    });
  });

  $scope.$on('AudioPlayer.isPlaying', function(event, audio) {
    $scope.isPlaying = audio.isPlaying;
  });

});
