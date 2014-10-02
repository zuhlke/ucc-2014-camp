myapp.factory('FriendsService', function(socket, webRTCService, $rootScope) {
  var friendsService = {};
  friendsService.friends = {};

  webRTCService.connect().then(function () {
    socket.emit('logon', webRTCService.id());
  });

  socket.on('friends-update', function (newFriends) {
    friendsService.friends.value = newFriends;
    console.log(newFriends);
    $rootScope.$apply();
  });

  return friendsService;
});

myapp.factory('socket', function() {
  return io('http://localhost:9090');
});
