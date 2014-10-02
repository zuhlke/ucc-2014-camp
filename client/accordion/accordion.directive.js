function accordionController() {
    this.visibility = [
        {collapsed: false},
        {collapsed: true}
    ];

    this.show = function (index) {
        angular.forEach(this.visibility, function (value, key) {
            value.collapsed = index !== key;
        });
    }

}

myapp.directive('accordion', function () {
    return {
        restrict: 'A',
        controller: accordionController,
        controllerAs: 'accordion',
        scope: true
    };
});


