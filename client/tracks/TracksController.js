myapp.controller('TracksController', function ($scope, $rootScope, $log, audioService) {
    $scope.tracks = [];

    // public method for encoding an Uint8Array to base64
    function encode (input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        while (i < input.length) {
            chr1 = input[i++];
            chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
            chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
    }

    $scope.$on('fileDropped', function (event, files) {
        _(files).forEach(function (file) {
            id3(file, function (err, tags) {
                $log.debug("Loaded " + file.name + " tags " + JSON.stringify(tags));
                var trackname = file.name;
                if (tags.artist && tags.album && (tags.v1.track || tags.v2.track) && tags.title) {
                    trackname = tags.artist + " - " + tags.album + " - " + (tags.v1.track || tags.v2.track) + ". " + tags.title;
                }
                var imageSource = "";
                if (tags.v2.image.data) {
                    var bytes = new Uint8Array(tags.v2.image.data);
                    imageSource = "data:" + tags.v2.image.mime + ";base64," + encode(bytes);
                }
                $scope.$apply(function () {
                    $scope.tracks.push({
                        file: file,
                        name: trackname,
                        imageSource: imageSource,
                        isPlaying: false,
                        isSelected: false
                    });
                });
            });
        });
    });

    $scope.select = function (track) {
        _.debounce(function () {
            audioService.selectTrack(track)
        }, 150)();
        angular.forEach($scope.tracks, function (value, key) {
            value.isSelected = track.name === value.name;
        });
    };

    $scope.$on('AudioPlayer.isPlaying', function (event, audio) {
        angular.forEach($scope.tracks, function (value, key) {
            value.isPlaying = value.isSelected && audio.isPlaying;
        });
    });
});
