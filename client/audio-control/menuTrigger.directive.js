myapp.directive('menuTrigger', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var $wrapper = $('#wrapper');
      element.on('click.menuTrigger', function() {
        $wrapper.toggleClass('l-wrapper_extended');
      });
    }
  };
});