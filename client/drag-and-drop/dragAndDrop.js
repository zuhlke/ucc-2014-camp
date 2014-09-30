myapp.directive('dragAndDrop', function ($rootScope) {

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var dragDropClass = 'drop-zone';
      var dragDropActiveClass = 'drop-zone_active';
      element.addClass(dragDropClass);

      element.attr("draggable", true);

      element.bind('dragstart', function (e) {
        element.addClass(dragDropActiveClass);
      });

      element.bind('dragend', function (e) {
        element.removeClass(dragDropActiveClass);
      });

      element.bind('dragenter', function (e) {
        element.addClass(dragDropActiveClass);
      });

      element.bind('dragover', function (e) {
        e.preventDefault();
      });

      element.bind('dragleave', function (e) {
        element.removeClass(dragDropActiveClass);
      });

      element.bind('drop', function (e) {
        e.preventDefault();

        element.removeClass(dragDropActiveClass);

        var files = e.originalEvent.dataTransfer.files;
        scope.$apply(function () {
          $rootScope.$broadcast('fileDropped', files);
        });
        return false;
      });

    }
  };
});