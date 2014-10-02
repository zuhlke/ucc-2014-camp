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

  $scope.select = function (track) {
    _.debounce(function () {
      audioService.load(track)
    }, 150)();
  };

  $scope.removeTrack = function (track) {
    _($scope.tracks).remove(function (t) {
      return t === track;
    });
  };

});
