myapp.controller('AudioControlsController', function ($scope, audioService) {

  $scope.isPlaying = false;

  $scope.audio = {
    source: 'audio-example/TestFile.mp3'
  };

});
