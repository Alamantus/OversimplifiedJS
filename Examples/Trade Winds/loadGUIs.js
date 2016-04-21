function loadGUIs() {
	OS.AddScript("gui/titleScreen.js");
	OS.AddScript("gui/inventoryGUI.js");
	OS.AddScript("gui/mapGUI.js");
	OS.AddScript("gui/tradeGUI.js");
}

var guiControl = {
	topOfBackground: pixel(2 + 2),
	upperBorder: pixel(13 + 2),
	lowerBorder: pixel(3 + 2),
	leftBorder: pixel(10 + 2),
	rightBorder: pixel(5 + 2),
	iconSize: 8,
	iconScaled: pixel(8),

	iconPosition: function (cellPosition) {
		return (guiControl.iconScaled * cellPosition);
	},
	rowTop: function (rowNumber) {
		return guiControl.upperBorder + pixel((guiControl.iconSize + 2) * rowNumber);
	},

	drawIcon: function (cellX, cellY, xPosition, yPosition) {
		OS.context.drawImage(guiControl.icons, guiControl.iconPosition(cellX), guiControl.iconPosition(cellY), guiControl.iconScaled, guiControl.iconScaled, xPosition, yPosition, guiControl.iconScaled, guiControl.iconScaled);
	},
	drawItem: function (itemId, xPosition, yPosition) {
		var cellX = itemId % 4;
		var cellY = Math.floor(itemId / 4);
		OS.context.drawImage(guiControl.itemSheet, guiControl.iconPosition(cellX), guiControl.iconPosition(cellY), guiControl.iconScaled, guiControl.iconScaled, xPosition, yPosition, guiControl.iconScaled, guiControl.iconScaled);
	},
	drawCursor: function (xPosition, yPosition) {
		OS.context.drawImage(guiControl.cursor, xPosition, yPosition);
	},
	drawPageArrow: function (direction, xPosition, yPosition) {
		OS.context.drawImage(guiControl.arrows, (direction == "left") ? 0 : pixel(4), 0, pixel(4), pixel(7), xPosition, yPosition, pixel(4), pixel(7));
	}
}
guiControl.titleImage = new Image();
guiControl.titleImage.src = "images/title.png";
guiControl.background = new Image();
guiControl.background.src = "images/guiBackground.png";
guiControl.cursor = new Image();
guiControl.cursor.src = "images/guiCursor.png";
guiControl.arrows = new Image();
guiControl.arrows.src = "images/arrows.png";

guiControl.alpha_black4 = new Image();
guiControl.alpha_black4.src = "images/alphabet_black_4px.png";
guiControl.alpha_white4 = new Image();
guiControl.alpha_white4.src = "images/alphabet_white_4px.png";
guiControl.alpha_yellow4 = new Image();
guiControl.alpha_yellow4.src = "images/alphabet_yellow_4px.png";
guiControl.alpha_black6 = new Image();
guiControl.alpha_black6.src = "images/alphabet_black_6px.png";
guiControl.alpha_white6 = new Image();
guiControl.alpha_white6.src = "images/alphabet_white_6px.png";
guiControl.alpha_yellow6 = new Image();
guiControl.alpha_yellow6.src = "images/alphabet_yellow_6px.png";

guiControl.itemSheet = new Image();
guiControl.itemSheet.src = "images/items_sheet.png";
guiControl.icons = new Image();
guiControl.icons.src = "images/icons_sheet.png";

guiControl.drawPixelText = function (text, x, y, wrapWidth, color, size) {
// Draw the text at the given x and y on the canvas using the alphabet images.
// Remember to set the pixel scale for x and y when you call the function!
// 4x4 font modified from http://pixeljoint.com/forum/forum_posts.asp?TID=18755&PID=185995#185995
// 5x6 font modified from http://atariage.com/forums/topic/165697-fonts/page-4#entry2081600
	text = text.toString().toUpperCase();
	
	var letterSizeX = pixel((size == 6) ? size - 1 : size);
	var letterSizeY = pixel(size);
	var maxWrapWidth = Math.floor(OS.camera.width / (letterSizeX + pixel(1)));
	
	wrapWidth = (wrapWidth <= 0 || wrapWidth > maxWrapWidth) ? maxWrapWidth : wrapWidth;
	
	var alphabet = guiControl["alpha_" + color + size.toString()];

	// Make words wrap nicely, but let punctuation wrap.
	var wordsInText = text.split(" ");
	if (wordsInText.length > 1) {
		var indexToBreak = 0;
		var replacementText = "";
		var punctuation = [".", ",", "-", "?", "!"];
		for (var w = 0; w < wordsInText.length; w++) {
			// console.log("\"" + wordsInText[w].charAt(wordsInText[w].length - 1) + "\"");
			
			if (punctuation.indexOf(wordsInText[w]) == -1 && punctuation.indexOf(wordsInText[w].charAt(wordsInText[w].length - 1)) != -1) {
				// If the last character of a word is punctuation, separate it out
				wordsInText.splice(w + 1, 0, wordsInText[w].charAt(wordsInText[w].length - 1));
				// console.log("punctuation:" + wordsInText[w].charAt(wordsInText[w].length - 1));
				wordsInText[w] = wordsInText[w].substr(0, wordsInText[w].length - 1);
				// console.log("Turns to:" + wordsInText[w]);
				w--;
			} else if (replacementText.substr(indexToBreak).length + wordsInText[w].length + 1 <= wrapWidth) {
				// console.log("Adding: \"" + wordsInText[w] + " \" to \"" + replacementText.substr(indexToBreak) + "\"");
				// console.log(replacementText.substr(indexToBreak).length + wordsInText[w].length + " < " + wrapWidth);
				// console.log("\"" + replacementText.substr(indexToBreak) + "\"");
				replacementText += wordsInText[w];

				if (punctuation.indexOf(wordsInText[w + 1]) == -1) {	// If the next word in the array is not punctuation,
					replacementText += " ";								// Then add a space after.
				}
				// console.log("Turns to: \"" + replacementText.substr(indexToBreak) + "\"");
			} else if (replacementText.substr(indexToBreak).length + wordsInText[w].length <= wrapWidth) {
				// console.log("Adding: \"" + wordsInText[w] + "\" to \"" + replacementText.substr(indexToBreak) + "\"");
				// console.log(replacementText.substr(indexToBreak).length + wordsInText[w].length + " < " + wrapWidth);
				// console.log("\"" + replacementText.substr(indexToBreak) + "\"");
				replacementText += wordsInText[w];
				// console.log("Turns to: \"" + replacementText.substr(indexToBreak) + "\"");
				indexToBreak = replacementText.length;
			} else {
				// console.log("Checking: \"" + replacementText.substr(indexToBreak) + wordsInText[w] + "\"");
				// console.log(replacementText.substr(indexToBreak).length + wordsInText[w].length + " > " + wrapWidth);
				// console.log("\"" + replacementText.substr(indexToBreak) + "\"");
				// indexToBreak = replacementText.length - 1;
				var numberOfSpaces = wrapWidth - replacementText.substr(indexToBreak).length;
				for (var s = 0; s < numberOfSpaces; s++) {
					replacementText += " ";
				}
				// console.log("Turns to: \"" + replacementText.substr(indexToBreak) + "\"");
				indexToBreak = replacementText.length;
				w--;
				// replacementText += wordsInText[w];
			}
			// console.log("----");
		}
		text = replacementText;
	}

	for (var i = 0; i < text.length; i++) {
		var letterCellX, letterCellY;
		switch (text.charAt(i)) {
			case "A":
				letterCellX = 0;
				letterCellY = 0;
				break;
			case "B":
				letterCellX = 1;
				letterCellY = 0;
				break;
			case "C":
				letterCellX = 2;
				letterCellY = 0;
				break;
			case "D":
				letterCellX = 3;
				letterCellY = 0;
				break;
			case "E":
				letterCellX = 4;
				letterCellY = 0;
				break;
			case "F":
				letterCellX = 5;
				letterCellY = 0;
				break;
			case "G":
				letterCellX = 0;
				letterCellY = 1;
				break;
			case "H":
				letterCellX = 1;
				letterCellY = 1;
				break;
			case "I":
				letterCellX = 2;
				letterCellY = 1;
				break;
			case "J":
				letterCellX = 3;
				letterCellY = 1;
				break;
			case "K":
				letterCellX = 4;
				letterCellY = 1;
				break;
			case "L":
				letterCellX = 5;
				letterCellY = 1;
				break;
			case "M":
				letterCellX = 0;
				letterCellY = 2;
				break;
			case "N":
				letterCellX = 1;
				letterCellY = 2;
				break;
			case "O":
				letterCellX = 2;
				letterCellY = 2;
				break;
			case "P":
				letterCellX = 3;
				letterCellY = 2;
				break;
			case "Q":
				letterCellX = 4;
				letterCellY = 2;
				break;
			case "R":
				letterCellX = 5;
				letterCellY = 2;
				break;
			case "S":
				letterCellX = 0;
				letterCellY = 3;
				break;
			case "T":
				letterCellX = 1;
				letterCellY = 3;
				break;
			case "U":
				letterCellX = 2;
				letterCellY = 3;
				break;
			case "V":
				letterCellX = 3;
				letterCellY = 3;
				break;
			case "W":
				letterCellX = 4;
				letterCellY = 3;
				break;
			case "X":
				letterCellX = 5;
				letterCellY = 3;
				break;
			case "Y":
				letterCellX = 0;
				letterCellY = 4;
				break;
			case "Z":
				letterCellX = 1;
				letterCellY = 4;
				break;
			case "1":
				letterCellX = 2;
				letterCellY = 4;
				break;
			case "2":
				letterCellX = 3;
				letterCellY = 4;
				break;
			case "3":
				letterCellX = 4;
				letterCellY = 4;
				break;
			case "4":
				letterCellX = 5;
				letterCellY = 4;
				break;
			case "5":
				letterCellX = 0;
				letterCellY = 5;
				break;
			case "6":
				letterCellX = 1;
				letterCellY = 5;
				break;
			case "7":
				letterCellX = 2;
				letterCellY = 5;
				break;
			case "8":
				letterCellX = 3;
				letterCellY = 5;
				break;
			case "9":
				letterCellX = 4;
				letterCellY = 5;
				break;
			case "0":
				letterCellX = 5;
				letterCellY = 5;
				break;
			case ".":
				letterCellX = 0;
				letterCellY = 6;
				break;
			case ",":
				letterCellX = 1;
				letterCellY = 6;
				break;
			case "-":
				letterCellX = 2;
				letterCellY = 6;
				break;
			case "?":
				letterCellX = 3;
				letterCellY = 6;
				break;
			case "!":
				letterCellX = 4;
				letterCellY = 6;
				break;
			default:	// Default to Space
				letterCellX = 5;
				letterCellY = 6;
				break;
		}

		var lineNumber = Math.floor(i/wrapWidth);
		var horizontal = i - (wrapWidth * lineNumber);
		var letterSheetX = letterSizeX * letterCellX;
		var letterSheetY = letterSizeY * letterCellY;
		var letterX = x + (letterSizeX * horizontal) + pixel(horizontal);	//Places a space between characters horizontally
		var letterY = y + (letterSizeY * lineNumber) + pixel(lineNumber);	//Places a space between characters vertically
		OS.context.drawImage(alphabet, letterSheetX, letterSheetY, letterSizeX, letterSizeY, letterX, letterY, letterSizeX, letterSizeY);
	}
}
