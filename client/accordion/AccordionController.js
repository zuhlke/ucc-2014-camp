function AccordionController() {
    this.visibility = [
        {collapsed: false},
        {collapsed: true}
    ];
}

AccordionController.prototype.show = function (index) {
    angular.forEach(this.visibility, function (value, key) {
        value.collapsed = index !== key;
    });
}

angular.module('myapp').controller('AccordionController', AccordionController);




