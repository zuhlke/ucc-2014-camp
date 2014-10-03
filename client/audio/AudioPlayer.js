function AudioPlayer($rootScope, $q, $window) {

    $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

    this.context = new AudioContext();
    this.track = undefined;
    this.source = undefined;
    this.trackBuffer = undefined;
    this.gainNode = undefined;
    this.remoteStream = undefined;

    this.rootScope = $rootScope;
    this.q = $q;
}

AudioPlayer.prototype.load = function (track) {
    this.stop();
    this.track = track;

    var deferred = this.q.defer();
    var fileReader = new FileReader();
    fileReader.onload = angular.bind(this, function (e) {
        this.context.decodeAudioData(e.target.result, function (buffer) {
            deferred.resolve(buffer);
        });
    });
    fileReader.readAsArrayBuffer(track.file);

    this.rootScope.$broadcast('AudioPlayer.trackChanged', track);
    this.trackBuffer = deferred.promise;
};

AudioPlayer.prototype.play = function () {
    var context = this.context;
    var rootScope = this.rootScope;
    var track = this.track;
    var trackBuffer = this.trackBuffer;

    if (trackBuffer) {
        trackBuffer.then(angular.bind(this, function (buffer) {
            var source = context.createBufferSource();
            var remote = context.createMediaStreamDestination();
            var gainNode = context.createGain();

            source.buffer = buffer;
            source.connect(context.destination);
            gainNode.connect(context.destination);
            source.connect(remote);
            source.connect(gainNode);
            source.start(0);

            rootScope.$broadcast('AudioPlayer.isPlaying', {
                isPlaying: true,
                trackName: track.name,
                stream: remote.stream,
                trackLength : Math.round(source.buffer.duration)
            });

            this.source = source;
            this.gainNode = gainNode;
            this.remoteStream = remote.stream;
        }));
    }
};

AudioPlayer.prototype.stop = function () {
    if (this.source) {
        this.source.stop();
        this.rootScope.$broadcast('AudioPlayer.isPlaying', {
            isPlaying: false
        });
        this.remoteStream = undefined;
    }
};

AudioPlayer.prototype.setVolume = function (value) {
    if (this.gainNode) {
        this.gainNode.gain.value = value;
        this.rootScope.$broadcast('AudioPlayer.volumeChanged', value);
    }
};

AudioPlayer.prototype.getRemoteStream = function () {
    this.remoteStream;
};

// .service calls 'new' on the passed in function
angular.module('myapp').service('audioPlayer', AudioPlayer);
