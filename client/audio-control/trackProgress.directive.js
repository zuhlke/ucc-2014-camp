function trackProgressDOM (scope, element, attrs) {
    var $progressBar = $('#progress-bar'),
        xPosition;
    element.on('mousedown.trackProgress', function(e) {
        xPosition = e.pageX - element.offset().left;
        $progressBar.css({'width': xPosition + 'px'});
    });

    scope.$watch('length', function() {
        $progressBar.css({'width': scope.length + '%'});
    },true);
}

function trackProgressController ($interval, $scope, audioPlayer) {
    var _root = this,
        timerHandler,
        timerInterval = 1000;
    this.track = {
        currentTime : 0,
        length : 0
    };
    $scope.length = 0;

    function startInterval () {
        timerHandler = $interval(function() {
            _root.track.currentTime++;
            repaintProgressBar();
        }, timerInterval);
    }

    function stopInterval () {
        $interval.cancel(timerHandler);
        timerHandler = undefined;
        _root.track.currentTime = 0;
        repaintProgressBar();
    }

    function repaintProgressBar () {
        $scope.length = _root.track.currentTime ? Math.round((_root.track.currentTime/_root.track.length) * 100) : 0;
    }

    $scope.$on('AudioPlayer.isPlaying', function(event, audio) {
        console.log(audioPlayer.context);
        if(audio.isPlaying) {
            _root.track.length = audio.trackLength;
            startInterval();
        } else {
            stopInterval();
        }
    });
}

function trackProgressDirective () {
    return {
        restrict: 'A',
        link: trackProgressDOM,
        controller: trackProgressController,
        controllerAs: 'trackProgress',
        scope : true
    };
}

angular.module('myapp').directive('trackProgress', trackProgressDirective);