myapp.controller('FriendsController', function(webRTCService) {
    var _root = this;
    this.list = webRTCService.getPeers();
});
