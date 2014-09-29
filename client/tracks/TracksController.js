myapp.controller('TracksController', function ($scope) {
  $scope.list = [
    {'name': '... no songs added ...' }
  ];

  $scope.fileDropped = function (file) {
    $scope.list.push({name: file.name})
  }
});