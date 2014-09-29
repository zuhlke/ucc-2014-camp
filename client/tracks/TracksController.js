myapp.controller('TracksController', function ($scope, $rootScope) {
  $scope.tracks = [];

  $scope.$on('fileDropped', function (event, theFile) {
    $scope.tracks = [{
        name: theFile.name,
        file: theFile
      }];
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
});