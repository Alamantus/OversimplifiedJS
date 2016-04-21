function tradeGUI() {
	guiControl.trade = {
		screen: "main",	// "main", "buy", "sell", "gossip"
		cursorPosition: 0,
		page: 0,		// horizontal page on item lists. Base 1 to match number of pages var "pages" within the gui.
		itemsPerPage: 3,
		show: false,
		activateDelay: 0,

		island: null,

		padding: pixel(2),
		leftBorder: pixel(12),

		rowTop: function (rowNumber) {
			return (guiControl.trade.padding + pixel(6) + (guiControl.trade.padding * 3)) + pixel((guiControl.iconSize + 3) * rowNumber);
		}
	}
}

function drawTradeGUI() {
	if (guiControl.trade && guiControl.trade.show) {
		guiControl.trade.activateDelay -= (guiControl.trade.activateDelay > 0) ? 1 : 0;
		// console.log("trade screen island: " + guiControl.trade.island.name);
		// Draw background color.
		var tmp = Oversimplified.context.fillStyle;
	    Oversimplified.context.fillStyle = "#D9BEA5";
	    Oversimplified.context.fillRect(0, 0, Oversimplified.camera.width, Oversimplified.camera.height);
	    Oversimplified.context.fillStyle = tmp;

		if (ct_down().down) {
			guiControl.trade.cursorPosition++;
		}
		if (ct_up().down) {
			guiControl.trade.cursorPosition--;
		}
		if (ct_right().down) {
			guiControl.trade.page++;
		}
		if (ct_left().down) {
			guiControl.trade.page--;
		}
		
		if (guiControl.trade.screen == "main") {
			// console.log(guiControl.trade.screen);
			// Limit Cursor
			if (guiControl.trade.cursorPosition < 0) {
				guiControl.trade.cursorPosition = 3;
			}
			if (guiControl.trade.cursorPosition > 3) {
				guiControl.trade.cursorPosition = 0;
			}
			// Limit page
			if (guiControl.trade.page < 0) {
				guiControl.trade.page = 0;
			}
			if (guiControl.trade.page > 0) {
				guiControl.trade.page = 0;
			}

			// Title
			guiControl.drawPixelText("On Island", (guiControl.trade.padding * 2), guiControl.trade.padding, 10, "black", 6);
			// Money icon
			// guiControl.drawIcon(7, 2, guiControl.trade.leftBorder, guiControl.trade.rowTop(0));
			guiControl.drawPixelText((guiControl.trade.island.CheckInventory().length > 0) ? "Buy" : "Sold Out!", guiControl.trade.leftBorder, guiControl.trade.rowTop(0) + pixel(), 10, (guiControl.trade.island.CheckInventory().length > 0) ? "black" : "white", 6);
			// Supplies icon
			// guiControl.drawIcon(9, 2, guiControl.trade.leftBorder, guiControl.trade.rowTop(1));
			guiControl.drawPixelText((G.inventory.CheckCargo().length > 0) ? "Sell" : "No Cargo!", guiControl.trade.leftBorder, guiControl.trade.rowTop(1) + pixel(), 10, (G.inventory.CheckCargo().length > 0) ? "black" : "white", 6);
			// Cargo icon
			// guiControl.drawIcon(1, 0, guiControl.trade.leftBorder, guiControl.trade.rowTop(2));
			guiControl.drawPixelText("Tavern", guiControl.trade.leftBorder, guiControl.trade.rowTop(2) + pixel(), 8, "black", 6);
			
			// Close Text
			guiControl.drawPixelText("Leave", guiControl.trade.leftBorder, guiControl.trade.rowTop(3) + pixel(), 8, "black", 6);
			
			// Draw cursor
			OS.context.drawImage(guiControl.cursor, guiControl.trade.leftBorder - (guiControl.iconScaled), guiControl.trade.rowTop(guiControl.trade.cursorPosition));

			// Button Action
			if (guiControl.trade.activateDelay <= 0) {
				if (ct_confirm().down) {
					switch (guiControl.trade.cursorPosition) {
						case 0:
							if (guiControl.trade.island.CheckInventory().length > 0) {
								guiControl.trade.screen = "buy";
								guiControl.trade.activateDelay = 5;
							}
							break;
						case 1:
							if (G.inventory.CheckCargo().length > 0) {
								guiControl.trade.screen = "sell";
								guiControl.trade.activateDelay = 5;
							}
							break;
						case 2:
							guiControl.trade.screen = "tavern";
							guiControl.trade.activateDelay = 5;
							break;
						default:
							guiControl.trade.show = false;
							break;
					}
					
					guiControl.trade.cursorPosition = 0;
					guiControl.trade.page = 0;
					// console.log(guiControl.trade.screen);
				}
				if (ct_cancel().down) {
					guiControl.trade.show = false;
				}
			}
		}
		else if (guiControl.trade.screen == "buy") {
			// console.log(guiControl.trade.screen);
			// Limit Cursor
			if (guiControl.trade.cursorPosition < 0) {
				guiControl.trade.cursorPosition = 2;
			}
			if (guiControl.trade.cursorPosition > 2) {
				guiControl.trade.cursorPosition = 0;
			}

			// Title
			guiControl.drawPixelText("Buy", guiControl.trade.leftBorder - pixel(2), guiControl.topOfBackground, 10, "black", 6);

			// Money icon
			guiControl.drawIcon(7, 2, guiControl.trade.padding, guiControl.trade.rowTop(0) - pixel(3));
			guiControl.drawPixelText(G.inventory.moneyDisplay(), guiControl.trade.padding + pixel(guiControl.iconSize + 2), guiControl.trade.rowTop(0) + pixel(2) - pixel(3), 10, "black", 4);
			
			// Cargo icons
			var items = guiControl.trade.island.CheckInventory();	// Contains the item ids that have more than 1 item

			// Limit page
			if (guiControl.trade.page < 0) {
				guiControl.trade.page = items.length - 1;
			}
			if (guiControl.trade.page > items.length - 1) {
				guiControl.trade.page = 0;
			}

			if (items.length > 0) {
				var itemPrice = G.economy.cargoItemWorth[items[guiControl.trade.page]] + guiControl.trade.island.priceDifferences[items[guiControl.trade.page]] - guiControl.trade.island.haggleAmount;
				if (itemPrice < 1) itemPrice = 1;
				var itemPriceDisplay = itemPrice.toString() + " c";
				guiControl.drawItem(items[guiControl.trade.page], guiControl.trade.leftBorder, guiControl.trade.rowTop(1) - pixel(5));
				guiControl.drawPixelText(itemPriceDisplay, guiControl.trade.leftBorder + pixel(guiControl.iconSize + 4), guiControl.trade.rowTop(1) - pixel(5) + pixel(), 8, "black", 6);

				if (items.length > 1) {
					guiControl.drawPageArrow("left", guiControl.trade.padding, guiControl.trade.rowTop(1) - pixel(5));
					guiControl.drawPageArrow("right", OS.camera.width - pixel(4) - guiControl.trade.padding, guiControl.trade.rowTop(1) - pixel(5));
				}

				// Amounts
				guiControl.drawPixelText("Shop" + guiControl.trade.island.inventory[items[guiControl.trade.page]].toString(), OS.camera.width - pixel(20), guiControl.trade.rowTop(2) - pixel(6) + pixel(), 4, "black", 4);
				guiControl.drawPixelText("Own " + G.inventory.cargo[items[guiControl.trade.page]].toString(), OS.camera.width - pixel(20), guiControl.trade.rowTop(3) - pixel(6) + pixel(), 4, (G.inventory.cargo[items[guiControl.trade.page]] < G.stats.hold) ? "black" : "yellow", 4);
			} else {
				guiControl.drawPixelText("Sold Out!", guiControl.trade.leftBorder, guiControl.trade.rowTop(1) - pixel(5) + pixel(), 10, "black", 6);
			}
			
			// Draw Amount of Cargo
			guiControl.drawIcon(1, 1, OS.camera.width - pixel(20), guiControl.trade.rowTop(4) - pixel(5));
			guiControl.drawPixelText(G.inventory.CheckCargo().length.toString(), OS.camera.width - pixel(20) + (guiControl.iconScaled + pixel()), guiControl.trade.rowTop(4) - pixel(4), 4, (G.inventory.CheckCargo().length < G.stats.inventory) ? "black" : "yellow", 6);

			// Yes/No Options
			guiControl.drawPixelText("Hagl?", guiControl.trade.leftBorder, guiControl.trade.rowTop(2) - pixel(2), 8, (guiControl.trade.island.timesHaggledToday >= G.stats.popularity) ? "yellow" : ((items.length > 0 && guiControl.trade.island.haggleAmount == 0) ? "black" : "white"), 6);
			guiControl.drawPixelText("Yes", guiControl.trade.leftBorder, guiControl.trade.rowTop(3) - pixel(2), 8, (items.length > 0 && G.inventory.CanBuy(items[guiControl.trade.page], itemPrice)) ? "black" : "white", 6);

			// Back Text
			guiControl.drawPixelText("Back", guiControl.trade.leftBorder, guiControl.trade.rowTop(4) - pixel(2), 8, "black", 6);
			
			// Draw cursor
			OS.context.drawImage(guiControl.cursor, guiControl.trade.leftBorder - (guiControl.iconScaled), guiControl.trade.rowTop(guiControl.trade.cursorPosition + 2) - pixel(3));

			// Button Action
			if (guiControl.trade.activateDelay <= 0) {
				if (ct_confirm().down) {
					switch (guiControl.trade.cursorPosition) {
						case 0:		// Haggle
							if (items.length > 0 && (guiControl.trade.island.timesHaggledToday <= G.stats.popularity) &&	// If there are items and you haven't haggled too much
								guiControl.trade.island.haggleAmount == 0 && Math.floor(Math.randomRange(0, 100)) < G.stats.popularity)	// Or you haven't haggled yet and get a random number less than your popularity, haggle successfully.
							{
								guiControl.trade.island.haggleAmount = G.stats.haggling;
							} else {
								guiControl.trade.island.timesHaggledToday++;
							}
							break;
						case 1:		// Buy
							if (items.length > 0 &&
								G.inventory.CanBuy(items[guiControl.trade.page], itemPrice))	//If cursor is over yes and you can buy, buy it.
							{
								guiControl.trade.island.BuyFrom(items[guiControl.trade.page], itemPrice);
							}
							break;
						default:
							guiControl.trade.screen = "main";
							guiControl.trade.activateDelay = 5;
							guiControl.trade.cursorPosition = 0;	// The position where "Buy" is on main screen.
							break;
					}
					// console.log(guiControl.trade.screen);
				}
				if (ct_cancel().down) {
					guiControl.trade.screen = "main";
					guiControl.trade.activateDelay = 5;
					guiControl.trade.cursorPosition = 0;	// The position where "Buy" is on main screen.
					// console.log(guiControl.trade.screen);
				}
			}
		}
		else if (guiControl.trade.screen == "sell") {
			// console.log(guiControl.trade.screen);
			// Limit Cursor
			if (guiControl.trade.cursorPosition < 0) {
				guiControl.trade.cursorPosition = 2;
			}
			if (guiControl.trade.cursorPosition > 2) {
				guiControl.trade.cursorPosition = 0;
			}

			// Title
			guiControl.drawPixelText("Sell", guiControl.trade.leftBorder - pixel(2), guiControl.topOfBackground, 10, "black", 6);

			// Money icon
			guiControl.drawIcon(7, 2, guiControl.trade.padding, guiControl.trade.rowTop(0) - pixel(3));
			guiControl.drawPixelText(G.inventory.moneyDisplay(), guiControl.trade.padding + pixel(guiControl.iconSize + 2), guiControl.trade.rowTop(0) + pixel(2) - pixel(3), 10, "black", 4);
			
			// Cargo icons
			var items = G.inventory.CheckCargo();	// Contains the item ids that have more than 1 item

			// Limit page
			if (guiControl.trade.page < 0) {
				guiControl.trade.page = items.length - 1;
			}
			if (guiControl.trade.page > items.length - 1) {
				guiControl.trade.page = 0;
			}

			if (items.length > 0) {
				var itemPrice = G.economy.cargoItemWorth[items[guiControl.trade.page]] + guiControl.trade.island.priceDifferences[items[guiControl.trade.page]];
				var priceCut = 0.5 + ((guiControl.trade.island.haggleAmount == 0) ? 0 : (G.stats.popularity * 0.01 * 0.5)); // If haggled successfully, lessen the price cut by half of your popularity's percent worth.
				itemPrice = Math.round(itemPrice * priceCut);
				if (itemPrice < 1) itemPrice = 1;
				var itemPriceDisplay = itemPrice.toString() + " c";
				guiControl.drawItem(items[guiControl.trade.page], guiControl.trade.leftBorder, guiControl.trade.rowTop(1) - pixel(5));
				guiControl.drawPixelText(itemPriceDisplay, guiControl.trade.leftBorder + pixel(guiControl.iconSize + 4), guiControl.trade.rowTop(1) - pixel(5) + pixel(), 8, "black", 6);

				if (items.length > 1) {
					guiControl.drawPageArrow("left", guiControl.trade.padding, guiControl.trade.rowTop(1) - pixel(5));
					guiControl.drawPageArrow("right", OS.camera.width - pixel(4) - guiControl.trade.padding, guiControl.trade.rowTop(1) - pixel(5));
				}

				// Amounts
				guiControl.drawPixelText("Shop" + guiControl.trade.island.inventory[items[guiControl.trade.page]].toString(), OS.camera.width - pixel(20), guiControl.trade.rowTop(2) - pixel(6) + pixel(), 4, "black", 4);
				guiControl.drawPixelText("Own " + G.inventory.cargo[items[guiControl.trade.page]].toString(), OS.camera.width - pixel(20), guiControl.trade.rowTop(3) - pixel(6) + pixel(), 4, (G.inventory.cargo[items[guiControl.trade.page]] > 0) ? "black" : "yellow", 4);
			} else {
				guiControl.drawPixelText("No Cargo!", guiControl.trade.padding, guiControl.trade.rowTop(1) - pixel(5) + pixel(), 10, "black", 6);
			}

			// Draw Amount of Cargo
			guiControl.drawIcon(1, 1, OS.camera.width - pixel(20), guiControl.trade.rowTop(4) - pixel(5));
			guiControl.drawPixelText(G.inventory.CheckCargo().length.toString(), OS.camera.width - pixel(20) + (guiControl.iconScaled + pixel()), guiControl.trade.rowTop(4) - pixel(4), 4, (G.inventory.CheckCargo().length > 0) ? "black" : "yellow", 6);

			// Yes/No Options
			guiControl.drawPixelText("Hagl?", guiControl.trade.leftBorder, guiControl.trade.rowTop(2) - pixel(2), 8, (guiControl.trade.island.timesHaggledToday >= G.stats.popularity) ? "yellow" : ((items.length > 0 && guiControl.trade.island.haggleAmount == 0) ? "black" : "white"), 6);
			guiControl.drawPixelText("Yes", guiControl.trade.leftBorder, guiControl.trade.rowTop(3) - pixel(2), 8, (items.length > 0 && G.inventory.CanSell(items[guiControl.trade.page])) ? "black" : "white", 6);

			// Back Text
			guiControl.drawPixelText("Back", guiControl.trade.leftBorder, guiControl.trade.rowTop(4) - pixel(2), 8, "black", 6);
			
			// Draw cursor
			OS.context.drawImage(guiControl.cursor, guiControl.trade.leftBorder - (guiControl.iconScaled), guiControl.trade.rowTop(guiControl.trade.cursorPosition + 2) - pixel(3));

			// Button Action
			if (guiControl.trade.activateDelay <= 0) {
				if (ct_confirm().down) {
					switch (guiControl.trade.cursorPosition) {
						case 0:		// Haggle
							if (items.length > 0 && (guiControl.trade.island.timesHaggledToday <= G.stats.popularity) &&
								guiControl.trade.island.haggleAmount == 0 && Math.floor(Math.randomRange(0, 100)) < G.stats.popularity)		// If you haven't haggled yet and get a random number less than your popularity, haggle successfully.
							{
								guiControl.trade.island.haggleAmount = G.stats.haggling;
							} else {
								guiControl.trade.island.timesHaggledToday++;
							}
							break;
						case 1:		// Sell
							if (items.length > 0 &&
								G.inventory.CanSell(items[guiControl.trade.page]))	//If cursor is over yes and you can buy, buy it.
							{
								guiControl.trade.island.SellTo(items[guiControl.trade.page], itemPrice);
							}
							break;
						default:
							guiControl.trade.screen = "main";
							guiControl.trade.activateDelay = 5;
							guiControl.trade.cursorPosition = 1;	// The position where "Sell" is on main screen.
							break;
					}
					// console.log(guiControl.trade.screen);
				}
				if (ct_cancel().down) {
					guiControl.trade.screen = "main";
					guiControl.trade.activateDelay = 5;
					guiControl.trade.cursorPosition = 1;	// The position where "Sell" is on main screen.
					// console.log(guiControl.trade.screen);
				}
			}
		}
		else if (guiControl.trade.screen == "tavern") {
			// Limit Cursor
			if (guiControl.trade.cursorPosition < 0) {
				guiControl.trade.cursorPosition = 2;
			}
			if (guiControl.trade.cursorPosition > 2) {
				guiControl.trade.cursorPosition = 0;
			}

			// Title
			guiControl.drawPixelText("Tavern", guiControl.leftBorder - pixel(6), guiControl.topOfBackground, 8, "black", 6);

			var innPrice = G.economy.innCost + guiControl.trade.island.innPriceDifference;
			guiControl.drawPixelText("Heal costs " + innPrice.toString() + " C", guiControl.leftBorder - pixel(5), guiControl.trade.rowTop(0) - pixel(), 10, "black", 4);

			// Money icon
			guiControl.drawIcon(7, 2, guiControl.trade.padding, guiControl.trade.rowTop(1) - pixel());
			guiControl.drawPixelText(G.inventory.moneyDisplay(), guiControl.trade.padding + pixel(guiControl.iconSize + 2), guiControl.trade.rowTop(1) + pixel(), 10, "black", 4);
			
			// Options
			guiControl.drawPixelText("Gossip", guiControl.leftBorder, guiControl.trade.rowTop(2) - pixel(), 0, "black", 6);
			guiControl.drawPixelText("Heal", guiControl.leftBorder, guiControl.trade.rowTop(3) - pixel(), 4, (G.inventory.money > innPrice && G.stats.illness > 0) ? "black" : "white", 6);
			// Illness icon
			guiControl.drawIcon(4, 1, guiControl.leftBorder + pixel(30), guiControl.trade.rowTop(3) - pixel(2));
			guiControl.drawPixelText(G.stats.illness.toString(), guiControl.leftBorder + pixel(30) + pixel(guiControl.iconSize + 2), guiControl.trade.rowTop(3), 2, (G.stats.illness == 0) ? "yellow" : "black", 4);
			
			// Back Text
			guiControl.drawPixelText("Back", guiControl.leftBorder, guiControl.trade.rowTop(4) - pixel(), 8, "black", 6);
			
			// Draw cursor
			guiControl.drawCursor(guiControl.leftBorder - (guiControl.iconScaled), guiControl.trade.rowTop(guiControl.trade.cursorPosition + 2) - pixel(2));

			// Button Action
			if (guiControl.trade.activateDelay <= 0) {
				if (ct_confirm().down) {
					switch (guiControl.trade.cursorPosition) {
						case 0:
							guiControl.trade.screen = "gossip";
							guiControl.trade.activateDelay = 5;
							guiControl.trade.cursorPosition = 2;	// The position where "Supplies" is on main screen.
							break;
						case 1:
							if (G.stats.illness > 0 && G.inventory.money > innPrice) {	//If cursor is over yes, heal illness with supplies.
								guiControl.trade.island.StayAtInn();
							}
							break;
						default:
							guiControl.trade.screen = "main";
							guiControl.trade.activateDelay = 5;
							guiControl.trade.cursorPosition = 2;	// The position where "Supplies" is on main screen.
							break;
					}

					// Give a cooldown so you don't accidentally do something you don't want.
					guiControl.trade.activateDelay = 5;
				}

				if (ct_cancel().down) {
					guiControl.trade.screen = "main";
					guiControl.trade.activateDelay = 5;
					guiControl.trade.cursorPosition = 2;	// The position where "Supplies" is on main screen.
				}
			}
		}
		else if (guiControl.trade.screen == "gossip") {
			// console.log(guiControl.trade.screen);
			// Limit Cursor
			if (guiControl.trade.cursorPosition < 0) {
				guiControl.trade.cursorPosition = 0;
			}
			if (guiControl.trade.cursorPosition > 0) {
				guiControl.trade.cursorPosition = 0;
			}

			// Title
			guiControl.drawPixelText("Gossip", guiControl.trade.padding, guiControl.topOfBackground, 10, "black", 6);

			guiControl.drawPixelText("Nothing interesting to report! / / / / / -Actually, this isnt in the game yet-", guiControl.trade.padding, guiControl.trade.rowTop(0) - pixel(2), 0, "black", 4);
			
			// Back Text
			guiControl.drawPixelText("Back", guiControl.trade.leftBorder, guiControl.trade.rowTop(4) - pixel(2), 8, "black", 6);
			
			// Draw cursor
			OS.context.drawImage(guiControl.cursor, guiControl.trade.leftBorder - (guiControl.iconScaled), guiControl.trade.rowTop(4) - pixel(3));

			// Button Action
			if (guiControl.trade.activateDelay <= 0) {
				if (ct_confirm().down || ct_cancel().down) {
					guiControl.trade.screen = "tavern";
					guiControl.trade.activateDelay = 5;
					guiControl.trade.cursorPosition = 0;
				}
			}
		}
	}
}
