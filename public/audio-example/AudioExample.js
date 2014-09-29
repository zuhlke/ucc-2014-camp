// Getting the AudioContext objects
console.log(window.AudioContext);

// reference to audio tag
var audioElement = document.querySelector('audio');

var audioContext = new AudioContext();
var source = audioContext.createMediaElementSource(audioElement);

