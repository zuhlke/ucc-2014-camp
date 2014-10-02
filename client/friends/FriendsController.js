myapp.controller('FriendsController', function(FriendsService) {
    var _root = this;
    this.list = FriendsService.friends;
});
