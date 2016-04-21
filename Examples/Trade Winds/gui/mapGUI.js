function mapGUI() {
	guiControl.map = {
		show: false,
		activateDelay: 0
	}
}

function drawMapGUI() {
	if (guiControl.map && guiControl.map.show) {
		guiControl.map.activateDelay -= (guiControl.map.activateDelay > 0) ? 1 : 0;

		OS.context.drawImage(guiControl.background, 0, 0, 240, 240, pixel(2), pixel(2), 240, 240);
		
		// Title
		guiControl.drawPixelText("Map", guiControl.leftBorder + pixel(10), guiControl.topOfBackground, 8, "black", 6);

		guiControl.drawPageArrow("left", pixel(4), guiControl.topOfBackground);
		guiControl.drawPageArrow("right", OS.camera.width - pixel(4) - pixel(4), guiControl.topOfBackground);

		var saveFillStyle = OS.context.fillStyle;

		var mapLeft = guiControl.leftBorder - pixel(5);
		var mapTop = guiControl.upperBorder;

	    OS.context.fillStyle = "#0000CC";
	    OS.context.fillRect(mapLeft, mapTop, pixel(50), pixel(45));

	    OS.context.fillStyle = "#00FF00";
	    for (var m = 0; m < G.map.length; m++) {
		    var pixelLeft = mapLeft + pixel(G.map[m].drawX);
		    var pixelTop = mapTop + pixel(G.map[m].drawY);
		    OS.context.fillRect(pixelLeft, pixelTop, pixel(), pixel());
	    }

	    OS.context.fillStyle = "#FF0000";
	    OS.context.fillRect(mapLeft + G.player.mapX, mapTop + G.player.mapY, pixel(), pixel());

	    OS.context.fillStyle = saveFillStyle;
		
		// Button Action
		if (guiControl.map.activateDelay <= 0) {
			if (ct_confirm().down || ct_cancel().down || ct_m.down) {
				guiControl.map.show = false;
			}
			if (ct_left().down) {
				guiControl.map.show = false;
				guiControl.inventory.activateDelay = 5;
				guiControl.inventory.show = true;
			}
			if (ct_right().down) {
				guiControl.map.show = false;
				guiControl.inventory.activateDelay = 5;
				guiControl.inventory.show = true;
			}
		}
	}
}
