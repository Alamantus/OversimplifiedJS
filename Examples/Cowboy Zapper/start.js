// Create a master Game variable to store important information
var Game = {
    border : 12,
    player : null,
    ball : null,
    cowboys : null,
    maxCowboys : 50
};

function start () {
    OS.S.SetCamera(320, 240);
    
    OS.AddScript("rooms.js");
    OS.AddScript("objects.js");
}

// Extra functions for the other scripts to utilize
function GetCos (angle) {
    return Math.cos(angle * (Math.PI / 180));
}
function GetSin (angle) {
    return Math.sin(angle * (Math.PI / 180));
}
function RadToDeg (radians) {
    return radians / (Math.PI / 180);
}
function CoinFlip () {
    if (Math.random() >= 0.5) {
        return true;
    } else {
        return false;
    }
}
function RandomRange(min, max) {
  return Math.random() * (max - min) + min;
}