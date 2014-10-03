myapp.controller('TracksController', function ($scope, $rootScope, $log, audioService) {
  $scope.tracks = [];

  $scope.$on('fileDropped', function (event, files) {
    _(files).forEach(function (file) {
      $scope.tracks.push({
        file: file,
        name: file.name,
        isPlaying: false
      });
    });
  });

  $scope.select = function (track) {
    _.debounce(function () { audioService.selectTrack(track) }, 150)();
  };

  $scope.$on('audioService.trackChanged', function (event, track) {
    angular.forEach($scope.tracks, function (value, key) {
      value.isPlaying = track.name === value.name;
    });
  });

});
