myapp.controller('TracksController', function ($scope, $rootScope, $log, audioService) {
  $scope.tracks = [];

  $scope.$on('fileDropped', function (event, files) {
    _(files).forEach(function (file) {
      $scope.tracks.push({
        file: file,
        name: file.name,
        isPlaying: false,
        isSelected: false
      });
    });
  });

  $scope.select = function (track) {
    _.debounce(function () {
      audioService.selectTrack(track)
    }, 150)();
    angular.forEach($scope.tracks, function (value, key) {
      value.isSelected = track.name === value.name;
    });
  };

  $scope.$on('AudioPlayer.isPlaying', function(event, audio) {
    angular.forEach($scope.tracks, function (value, key) {
      value.isPlaying = value.isSelected && audio.isPlaying;
    });
  });
});
