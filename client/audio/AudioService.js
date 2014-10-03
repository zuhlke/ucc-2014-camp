function AudioService($rootScope, $log, audioPlayer, webRTCService) {
    this.audioPlayer = audioPlayer;

    $rootScope.$on('AudioPlayer.isPlaying', function (event, audio) {
        if (audio.isPlaying) {
            $log.debug('Sending stream');
            webRTCService.pushTrack(audio.trackName);
        }
    });

    $rootScope.$on('webRTCService.streamReceived', function (event, received) {
        var player = new Audio();
        player.src = URL.createObjectURL(received.stream);
        player.play();
    });
};

AudioService.prototype.selectTrack = function (track) {
    this.audioPlayer.load(track);
    this.audioPlayer.play();
};

AudioService.prototype.play = function () {
    this.audioPlayer.play();
};

AudioService.prototype.stop = function() {
    this.audioPlayer.stop();
};

AudioService.prototype.setVolume = function (value) {
    this.audioPlayer.setVolume(value);
};

// .service calls 'new' on the passed in function
angular.module('myapp').service('audioService', AudioService);

