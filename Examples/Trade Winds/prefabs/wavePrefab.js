var ani_wave = OS.A.Add("Wave", 64, 64, {columns: 10, speed: 1/10});

function wavePrefab() {}

var pr_wave = OS.P.Add("Wave Particle", {
	imageSrc: "images/wave_sheet.png",
	animations: [ani_wave],
	depth: -90,	// Draw above ocean, below everything else.

	lifeTimer: 100,
});

pr_wave.Do = function () {
	// Move around randomly.
	this.lifeTimer--;
	if (this.lifeTimer <= 0) {
		this.Destroy();
	}
}