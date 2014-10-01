myapp.controller('AudioControlsController', function ($scope, audioService, webRTCService) {

  $scope.audioService = audioService;

  $scope.play = function () {
    webRTCService.connect().then(function(id) {
      console.log(id);
    });
    _.debounce(function() { audioService.play(); $scope.$apply(); }, 150)();
  };

  $scope.pause = function () {
    _.debounce(function() { audioService.stop(); $scope.$apply(); }, 150)();
  };

});
