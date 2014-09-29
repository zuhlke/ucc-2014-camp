myapp.controller('AudioControlsController', function($scope, $sce, $timeout, $log) {
    $scope.name = 'Audio Controls';
    $scope.audio = {
      source: 'audio-example/TestFile.mp3'
    };

    $scope.$on('startPlaying', function(event, audioStream) {
      $log.debug('Received startPlaying event');

      // Otherwise blocked by $secDelegate
      $scope.audio.source = $sce.trustAsResourceUrl(audioStream);

      $scope.$apply();

      $timeout(function() {
        var player = $('#player')[0];
        player.load();
      });
    });

    $scope.play = function() {
      var player = $('#player')[0];
      player.play();
    };

    $scope.stop = function() {
      var player = $('#player')[0];
      player.pause();
    }

});
