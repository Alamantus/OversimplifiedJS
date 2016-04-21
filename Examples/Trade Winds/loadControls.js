var ct_wasd_up = OS.C.Add("WASD Up", OS.Keycode.w);
var ct_wasd_left = OS.C.Add("WASD Left", OS.Keycode.a);
var ct_wasd_down = OS.C.Add("WASD Down", OS.Keycode.s);
var ct_wasd_right = OS.C.Add("WASD Right", OS.Keycode.d);
var ct_arrow_up = OS.C.Add("Arrow Up", OS.Keycode.up);
var ct_arrow_left = OS.C.Add("Arrow Left", OS.Keycode.left);
var ct_arrow_down = OS.C.Add("Arrow Down", OS.Keycode.down);
var ct_arrow_right = OS.C.Add("Arrow Right", OS.Keycode.right);

var ct_shift = OS.C.Add("Shift", OS.Keycode.shift);
var ct_space = OS.C.Add("Space", OS.Keycode.space);
var ct_z = OS.C.Add("Z", OS.Keycode.z);
var ct_x = OS.C.Add("X", OS.Keycode.x);
var ct_m = OS.C.Add("M", OS.Keycode.m);
var ct_esc = OS.C.Add("Cancel", OS.Keycode.escape);

function loadControls () {}

function ct_up () {
	return {
		held : ct_wasd_up.held || ct_arrow_up.held,
		down : ct_wasd_up.down || ct_arrow_up.down,
		up : ct_wasd_up.up || ct_arrow_up.up
	}
}

function ct_left () {
	return {
		held : ct_wasd_left.held || ct_arrow_left.held,
		down : ct_wasd_left.down || ct_arrow_left.down,
		up : ct_wasd_left.up || ct_arrow_left.up
	}
}

function ct_down () {
	return {
		held : ct_wasd_down.held || ct_arrow_down.held,
		down : ct_wasd_down.down || ct_arrow_down.down,
		up : ct_wasd_down.up || ct_arrow_down.up
	}
}

function ct_right () {
	return {
		held : ct_wasd_right.held || ct_arrow_right.held,
		down : ct_wasd_right.down || ct_arrow_right.down,
		up : ct_wasd_right.up || ct_arrow_right.up
	}
}

function ct_confirm () {
	return {
		held : ct_space.held || ct_z.held,
		down : ct_space.down || ct_z.down,
		up : ct_space.up || ct_z.up
	}
}

function ct_cancel () {
	return {
		held : ct_shift.held || ct_x.held,
		down : ct_shift.down || ct_x.down,
		up : ct_shift.up || ct_x.up
	}
}
