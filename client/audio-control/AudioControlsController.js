myapp.controller('AudioControlsController', function ($scope, $sce, $timeout) {

  $scope.isPlaying = false;

  $scope.audio = {
    source: 'audio-example/TestFile.mp3'
  };

  $scope.$on('startPlaying', function (event, audioStream) {
    // Otherwise blocked by $secDelegate
    $scope.audio.source = $sce.trustAsResourceUrl(audioStream);
    $scope.play();
  });

});
