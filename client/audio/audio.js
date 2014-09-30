myapp.directive('ngAudio', function () {

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      scope.play = function () {
        scope.isPlaying = true;
        $('#player')[0].play();
      };

      scope.pause = function () {
        scope.isPlaying = false;
        $('#player')[0].pause();
      };

      scope.$on('startPlaying', function (event, audioStream) {
        var player = $('#player')[0];
        player.load();
        player.play();
      });
    }
  };

});