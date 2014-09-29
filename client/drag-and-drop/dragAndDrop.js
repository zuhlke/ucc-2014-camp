myapp.directive('dragAndDrop', function ($rootScope) {

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      element.attr("draggable", true);

      element.bind('dragstart', function(e) {
        console.log(e.type);
      });

      element.bind('dragend', function(e) {
        console.log(e.type);
      });

      element.bind('dragenter', function(e) {
        console.log(e.type);
      });

      element.bind('dragover', function(e) {
        console.log(e.type);
        e.preventDefault();
      });

      element.bind('dragleave', function(e) {
        console.log(e.type);
      });

      element.bind('drop', function(e) {
        e.preventDefault();
        var file = e.originalEvent.dataTransfer.files[0];
        scope.$apply(function() {
          scope.$emit('fileDropped', file);
        });
        return false;
      });

    }
  };
});