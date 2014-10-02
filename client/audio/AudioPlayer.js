function AudioPlayer($rootScope, $q, $window) {

    $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

    this.context = new AudioContext();
    this.track = undefined;
    this._trackBuffer = undefined;
    this._gainNode = this.context.createGain();
    this._isPlaying = false;

    this.rootScope = $rootScope;
    this.q = $q;

}

AudioPlayer.prototype.load = function (track) {
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
    this._trackBuffer = deferred.promise;

};

AudioPlayer.prototype.play = function () {

    this._trackBuffer.then(angular.bind(this, function (buffer) {
        this._source = this.context.createBufferSource();
        this._remote = this.context.createMediaStreamDestination();
        this._source.buffer = buffer;
        this._source.connect(this.context.destination);
        this._gainNode.connect(this.context.destination);
        this._source.connect(this._gainNode);
        this._source.connect(this._remote);
        this._source.start(0);

        this._isPlaying = true;

        this.rootScope.$broadcast('AudioPlayer.isPlaying', {
            isPlaying: this._isPlaying,
            trackName: this.track.name,
            stream: this._remote.stream
        });
    }));

};

AudioPlayer.prototype.stop = function () {
    this._source && this._source.stop();
    this._isPlaying = false;
    this.rootScope.$broadcast('AudioPlayer.isPlaying', {
        isPlaying: this._isPlaying
    });
};

AudioPlayer.prototype.setVolume = function (value) {
    if (this._gainNode) {
        this._gainNode.gain.value = value;
        this.rootScope.$broadcast('AudioPlayer.volumeChanged', value);
    }
};


angular.module('myapp').service('audioPlayer', AudioPlayer);

