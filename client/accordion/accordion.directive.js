function accordionController() {
    this.visibility = [
        {collapsed: false},
        {collapsed: true}
    ];


}

myapp.directive('accordion', function() {
    return {
        restrict: 'A',
        controller: accordionController,
        controllerAs: 'accordion',
        scope: true
    };
});


