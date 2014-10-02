function userController() {
    var _root = this;

    this.id = null;
    this.name = {
        isInEditMode : true,
        value : null
    };

    this.toggleEditMode = function () {
        if(_root.name.value) {
            _root.name.isInEditMode = !_root.name.isInEditMode;
        }
    }
}

myapp.directive('user', function () {
    return {
        restrict: 'A',
        controller: userController,
        controllerAs: 'user',
        scope: true,
        templateUrl: 'partials/user/user.html'
    };
});
