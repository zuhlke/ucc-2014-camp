myapp.controller('FriendsController', function(webRTCService, $log, audioPlayer) {
    var _root = this;
    this.list = webRTCService.getPeers();
    this.audioPlayer = audioPlayer;


  _root.openStream = function(destination) {
      this.audioPlayer.stop();
      webRTCService.requestStream(destination);
    }
});
