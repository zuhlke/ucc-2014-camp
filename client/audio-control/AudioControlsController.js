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
        $('#player').load();
      });
    });

});