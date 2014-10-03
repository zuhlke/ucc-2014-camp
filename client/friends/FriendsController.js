myapp.controller('FriendsController', function(webRTCService, $log) {
    var _root = this;
    this.list = webRTCService.getPeers();

    _root.openStream = function(destination) {
      $log.debug('clicked on ' + destination);
      webRTCService.requestStream(destination);
    }
});
