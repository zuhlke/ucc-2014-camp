myapp.controller('TracksController', function ($scope, $rootScope) {
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
    var fileReader = new FileReader();
    fileReader.onload = (function (theFile) {
      return function (e) {
        $rootScope.$broadcast('startPlaying', e.target.result);
      };
    })(track.file);
    fileReader.readAsDataURL(track.file);
  };

  $scope.removeTrack = function (track) {
    _($scope.tracks).remove(function (t) {
      return t === track;
    });
  };

});