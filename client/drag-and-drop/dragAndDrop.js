myapp.directive('dragAndDrop', function () {

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
        var fileReader = new FileReader();
        fileReader.onload = (function(theFile) {
          return function(e) {
            console.log(e.target.result);
            element.append($('<div>').attr('id', 'fileContent').text(e.target.result));
          };
        })(file);

        fileReader.readAsText(file);

        return false;
      });

    }
  };
});