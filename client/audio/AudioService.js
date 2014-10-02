myapp.factory('audioService', function ($window, $q, webRTCService) {

    $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

    var context = new AudioContext();
    var currentPlayingSource;
    var currentTrack;
    var gainNode = context.createGain();

    var audioService = {};

    audioService.setVolume = function (value) {
        gainNode.gain.value = value;
    };

    audioService.play = function () {
        if (!audioService.isPlaying && currentPlayingSource) {
            currentPlayingSource.start(0);
            audioService.isPlaying = true;
        }
    };

    audioService.stop = function () {
        if (audioService.isPlaying && currentPlayingSource) {
            currentPlayingSource.stop();
            audioService.isPlaying = false;
        }
    };

    audioService.loadAndPlay = function (file) {
        currentTrack = file;

        var p = $q.defer();

        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            context.decodeAudioData(e.target.result, function (buffer) {
                audioService.stop();

                currentPlayingSource = context.createBufferSource();
                currentPlayingSource.buffer = buffer;
                currentPlayingSource.connect(context.destination);
                gainNode.connect(context.destination);
                currentPlayingSource.connect(gainNode);

                var remote = context.createMediaStreamDestination();

                currentPlayingSource.connect(remote);

                audioService.play();

                p.resolve();

                audioService.sendStream(remote.stream);
            });
        };

        fileReader.readAsArrayBuffer(file);
        return p.promise;
    };

    audioService.sendStream = function (stream) {
        var peers = webRTCService.getPeers();
        console.log(peers);
        for (var friend in peers) {
            console.log('Sending stream to: ' + friend);
            webRTCService.sendStream(peers[friend], stream);
        }
    };

    audioService.isPlaying = false;
    return audioService;
});
