var ani_ocean = OS.A.Add("Ocean", 256, 256, {columns: 10, speed: 1/60});

function oceanTilePrefab() {}

var pr_ocean = OS.P.Add("Ocean Particle", {
	imageSrc: "images/ocean_sheet.png",
	animations: [ani_ocean],
	depth: -100,	// Draw below everything.

	positionCheckStep: 30,
	positionCheckProgress: 30,
	doCheckPosition: false,

	moveTimer: 0,
});

pr_ocean.BeforeDo = function () {
	this.positionCheckProgress++;
	if (this.positionCheckProgress >= this.positionCheckStep) {
		this.positionCheckProgress = 0;
		this.doCheckPosition = true;
	}
}
pr_ocean.Do = function () {
	// Move around randomly.
	this.moveTimer++;
	if (this.moveTimer >= 120) {
		this.x += 1 * pixel(Math.round(Math.randomRange(-1, 1)));
		this.y += 1 * pixel(Math.round(Math.randomRange(-1, 1)));
		this.moveTimer = 0;
	}
}

pr_ocean.CheckPosition = function (checkX, checkY, direction) {
	if (this.doCheckPosition) {
		// If it's completely off the screen, then update position.
		if ((Math.abs(this.x - checkX) > (OS.camera.width + this.xBound)) ||
			(Math.abs(this.y - checkY) > (OS.camera.height + this.yBound)))
		{
			switch (direction) {
				case 0:
					this.x = checkX + (OS.camera.width + this.xBound) + randomSmidge();
					this.y = checkY + randomSmidge();
					break;
				case 45:
					this.x = checkX + (OS.camera.width + this.xBound) + randomSmidge();
					this.y = checkY - (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 90:
					this.x = checkX + randomSmidge();
					this.y = checkY - (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 135:
					this.x = checkX - (OS.camera.width + this.xBound) + randomSmidge();
					this.y = checkY - (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 180:
					this.x = checkX - (OS.camera.width + this.xBound) + randomSmidge();
					this.y = checkY + randomSmidge();
					break;
				case 225:
					this.x = checkX - (OS.camera.width + this.xBound) + randomSmidge();
					this.y = checkY + (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 270:
					this.x = checkX + randomSmidge();
					this.y = checkY + (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 315:
					this.x = checkX + (OS.camera.width + this.xBound) + randomSmidge();
					this.y = checkY + (OS.camera.height + this.yBound) + randomSmidge();
					break;
				default:
					console.log("No valid direction");
					break;
			}
		}

		this.doCheckPosition = false;
	}
}
