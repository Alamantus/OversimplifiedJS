var rm_Ocean = OS.R.Add("Default", {
	// Putting my room "constants" here.
	width: pixel(64) * 50,	//50x45 map of 64x64 squares. This will allow a single pixel on the map to represent a 64x square and fit comfortably on screen.
	height: pixel(64) * 44,
	backgroundColor: "#1b2632",
	squaresX: 50,
	squaresY: 44,
	squareSize: pixel(64),
	numberOfIslands: 10,
	clockTimerCutoff: ((1 / OS.S.defaultStep) * 60) * 5	// 5 minute day.
});
// Load external GUI here.
rm_Ocean.speedGaugeImg = new Image();
rm_Ocean.speedGaugeImg.src = "images/speed_gauge_sheet.png";
rm_Ocean.clockImg = new Image();
rm_Ocean.clockImg.src = "images/clock_sheet.png";

function loadRooms() {
    OS.AddScript("rooms/oceanRoom.js");
    
    OS.SetRoom(rm_Ocean);
}
