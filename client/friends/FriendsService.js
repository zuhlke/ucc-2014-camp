myapp.factory('FriendsService', function(webRTCService, socketService, $rootScope) {
  var friendsService = {}, socket = undefined;
  friendsService.friends = {};

  webRTCService.connect().then(function(id) {
    socket = socketService.connect();
    socket.emit('logon', webRTCService.id());
      socket.on('friends-update', function (newFriends) {
          console.log('friends update received');
          console.log(newFriends);
          friendsService.friends.value = newFriends;
          webRTCService.setPeers(newFriends);
          $rootScope.$apply();
      });
  });
  return friendsService;
});

myapp.factory('socketService', function() {
  var socket = {};
  socket.connect = function () {
      return io('http://localhost:9090');
  };
  return socket;
});
