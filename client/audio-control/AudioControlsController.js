myapp.controller('AudioControlsController', function ($scope, audioService) {

  $scope.isPlaying = false;

  $scope.play = function () {
    _.debounce(audioService.play, 150)();
  };

  $scope.pause = function () {
    _.debounce(audioService.stop, 150)();
  };

  $scope.$on('playing', function(track) {
    $scope.isPlaying = true;
  });

  $scope.$on('stopped', function(track) {
    $scope.isPlaying = false;
  });

});
