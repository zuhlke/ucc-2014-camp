myapp.controller('TracksController', function ($scope, $rootScope, $log, audioService) {
  $scope.tracks = [];

  $scope.$on('fileDropped', function (event, files) {
    _(files).forEach(function (file) {
      $scope.tracks.push({
        file: file,
        name: file.name
      });
    });
  });

  $scope.play = function (track) {
    _.debounce(function () {
      audioService.loadAndPlay(track.file);
    }, 150)();
  };

  $scope.removeTrack = function (track) {
    _($scope.tracks).remove(function (t) {
      return t === track;
    });
  };

});