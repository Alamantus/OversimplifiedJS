var ani_ship_r = OS.A.Add("Ship Right", 64, 64, {columns: 2, speed: 1/60, yOffset: 64 * 4});
var ani_ship_ur = OS.A.Add("Ship Up-Right", 64, 64, {columns: 2, speed: 1/60, yOffset: 64 * 7});
var ani_ship_u = OS.A.Add("Ship Up", 64, 64, {columns: 2, speed: 1/60, yOffset: 64 * 5});
var ani_ship_ul = OS.A.Add("Ship Up-Left", 64, 64, {columns: 2, speed: 1/60, yOffset: 64 * 6});
var ani_ship_l = OS.A.Add("Ship Left", 64, 64, {columns: 2, speed: 1/60, yOffset: 64 * 3});
var ani_ship_dl = OS.A.Add("Ship Down-Left", 64, 64, {columns: 2, speed: 1/60, yOffset: 64 * 1});
var ani_ship_d = OS.A.Add("Ship Down", 64, 64, {columns: 2, speed: 1/60, yOffset: 64 * 0});
var ani_ship_dr = OS.A.Add("Ship Down-Right", 64, 64, {columns: 2, speed: 1/60, yOffset: 64 * 2});

function shipPrefab() {}

var pr_ship = OS.P.Add("Ship", {
	solid: true,
	imageSrc: "images/ship_sheet.png",
	maskImageSrc: "images/ship_mask.png",
	animations: [ani_ship_r, ani_ship_ur, ani_ship_u, ani_ship_ul, ani_ship_l, ani_ship_dl, ani_ship_d, ani_ship_dr],
	
	direction: 0,
	currentSpeed: 0,
	pointInFront : {x: 0, y: 0 },
	moveStepSize: 3,
	moveStepAmount: 5 * OS.R[OS.R.currentRoom].stepSpeed,
	moveStepProgress: 0,
	doTakeStep: false,

	energyRefillTimer: 0,

	drawSickIndicator: 0,
	drawSickIndicatorTime: secondsWorthOfFrames(1.5)
});

pr_ship.BeforeDo = function () {
	if (G.gameStarted) {
		this.GetMapPosition();
	}
}

pr_ship.Do = function () {
	if (G.gameStarted) {
		if (guiControl && guiControl.inventory && guiControl.map && guiControl.trade) {   // Force it to wait until loaded.
			if (!guiControl.inventory.show && !guiControl.map.show && !guiControl.trade.show) {
				if (ct_left().down) {
					this.direction += 45;
				} else if (ct_right().down) {
					this.direction -= 45;
				}
				this.direction = Math.clampAngle(this.direction);
			
				if (ct_up().down) {
					this.currentSpeed++;
				} else if (ct_down().down) {
					this.currentSpeed--;
				}
				this.AdjustSpeedBasedOnEnergy();

				this.CheckInteraction();
			}
		}

		this.currentSpeed = Math.clamp(this.currentSpeed, 0, 4);
		
		this.moveStepProgress += this.currentSpeed * this.moveStepAmount;
		if (this.moveStepProgress >= this.moveStepSize) {
			this.moveStepProgress -= this.moveStepSize;
			this.doTakeStep = true;
		} else {
			this.doTakeStep = false;
		}

		this.SeamlessScroll();
		// console.log(G.player.name + " created at " + G.player.x + ", " + G.player.y);
	}
}

pr_ship.AfterDo = function () {
	if (G.gameStarted) {
		this.CheckMovement();
		this.UpdateEnergy();
	}
}

pr_ship.DrawAbove = function () {
	if (G.gameStarted) {
		this.drawSickIndicator--;
		if (this.drawSickIndicator < 0) {
			this.drawSickIndicator = 0;
		}
		if (this.drawSickIndicator > 0) {
			var sickIndicatorHeight = Math.round((this.drawSickIndicatorTime - this.drawSickIndicator) / 2) / OS.S.pixelScale;
			var sickIndicatorY = this.y - sickIndicatorHeight - Oversimplified.camera.y - (guiControl.iconScaled / 2);
			guiControl.drawIcon(4, 1, this.x - Oversimplified.camera.x - (guiControl.iconScaled / 2), sickIndicatorY);
		}
	}
}

pr_ship.GetMapPosition = function () {
	this.mapX = pixel(Math.round(this.x / pixel(64)));
	this.mapY = pixel(Math.round(this.y / pixel(64)));
	// console.log(this.mapX + ", " + this.mapY);
}

pr_ship.CheckInteraction = function () {
	if (ct_confirm().down) {
		var objectsFound = OS.GameObjectsAtPoint(this.pointInFront.x, this.pointInFront.y);
		if (objectsFound.length > 0) {
			for (var i = 0; i < objectsFound.length; i++) {
				if (objectsFound[i].canTrade) {
					// console.log("interacting with island: " + objectsFound[i].name);
					objectsFound[i].TradeWith();
				}
			}
		}
	}
}

pr_ship.CheckMovement = function () {
	var moveAmount = pixel(G.stats.speed + this.currentSpeed);
	var movedSuccessfully = false;
	switch (this.direction) {
		case 0:
			if (this.image.currentAnimation != "Ship Right") this.SetAnimation("Ship Right");
			if (this.doTakeStep) movedSuccessfully = this.SimpleMove(moveAmount, 0, true, pixel(4));
			this.pointInFront.x = this.x + this.xBound + pixel(2) + moveAmount;
			this.pointInFront.y = this.y;
			break;
		case 45:
			if (this.image.currentAnimation != "Ship Up-Right") this.SetAnimation("Ship Up-Right");
			if (this.doTakeStep) movedSuccessfully = this.SimpleMove(moveAmount, -moveAmount, true, pixel(4));
			this.pointInFront.x = this.x + this.xBound + pixel(2) + moveAmount;
			this.pointInFront.y = this.y - this.yBound - pixel(2) - moveAmount;
			break;
		case 90:
			if (this.image.currentAnimation != "Ship Up") this.SetAnimation("Ship Up");
			if (this.doTakeStep) movedSuccessfully = this.SimpleMove(0, -moveAmount, true, pixel(4));
			this.pointInFront.x = this.x;
			this.pointInFront.y = this.y - this.yBound - pixel(2) - moveAmount;
			break;
		case 135:
			if (this.image.currentAnimation != "Ship Up-Left") this.SetAnimation("Ship Up-Left");
			if (this.doTakeStep) movedSuccessfully = this.SimpleMove(-moveAmount, -moveAmount, true, pixel(4));
			this.pointInFront.x = this.x - this.xBound - pixel(2) - moveAmount;
			this.pointInFront.y = this.y - this.yBound - pixel(2) - moveAmount;
			break;
		case 180:
			if (this.image.currentAnimation != "Ship Left") this.SetAnimation("Ship Left");
			if (this.doTakeStep) movedSuccessfully = this.SimpleMove(-moveAmount, 0, true, pixel(4));
			this.pointInFront.x = this.x - this.xBound - pixel(2) - moveAmount;
			this.pointInFront.y = this.y;
			break;
		case 225:
			if (this.image.currentAnimation != "Ship Down-Left") this.SetAnimation("Ship Down-Left");
			if (this.doTakeStep) movedSuccessfully = this.SimpleMove(-moveAmount, moveAmount, true, pixel(4));
			this.pointInFront.x = this.x - this.xBound - pixel(2) - moveAmount;
			this.pointInFront.y = this.y + this.yBound + pixel(2) + moveAmount;
			break;
		case 270:
			if (this.image.currentAnimation != "Ship Down") this.SetAnimation("Ship Down");
			if (this.doTakeStep) movedSuccessfully = this.SimpleMove(0, moveAmount, true, pixel(4));
			this.pointInFront.x = this.x;
			this.pointInFront.y = this.y + this.yBound + pixel(2) + moveAmount;
			break;
		case 315:
			if (this.image.currentAnimation != "Ship Down-Right") this.SetAnimation("Ship Down-Right");
			if (this.doTakeStep) movedSuccessfully = this.SimpleMove(moveAmount, moveAmount, true, pixel(4));
			this.pointInFront.x = this.x + this.xBound + pixel(2) + moveAmount;
			this.pointInFront.y = this.y + this.yBound + pixel(2) + moveAmount;
			break;
		default:
			console.log("No valid direction");
			break;
	}

	if (this.doTakeStep && !movedSuccessfully) {
		this.currentSpeed = 0;
	}
}

pr_ship.UpdateEnergy = function () {
	this.energyRefillTimer++;
	if (this.energyRefillTimer >= (100 / G.stats.crew) + ((G.stats.illness) * (100 / G.stats.crew))) {
		G.stats.energy += G.stats.crew;
		this.energyRefillTimer = 0;
	}

	if (this.doTakeStep) {
		G.stats.energy -= ((this.currentSpeed / G.stats.speed) + ((G.stats.illness) * 0.1)) * 0.25;
	}

	if (G.stats.energy < 0) G.stats.energy = 0;
	if (G.stats.energy > G.stats.maxEnergy) G.stats.energy = G.stats.maxEnergy;
}

pr_ship.SeamlessScroll = function () {
	if (this.x <= rm_Ocean.mapLeftTrigger) {
		this.x = rm_Ocean.mapLeftTriggerTarget;
		OS.SetCamera({x: rm_Ocean.width});
	}
	else if (this.x >= rm_Ocean.mapRightTrigger) {
		this.x = rm_Ocean.mapRightTriggerTarget;
		OS.SetCamera({x: 0});
	}
	else if (this.y <= rm_Ocean.mapUpTrigger) {
		this.y = rm_Ocean.mapUpTriggerTarget;
		OS.SetCamera({y: rm_Ocean.height});
	}
	else if (this.y >= rm_Ocean.mapDownTrigger) {
		this.y = rm_Ocean.mapDownTriggerTarget;
		OS.SetCamera({y: 0});
	}
}

pr_ship.AdjustSpeedBasedOnEnergy = function () {
	if (this.currentSpeed > 3 && G.stats.energy < (G.stats.maxEnergy * 0.3) ||
		this.currentSpeed > 2 && G.stats.energy < (G.stats.maxEnergy * 0.15) ||
		this.currentSpeed > 1 && G.stats.energy < (G.stats.maxEnergy * 0.05))
	{
		this.currentSpeed--;
	}
}

pr_ship.CheckIllnessIncrease = function () {
	var percentChance = G.stats.crew + ((this.currentSpeed / (G.stats.energy + 0.001)) * G.stats.illness);	// +0.001 on the off-chance that energy reaches 0.
	if (Math.randomRange(0, 100) < percentChance) {
		G.stats.illness++;
		this.drawSickIndicator += secondsWorthOfFrames(1.5);
	}
}
