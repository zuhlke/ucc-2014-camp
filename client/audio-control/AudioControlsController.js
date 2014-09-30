myapp.controller('AudioControlsController', function ($scope, audioService, webRTCService) {

  $scope.audioService = audioService;

  $scope.play = function () {

    webRTCService.connect()
      .then(function(id) {
        console.log('My ID is: ' + id);
        return webRTCService.getPeers();
      })
      .then(function(result) {
        console.log('Available peers: ' + result.data);
        _(result.data.peers).forEach(function(peer) {
          webRTCService.sendMessage(peer, 'Hello');
        });
      });

    _.debounce(function() { audioService.play(); $scope.$apply(); }, 150)();
  };

  $scope.pause = function () {
    _.debounce(function() { audioService.stop(); $scope.$apply(); }, 150)();
  };


});
