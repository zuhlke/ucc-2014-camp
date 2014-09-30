// Getting the AudioContext objects
console.log(window.AudioContext);

// reference to audio tag
var audioElement = document.querySelector('audio');

var audioContext = new AudioContext();
var source = audioContext.createBufferSource();

var request = new XMLHttpRequest();
request.open("GET", "TestFile.mp3", true); // Path to Audio File
request.responseType = "arraybuffer"; // Read as Binary Data

request.onload = function () {
    var incomingData = request.response;

    audioContext.decodeAudioData(incomingData, function (buffer) {
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);
        },
        function (e) {
            "Error with decoding audio data" + e.err;
        });

};

request.send();
