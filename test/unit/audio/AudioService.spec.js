describe("An AudioPlayer", function () {

    var audioService;
    var audioPlayer;
    var webRTCService;

    var FileReader;
    var callback;
    var rootScope;

    var source = {
        buffer: '',
        connect: function () {
        },
        start: function () {
        }
    };

    beforeEach(module('myapp'));

    beforeEach(inject(function ($injector) {
        rootScope = $injector.get('$rootScope');
        var log = $injector.get('$log');

        window.AudioContext = function () {
            this.destination = '';
        };

        window.AudioContext.prototype.createBufferSource = function () {
            return source;
        };

        window.AudioContext.prototype.createMediaStreamDestination = function () {
            return {
                stream: ''
            };
        };

        window.AudioContext.prototype.createGain = function () {
            return {
                connect: function () {
                }
            };
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

        spyOn(source, 'start').and.callThrough();
        spyOn(window.AudioContext.prototype, 'createBufferSource').and.callThrough();
        spyOn(window.AudioContext.prototype, 'createMediaStreamDestination').and.callThrough();
        spyOn(window.AudioContext.prototype, 'createGain').and.callThrough();

        FileReader = spyOn(window, 'FileReader').and.callFake(function () {
            return {
                readAsArrayBuffer: function (track) {
                    this.onload({target: {result: 'BLOB'}});
                }
            };
        });

        audioService.selectTrack(track);

        // trigger file loaded and resolve the promises by calling digest
        callback({});
        rootScope.$digest();

        audioService.play();

        expect(source.start).toHaveBeenCalled();
    });

});