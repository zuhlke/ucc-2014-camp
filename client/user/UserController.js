function UserController(webRTCService) {
    var self = this;

    self.id = null;
    self.name = {
        isInEditMode: true,
        value: null
    };

    self.toggleEditMode = function () {
        if (self.name.value) {
            self.name.isInEditMode = !self.name.isInEditMode;
            webRTCService.setUsername(self.name.value);
            webRTCService.pushUsername();
        }
    }

    self.setName = function (keyEvent) {
        if (keyEvent.keyCode === 13) {
            self.toggleEditMode();
        }
    }

}

angular.module('myapp').controller('UserController', UserController);



