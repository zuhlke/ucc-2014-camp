myapp.controller('FriendsCtrl', function ($scope, webRTCService, FriendsService) {
  $scope.friends = FriendsService.friends;
});
