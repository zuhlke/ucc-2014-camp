function UserController(webRTCService) {
  this.id = null;
  this.name = {
    isInEditMode: true,
    value: null
  };
  this.webRTCService = webRTCService;
}

UserController.prototype.toggleEditMode = function () {
  if (this.name.value) {
    this.name.isInEditMode = !this.name.isInEditMode;
    this.webRTCService.setUsername(this.name.value);
    this.webRTCService.pushUsername();
  }
}

angular.module('myapp').controller('UserController', UserController);