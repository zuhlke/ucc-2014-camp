// Getting the AudioContext objects
console.log(window.AudioContext);

// reference to audio tag
var audioElement = document.querySelector('audio');

var audioContext = new AudioContext();
var source = audioContext.createMediaElementSource(audioElement);

var gainNode = audioContext.createGain();
gainNode.gain.value = 0.5;
source.connect(gainNode);

gainNode.connect(audioContext.destination);


//source.start(0);
