myapp.controller('TracksController', function($scope) {

    function addTrack (name, author) {
        var newTrack = {'name' : name, 'author' : author};
        $scope.list.push(newTrack);
    }

    function removeTrack (position) {
        $scope.list.splice(position,1);
    }

    $scope.list = [
        {'name':'Song1', 'currentlyPlaying' : true },
        {'name':'Song2' },
        {'name':'Song3' },
        {'name':'Song4' }
    ];

    $scope.addNewTrack = addTrack;
    $scope.removeTrack = removeTrack;
    $scope.fileDropped = function (file) {
        $scope.list.push({name: file.name})
    }
});