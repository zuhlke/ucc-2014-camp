myapp.factory('AudioPlayer', function ($rootScope, $q, $window) {

  $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;

  var context = new AudioContext();

  var AudioPlayer = function(track) {
    this.context = context;
    this.track = track;
    this._trackBuffer = this._load(track);
    this._gainNode = context.createGain();
    this._isPlaying = false;
    $rootScope.$broadcast('AudioPlayer.trackChanged', track);
  };

  AudioPlayer.prototype._load = function(track) {
    var deferred = $q.defer();
    var fileReader = new FileReader();
    fileReader.onload = function (e) {
      context.decodeAudioData(e.target.result, function (buffer) {
        deferred.resolve(buffer);
      });
    };
    fileReader.readAsArrayBuffer(track.file);
    return deferred.promise;
  };

  AudioPlayer.prototype.play = function() {
    // Generally, javascript callbacks, change the value of the "this" variable inside it
    // so we need to keep a reference to the current instance "this".
    var self = this;

    this._trackBuffer.then(function(buffer) {
      self._source = context.createBufferSource();
      self._remote =  context.createMediaStreamDestination();
      self._source.buffer = buffer;
      self._source.connect(context.destination);
      self._gainNode.connect(context.destination);
      self._source.connect(self._gainNode);
      self._source.connect(self._remote);
      self._source.start(0);

      self._isPlaying = true;

      $rootScope.$broadcast('AudioPlayer.isPlaying', {
        isPlaying: self._isPlaying,
        trackName: self.track.name,
        stream: self._remote.stream
      });
    });

  };

  AudioPlayer.prototype.stop = function() {
    this._source && this._source.stop();
    this._isPlaying = false;
    $rootScope.$broadcast('AudioPlayer.isPlaying', {
      isPlaying: this._isPlaying
    });
  };

  AudioPlayer.prototype.setVolume = function(value) {
    this._gainNode.gain.value = value;
  };

  return AudioPlayer;

});