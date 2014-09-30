myapp.controller('AudioControlsController', function ($scope, audioService) {

  $scope.audioService = audioService;

  $scope.play = function () {
    _.debounce(function() { audioService.play(); $scope.$apply(); }, 150)();
  };

  $scope.pause = function () {
    _.debounce(function() { audioService.stop(); $scope.$apply(); }, 150)();
  };


});
