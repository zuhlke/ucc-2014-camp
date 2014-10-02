myapp.factory('FriendsService', function($rootScope, $log, webRTCService, socketService) {
  var friendsService = {}, socket = undefined;
  friendsService.friends = {};

  webRTCService.connect().then(function(id) {
    socket = socketService.connect();
    socket.emit('logon', webRTCService.id());
      socket.on('friends-update', function (newFriends) {
          $log.debug('Friends update received');
          $log.debug(newFriends);

          friendsService.friends.value = newFriends;
          webRTCService.setPeers(newFriends);
          $rootScope.$apply();
      });
  });

  return friendsService;
});

myapp.factory('socketService', function($window) {
  var socket = {};
  socket.connect = function () {
      return io('http://' + $window.location.hostname + ':9090');
  };
  return socket;
});
