myapp.controller('PlaylistsController', function() {
    var _root = this;

    this.list = [
        {'name':'My playlist1' },
        {'name':'My playlist2' }
    ];

    function addPlaylist (name) {
        var newPlaylist = {'name' : name};
        _root.list.push(newPlaylist);
    }

    function removePlaylist (position) {
        _root.list.splice(position,1);
    }

    this.addNewPlaylist = addPlaylist;
    this.removePlaylist = removePlaylist;
});