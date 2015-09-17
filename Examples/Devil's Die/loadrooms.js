var rm_TitleScreen = OS.R.Add("Default", OS.camera.width, OS.camera.height, "");
var rm_GameBoard = OS.R.Add("Game Board", OS.camera.width, OS.camera.height, "");

function loadrooms() {
    OS.AddScript("rooms/default_room.js");
	OS.AddScript("rooms/gameboard_room.js");
	
	OS.SetRoom(rm_TitleScreen);
}