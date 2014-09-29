myapp.directive('dragAndDrop', function () {

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      function handleDragStart(e) {
        console.log("Start");
      }

      function handleDragOver(e) {
        console.log("Drag Over");
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
      }

      function handleDragEnter(e) {
        console.log("Drag Enter");
        this.style.opacity = '0.4';  // this / e.target is the source node.
        this.classList.add('over');
      }

      function handleDragLeave(e) {
        console.log("Drag Leave");
        this.style.opacity = '1';  // this / e.target is the source node.
        this.classList.remove('over');  // this / e.target is previous target element.
      }

      element.attr("draggable", true);
      element.bind('dragstart', handleDragStart);
      element.bind('dragenter', handleDragEnter);
      element.bind('dragover', handleDragOver);
      element.bind('dragleave', handleDragLeave);

    }
  };
});