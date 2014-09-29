myapp.controller('TracksController', function() {
    var _root = this;

    function addTrack (name, author) {
        var newTrack = {'name' : name, 'author' : author};
        _root.list.push(newTrack);
    }

    function removeTrack (position) {
        _root.list.splice(position,1);
    }

    this.list = [
        {'name':'Song1', 'currentlyPlaying' : true },
        {'name':'Song2' },
        {'name':'Song3' },
        {'name':'Song4' }
    ];

    this.addNewTrack = addTrack;
    this.removeTrack = removeTrack;
    this.fileDropped = function (file) {
        _root.list.push({name: file.name})
    }
});