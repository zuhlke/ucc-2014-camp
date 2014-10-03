describe("An AudioPlayer", function () {

    var audioService;
    var audioPlayer;
    var webRTCService;

    var AudioContext;
    var FileReader;

    var callback;

    beforeEach(module('myapp'));

    beforeEach(inject(function ($injector) {
        var rootScope = $injector.get('$rootScope');
        var log = $injector.get('$log');

        window.AudioContext = function () {
        };

        window.AudioContext.createBufferSource = function () {
        };

        window.AudioContext.prototype.decodeAudioData = function (object, cb) {
            callback = cb;
        };

        audioPlayer = $injector.get('audioPlayer');
        webRTCService = $injector.get('webRTCService');

        audioService = new AudioService(rootScope, log, audioPlayer, webRTCService);
    }));

    it('should play a track', function () {
        var track = {file: 'BLOB'};

        AudioContext = spyOn(window, 'AudioContext');
        spyOn(AudioContext, 'createBufferSource');

        FileReader = spyOn(window, 'FileReader').and.callFake(function () {
            return {
                readAsArrayBuffer: function (track) {
                    this.onload({target: {result: 'BLOB'}});
                }
            };
        });

        audioService.selectTrack(track);

        // trigger file loaded
        callback({});

        audioService.play();

        expect(AudioContext.createBufferSource).toHaveBeenCalled();
    });

});