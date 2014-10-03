describe("An AudioPlayer", function () {

    var audioService;
    var audioPlayer;
    var webRTCService;

    var AudioContext;
    var FileReader;

    beforeEach(module('myapp'));

    beforeEach(inject(function ($injector) {
        window.AudioContext = function () {
        };

        window.AudioContext.createBufferSource = function () {
        };

        var rootScope = $injector.get('$rootScope');
        var log = $injector.get('$log');

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
                    this.onload({target: {result: 'Hello'}});
                }
            };
        });

        audioService.selectTrack(track);
        audioService.play();

        expect(AudioContext.createBufferSource).toHaveBeenCalled();
    });

});