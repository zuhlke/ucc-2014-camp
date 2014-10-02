myapp.directive('trackProgress', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var $progressBar = $('#progress-bar'),
          xPosition;
      element.on('mousedown.trackProgress', function(e) {
        xPosition = e.pageX - element.offset().left;
        $progressBar.css({'width': xPosition + 'px'});
      });
    }
  };
});