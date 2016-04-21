OS.S.defaultStep = 1 / 120;
OS.S.numberOfScriptsToLoad = 16;
OS.S.pixelScale = 4;
// Oversimplified.DEBUG.showMessages = false;
OS.SetCamera({
	width: pixel(64),
	height: pixel(64),
	hBorder: pixel(24),
	vBorder: pixel(24)});

function start()
{
    OS.AddScript("loadControls.js");
    OS.AddScript("loadAudio.js");
    OS.AddScript("loadGameManager.js");
    OS.AddScript("loadPrefabs.js");
    OS.AddScript("loadGUIs.js");
    OS.AddScript("loadRooms.js");
}

function pixel(number) {
	return ((typeof number !== 'undefined') ? number : 1) * OS.S.pixelScale;
}

function secondsWorthOfFrames(seconds) {
	return seconds * (1 / OS.R[OS.R.currentRoom].stepSpeed);
}

function randomSmidge() {
// Return a random amount between -10 and 10 on the pixel scale.
	return (pixel(Math.round(Math.randomRange(-10, 10))));
}

function sortNumber(a, b) {
	return a - b;
}
