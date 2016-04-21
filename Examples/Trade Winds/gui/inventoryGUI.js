function inventoryGUI() {
	guiControl.inventory = {
		screen: "main",
		cursorPosition: 0,
		show: false,
		activateDelay: 0
	}
}

function drawInventoryGUI() {
	if (guiControl.inventory && guiControl.inventory.show) {
		guiControl.inventory.activateDelay -= (guiControl.inventory.activateDelay > 0) ? 1 : 0;

		OS.context.drawImage(guiControl.background, 0, 0, 240, 240, pixel(2), pixel(2), 240, 240);

		if (ct_down().down) {
			guiControl.inventory.cursorPosition++;
		}
		if (ct_up().down) {
			guiControl.inventory.cursorPosition--;
		}
		
		if (guiControl.inventory.screen == "main") {
			// Limit Cursor
			if (guiControl.inventory.cursorPosition < 0) {
				guiControl.inventory.cursorPosition = 3;
			}
			if (guiControl.inventory.cursorPosition > 3) {
				guiControl.inventory.cursorPosition = 0;
			}

			// Title
			guiControl.drawPixelText("Storage", guiControl.leftBorder - pixel(2), guiControl.topOfBackground, 8, "black", 6);

			guiControl.drawPageArrow("left", pixel(4), guiControl.topOfBackground);
			guiControl.drawPageArrow("right", OS.camera.width - pixel(4) - pixel(4), guiControl.topOfBackground);

			// Money icon
			guiControl.drawIcon(7, 2, guiControl.leftBorder, guiControl.rowTop(0));
			guiControl.drawPixelText(G.inventory.moneyDisplay(), guiControl.leftBorder + pixel(guiControl.iconSize + 4), guiControl.rowTop(0) + pixel(), 8, "black", 6);
			// Cargo icon
			guiControl.drawIcon(1, 0, guiControl.leftBorder, guiControl.rowTop(1));
			guiControl.drawPixelText(G.inventory.CargoTotal().toString(), guiControl.leftBorder + pixel(guiControl.iconSize + 4), guiControl.rowTop(1) + pixel(), 8, "black", 6);
			// Stats icon
			// guiControl.drawIcon(9, 2, guiControl.leftBorder, guiControl.rowTop(2));
			guiControl.drawPixelText("Status", guiControl.leftBorder, guiControl.rowTop(2) + pixel(), 8, "black", 6);
			
			// Close Text
			guiControl.drawPixelText("Close", guiControl.leftBorder, guiControl.rowTop(3) + pixel(), 8, "black", 6);
			
			// Draw cursor
			OS.context.drawImage(guiControl.cursor, guiControl.leftBorder - (guiControl.iconScaled), guiControl.rowTop(guiControl.inventory.cursorPosition));

			// Button Action
			if (guiControl.inventory.activateDelay <= 0) {
				if (ct_confirm().down) {
					switch (guiControl.inventory.cursorPosition) {
						case 0:
							guiControl.inventory.screen = "money";
							break;
						case 1:
							guiControl.inventory.screen = "cargo";
							break;
						case 2:
							guiControl.inventory.screen = "status";
							break;
						default:
							guiControl.inventory.show = false;
							break;
					}

					guiControl.inventory.cursorPosition = 0;
					guiControl.inventory.activateDelay = 5;
				}
				if (ct_cancel().down) {
					guiControl.inventory.show = false;
				}
				if (ct_left().down) {
					guiControl.inventory.show = false;
					guiControl.map.activateDelay = 5;
					guiControl.map.show = true;
				}
				if (ct_right().down) {
					guiControl.inventory.show = false;
					guiControl.map.activateDelay = 5;
					guiControl.map.show = true;
				}
			}
		}
		else if (guiControl.inventory.screen == "money") {
			// Limit Cursor
			if (guiControl.inventory.cursorPosition < 0) {
				guiControl.inventory.cursorPosition = 0;
			}
			if (guiControl.inventory.cursorPosition > 0) {
				guiControl.inventory.cursorPosition = 0;
			}

			// Title
			guiControl.drawPixelText("Money", guiControl.leftBorder + pixel(3), guiControl.topOfBackground, 8, "black", 6);

			guiControl.drawPixelText("Actual Amt", guiControl.leftBorder - pixel(5), guiControl.rowTop(0) + pixel(), 10, "black", 4);
			// Money icon
			guiControl.drawIcon(7, 2, guiControl.leftBorder - pixel(5), guiControl.rowTop(1) - pixel(3));
			guiControl.drawPixelText(G.inventory.money.toString(), guiControl.leftBorder - pixel(5) + pixel(guiControl.iconSize + 2), guiControl.rowTop(1) + pixel(2) - pixel(3), 10, "black", 4);
			
			// Back Text
			guiControl.drawPixelText("Back", guiControl.leftBorder, guiControl.rowTop(4) - pixel(3), 8, "black", 6);
			
			// Draw cursor
			OS.context.drawImage(guiControl.cursor, guiControl.leftBorder - (guiControl.iconScaled), guiControl.rowTop(4) - pixel(4));

			// Button Action
			if (guiControl.inventory.activateDelay <= 0) {
				if (ct_confirm().down || ct_cancel().down) {
					guiControl.inventory.screen = "main";
					guiControl.inventory.activateDelay = 5;
					guiControl.inventory.cursorPosition = 0;
				}
			}
		}
		else if (guiControl.inventory.screen == "cargo") {
			// Limit Cursor
			if (guiControl.inventory.cursorPosition < 0) {
				guiControl.inventory.cursorPosition = 0;
			}
			if (guiControl.inventory.cursorPosition > 0) {
				guiControl.inventory.cursorPosition = 0;
			}

			// Title
			guiControl.drawPixelText("Cargo", guiControl.leftBorder + pixel(3), guiControl.topOfBackground, 8, "black", 6);

			// Cargo icons
			var cargo = G.inventory.CheckCargo();	// Contains the item ids that have more than 1 item
			for (var i = 0; i < cargo.length; i++) {
				guiControl.drawItem(cargo[i], guiControl.leftBorder, guiControl.rowTop(i));
				guiControl.drawPixelText(G.inventory.cargo[cargo[i]], guiControl.leftBorder + pixel(guiControl.iconSize + 4), guiControl.rowTop(i) + pixel(), 8, "black", 6);
			}

			// Back Text
			guiControl.drawPixelText("Back", guiControl.leftBorder, guiControl.rowTop(4) - pixel(3), 8, "black", 6);
			
			// Draw cursor
			OS.context.drawImage(guiControl.cursor, guiControl.leftBorder - (guiControl.iconScaled), guiControl.rowTop(4) - pixel(4));

			// Button Action
			if (guiControl.inventory.activateDelay <= 0) {
				if (ct_confirm().down || ct_cancel().down) {
					guiControl.inventory.screen = "main";
					guiControl.inventory.activateDelay = 5;
					guiControl.inventory.cursorPosition = 1;
				}
			}
		}
		else if (guiControl.inventory.screen == "status") {
			// Limit Cursor
			if (guiControl.inventory.cursorPosition < 0) {
				guiControl.inventory.cursorPosition = 0;
			}
			if (guiControl.inventory.cursorPosition > 0) {
				guiControl.inventory.cursorPosition = 0;
			}

			// guiControl.drawPageArrow("left", pixel(4), guiControl.topOfBackground);
			// guiControl.drawPageArrow("right", OS.camera.width - pixel(4) - pixel(4), guiControl.topOfBackground);

			// Title
			guiControl.drawPixelText("Status", guiControl.leftBorder + pixel(), guiControl.topOfBackground, 8, "black", 6);

			// Illness icon
			guiControl.drawIcon(4, 1, guiControl.leftBorder - pixel(6), guiControl.rowTop(0));
			guiControl.drawPixelText(G.stats.illness.toString(), guiControl.leftBorder - pixel(6) + (guiControl.iconScaled + pixel(2)), guiControl.rowTop(0) + pixel(2), 2, "black", 4);
			
			guiControl.drawPixelText("This will show more data when stati can change.", guiControl.leftBorder - pixel(5), guiControl.rowTop(1), 10, "black", 4);
			/*// Energy icon
			guiControl.drawIcon(9, 2, guiControl.leftBorder - pixel(5), guiControl.rowTop(0) - pixel(3));
			guiControl.drawPixelText(G.stats.energy.toString(), guiControl.leftBorder - pixel(5) + pixel(guiControl.iconSize + 2), guiControl.rowTop(1) + pixel(2) - pixel(3), 2, "black", 4);
			// Illness icon
			guiControl.drawIcon(4, 1, guiControl.leftBorder - pixel(5) + pixel(24), guiControl.rowTop(1) - pixel(3));
			guiControl.drawPixelText(G.stats.illness.toString(), guiControl.leftBorder - pixel(5) + pixel(24) + pixel(guiControl.iconSize + 2), guiControl.rowTop(1) + pixel(2) - pixel(3), 2, "black", 4);

			// Yes/No options
			guiControl.drawPixelText("No", guiControl.leftBorder, guiControl.rowTop(2) - pixel(3), 3, "black", 6);
			guiControl.drawPixelText("Yes", guiControl.leftBorder, guiControl.rowTop(3) - pixel(3), 3, (G.inventory.supplies > 0 && G.stats.illness > 0) ? "black" : "white", 6);
			*/
			// Back Text
			guiControl.drawPixelText("Back", guiControl.leftBorder, guiControl.rowTop(4) - pixel(3), 8, "black", 6);
			
			// Draw cursor
			guiControl.drawCursor(guiControl.leftBorder - (guiControl.iconScaled), guiControl.rowTop(4) - pixel(3));

			// Button Action
			if (guiControl.inventory.activateDelay <= 0) {
				if (ct_confirm().down || ct_cancel().down) {
					guiControl.inventory.screen = "main";
					guiControl.inventory.activateDelay = 5;
					guiControl.inventory.cursorPosition = 2;	// The position where "Supplies" is on main screen.
				}
			}
		}
	}
}
