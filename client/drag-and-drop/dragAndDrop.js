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
                console.log(e.type);
            });

            element.bind('dragend', function (e) {
                element.removeClass(dragDropActiveClass);
                console.log(e.type);
            });

            element.bind('dragenter', function (e) {
                element.addClass(dragDropActiveClass);
                console.log(e.type);
            });

            element.bind('dragover', function (e) {
                console.log(e.type);
                e.preventDefault();
            });

            element.bind('dragleave', function (e) {
                element.removeClass(dragDropActiveClass);
                console.log(e.type);
            });

            element.bind('drop', function (e) {
                element.removeClass(dragDropActiveClass);

                e.preventDefault();
                var file = e.originalEvent.dataTransfer.files[0];
                scope.$apply(function () {
                    scope.$emit('fileDropped', file);
                });
                return false;
            });

        }
    };
});