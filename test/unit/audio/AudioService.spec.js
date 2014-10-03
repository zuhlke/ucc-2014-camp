describe("An AudioPlayer", function () {

    var audioService;
    var audioPlayer;
    var webRTCService;

    var AudioContext;

    beforeEach(module('myapp'));

    beforeEach(inject(function ($injector) {
        window.AudioContext = function() {
        };

        window.AudioContext.createBufferSource = function() {
        };

        AudioContext = spyOn(window, 'AudioContext');
        spyOn(AudioContext, 'createBufferSource');

        var rootScope = $injector.get('$rootScope');
        var log = $injector.get('$log');

        audioPlayer = $injector.get('audioPlayer');
        webRTCService = $injector.get('webRTCService');

        audioService = new AudioService(rootScope, log, audioPlayer, webRTCService);
    }));

    it('should play a track', function () {
        var track = {
            file: function() {
                return 'BLOB';
            }
        };

        audioService.selectTrack(track);
        audioService.play();

        expect(AudioContext.createBufferSource).toHaveBeenCalled();
    });

})
;