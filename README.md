OversimplifiedJS
=============
A lightweight, modular 2-D game engine for HTML5 canvas &amp; JavaScript  
(Current Version: 0.8)

Getting Started
-------------

You'll need to get the `index.html`, `Oversimplified.js` _(or Oversimplified.min.js&mdash;the release file contains only a minified version)_, and `start.js` files in this GitHub project and put them either in a local or server directory. OversimplifiedJS is designed to be exactly that&mdash;a little bit too simple for better or worse as you'll probably see below.

Once you have your directory ready, you begin by editing the `start.js` file. When you open the file, you'll find nothing but a sad, empty `function start() {}`. As its name implies, however, this is the function where everything starts! It's the first function called even before the first frame of your game, and it is required in order for OversimplifiedJS to work, so always have a `start.js` file with a start function in it in the same directory as your index! _(Note, you can edit the `Oversimplified.js` file to change this expected location, but I'd recommend only doing that if you know how to read JavaScript well enough to not accidentally break something.)_

To start making your game, you'll want to make sure all the settings are in order (i.e. step speed, camera settings, controls, etc.). The `OS.Settings` namespace (aliased by `OS.S`) contains several useful elements like `OS.S.defaultStep`, `OS.S.preventRightClick`, and audio volume settings. The default step speed is `1/30`, which is to say 30 frames per second _(or more accurately, one thirtieth of a second passes per frame)_. If you want to change this, just access the `OS.Settings.defaultStep` variable and set it to your preferred default step speed. (Note: you can also set step speed per room, as you will see below.) Information about all of the options within `OS.Settings` can be found on the [Settings](https://github.com/Alamantus/OversimplifiedJS/wiki/Settings) page in the wiki.

The camera size determines the size of the canvas on the page and is set to `640x480` by default. You can change this by using the `OS.SetCamera()` function:  
```javascript
// All of the options in the object below are optional and default to the values presented.
OS.SetCamera({
    width: 640,				// The width specified here will set the width of the HTML5 canvas.
    height: 480,			// The height specified here will set the height of the HTML5 canvas.
    x: 0,					// The x position of the top left corner of the camera within the current room.
    y: 0,					// The y position of the top left corner of the camera within the current room.
    objectToFollow: null	// A reference to an OversimplifiedJS GameObject.
    hBorder: 64,			// The number of pixels away from the camera's edge horizontally that the objectToFollow must be before the camera scrolls.
    vBorder: 64,			// The number of pixels away from the camera's edge vertically that the objectToFollow must be before the camera scrolls.
});
```  
You can learn about all of `OS.camera`'s properties and behaviors on the [Camera](https://github.com/Alamantus/OversimplifiedJS/wiki/Camera) page in the wiki.

Finally, you'll want to set up controls to use. Controls live in the `OS.Controls` namespace, which has a convenient alias `OS.C` that you can use instead, and are created using the `OS.Controls.Add()` function and the values in `OS.Keycode`. There are two kinds of controls in OversimplifiedJS: `OS.Control` and `OS.Axis`. A `OS.Control` checks for just one key to be pressed and provides data like `pressed`, `held`, and `released`, while an `OS.Axis` checks 2 keys as "directions" and returns `-1`, `0`, or `1` depending on which direction is pressed.

Here is an example of how these could each be useful:  
```javascript
// Jumping and attacking are actions that you might want to know how the player pressed the button.
var ct_jump = OS.C.Add("Jump", OS.Keycode.z);
var ct_attack = OS.C.New("Duck", OS.Keycode.x);	// OS.C.New is an alias of OS.C.Add and can be used if you prefer.

// Horizontal and vertical movement would be useful to have just a positive or negative value for so you can easily move based on speed, for example.
var ax_horizontal = OS.C.Add("Horizontal", OS.Keycode.right, OS.Keycode.left);
var ax_vertical = OS.C.New("Vertical", OS.Keycode.down, OS.Keycode.up);
```  
You can find all of the keycode shortcuts on the [Keycodes](https://github.com/Alamantus/OversimplifiedJS-Engine/wiki/Keycodes) page in the wiki. And all of the information you could possibly need to know about Controls are on the [Controls](https://github.com/Alamantus/OversimplifiedJS-Engine/wiki/Controls) page in the wiki.

Next you'll want to create a room. You create rooms in the `OS.Rooms` namespace (which has a convenient alias `OS.R`). The first room that Oversimplifed expects is called "Default", but you can create that room and access it with a variable like this.  
```javascript
var rm_FirstRoom = OS.R.Add("Default", {
	width: 640,		// The width of the room. Can be bigger than the camera's width.
	height: 480,	// The height of the room. Can be bigger than the camera's height.
	backgroundSrc: "path/to/background/image.png",	// An image to use as the room's background (does not repeat/tile).
	backgroundColor: "#FFFFFF",		// An HTML Hex value color to draw underneath the background image if you include one.
	stepSpeed: 1/30		// The frame speed for this particular room.
});
//You can also use Rooms.New or even R.Add or R.New to do exactly the same thing as above.
```  
To make things a little bit simpler, all of the arguments (except for the name) are optional! If you leave out the options (i.e. `R.Add("Room Name");`), it defaults to the camera's size and prevents camera movement. If you leave out the path to the backgroundSrc or a backgroundColor, then it doesn't draw a background and becomes transparent, showing the background of either the canvas or the page (specified through CSS). If you leave out the step speed, then it uses the `OS.Settings.defaultStep` value.

Last, you'll want to add objects to the room. Each Room you create holds its own objects in its `OS.Room.objects` property (accessible from `OS.R["Room Name"].objects` or `rm_FirstRoom.objects` if using a variable like the above example), so to add an object to a Room at the start of the game (so those objects will be there when the room is on screen), you'll use the `OS.Room.AddObject()` function or `OS.Create()` to add to the current room. How you created your room determines how you'll use this function. For example:  
```javascript
//If you created a room and set a variable reference...
var rm_MainRoom = OS.R.Add("Default");
//then you'll add objects using the variable reference:
var player = rm_MainRoom.AddObject("Player", {
	x: 20,
	y: 20,
	imageSrc: "path/to/image",
	maskImageSrc: "path/to/mask",
	animations: [array, of, animations]
});

//Otherwise, you'll add objects using the room's name, like so:
OS.R.Add("Another Room");
var enemy = OS.R["Another Room"].AddObject("Enemy", {
	x: 40,
	y: 40,
	imageSrc: "path/to/image.png",
	maskImageSrc: "path/to/mask.png",
	animations: [array, of, animations]
});
```  
In the above example, `imageSrc` specifies the sprite sheet you want to use for that object at "path/to/image.png". This is explained below with `OS.Animations`. `maskImageSrc` specifies an image whose size is used as reference for the object's bounding box and lives at "path/to/mask.png". If you exclude this option, it will use the size of the default Animation.  
`animations` above refers to an array of the last kind of thing you need for your game: Animations. Animations live in the `OS.Animations` namespace (which can be accessed using the alias `OS.A`. Hopefully you've seen the pattern with the namespaces by now.) and can be created by, you guessed it, the `OS.Animations.Add()` syntax. You'll want to create your animations before you create your objects so you can actually access them. For example:  
```javascript
var ani_idle = OS.Animations.Add("Idle", spriteWidth, spriteHeight, {
	columns: numberOfColumns,
	rows: numberOfRows,
	speed: speedScale,
	xOffset: xOffsetOnSheet,
	yOffset: yOffsetOnSheet
});
var ani_walkLeft = OS.Animations.New("Walk Left", spriteWidth, spriteHeight, {	// OS.C.New is an alias of OS.C.Add and can be used if you prefer.
	columns: numberOfColumns,
	xOffset: xOffsetOnSheet
});
var ani_walkRight = OS.A.Add("Walk Right", spriteWidth, spriteHeight, {
	columns: numberOfColumns,
	rows: numberOfRows,
	speed: speedScale,
	yOffset: yOffsetOnSheet
});
var ani_jumpLeft = OS.A.New("Jump Left", spriteWidth, spriteHeight, {
	columns: numberOfColumns,
	yOffset: yOffsetOnSheet
});
```
Animations are meant to be used with a sprite sheet, and if there are multiple rows, you're going to want to have just as many columns in the subsequent rows as there are in the first. Otherwise, just keep each animation in its own row. `spriteWidth` and `spriteHeight` refers to the dimensions of the individual frame while `columns` and `rows` refers to the number of animation frames from left to right that are in each of the vertical rows of the sprite sheet. `speed` should be a number between 0 and 1 (it is automatically clamped between 0 and 1 in case you enter a higher or lower number for some reason) that scales the animation speed relative to the Room's step speed. Finally, `xOffset` and `yOffset` is the pixel offset for the animation. For example, say you have your sprite sheet set up so that "Walk Left" is right above "Walk Right". To set `ani_walkRight` to the "Walk Right" section, you would set the `yOffset` to the height of the sprite so the animation would start reading at the correct spot.  
These Animations can then be added to the animations array for the object within the object's `animations` declaration like this: `[ani_idle, ani_walkLeft, ani_walkRight, ani_jumpLeft]` and can be set on the object using the GameObject's `SetAnimation()` function:
```javascript
if (ax_horizontal < 0) {
	player.SetAnimation("Walk Left");
}
//Or you can just put in the animation's variable:
else if (ax_horizontal > 0) {
	player.SetAnimation(ani_walkRight);
}
//OR you can access the animation directly from the OS.Animations namespace, just as long as that animation is already in the object's animations array.
// Note that all animations are put into the OS.Animations namespace, so you must make sure they all have unique names.
if (ct_jump.pressed) {
	player.SetAnimation(OS.A["Jump Left"]);
}
```  
Note the last instance uses this JavaScript syntax: `Object["property"]`. This is how you access things with spaces in their names, rather than using `Object.property`.

Once you've got your animations and objects set up in your room, you're ready to start setting the objects' actions! To do or check something every frame, use the `OS.GameObject.Do()` function:
```javascript
player.Do = function () {		//Due to JavaScript's syntax, you MUST either create your function ahead of time OR use this function() {} syntax to set your object's Do().
	console.log("My name is " + this.name);		//This will print out "My name is player<id>" 30 times every second in the browser's console if it's in the current room.
}
```
If you're not experienced with game development, heed this warning: you'll mostly want to use `Do()` for things like checking controls and events rather than say creating objects or writing to the console. There are lots of other object functions that you can create and access that perform differently and at different times, like `BeforeDo()` and `DoLast()`, but those will be covered in the wiki once it is built. Until then, you'll have to dig in the source to find it all. :)

The last thing you need to know about are `OS.PremadeObjects` (or `OS.Prefabs`). You can create a PremadeObject that can then be used to easily add to Rooms or be created after the Room has been running for a while. To do this, you would create an object in the `OS.PremadeObjects` namespace instead of directly in the room first. PremadeObjects live in the `OS.PremadeObjects` namespace (aliased with either `OS.Prefabs` or `OS.P`) and can be created using the `OS.PremadeObjects.Add()` syntax:  
```javascript
var bulletPrefab = PremadeObjects.Add("Bullet", {
	x: 0,
	y: 0,
	imageSrc: "path/to/image",
	maskImageSrc: "path/to/mask",
	animations: [array, of, animations]
});
bulletPrefab.Do = function () {
	this.SimpleMove(5, 0, true);
}

// Create a bullet in the current room
player.Do = function () {
	if (ct_attack.pressed) {
		OS.Create(bulletPrefab, {
			x: 350,
			y: 411
		});
	}
}
```  
Prefabs and other methods for adding objects will be discussed further once the wiki is finished, but for now, that's what you get.  
_NOTE: If you use multiple `.js` files to separate your code and you need to refer to an object in another file, always do so within the file's main function. Adding an existing object from another file outside of this function may result in the object not loading correctly, but adding the object in from the file's main function ensures that all other `.js` files have been loaded and the object you are referring to does exist. Refer to the [Modules wiki](https://github.com/Alamantus/OversimplifiedJS/wiki/Modules "Page will be updated with more details later") for more information._

So I hope you enjoy using OversimplifiedJS! If you need to know more about how to do things, you'll unfortunately either need to wait until the wiki is ready or dig into that source code yourself to see what's there! Or you can check out one of my projects like [Trade Winds](https://github.com/AlamantusGameDev/Trade-Winds) to see how I'm using OversimplifiedJS. Otherwise, good luck and have fun! :D

Things You Should Know
-------------

* OversimplifiedJS exists to make your game development process simpler by giving easy access to basic game development objects, so you'll definitely still need to know your way around JavaScript and be comfortable with text editors if you want to make a game with it.
* OversimplifiedJS has not been stress tested with lots of objects that all have complicated `Do()` functions! Be careful and report bugs to the issue tracker (or fix them yourself and send a pull request! That would be wonderful!).
* Basic browser mouse and keyboard scrolling controls are disabled on the canvas. You can right click and scroll outside of the canvas, but these default actions are disabled when hovering over the canvas (though there is a setting to allow right clicking)! Likewise, the arrow keys and space bar will not scroll the page, period. Keep this in mind when choosing your camera size.
* Don't make rooms that are smaller than your camera! I haven't tested this, but I think it'll just make things display weird...
* Objects you create in rooms retain their properties after changing rooms! If you want objects to reset after changing rooms and returning, you'll need to manually set every property back to the value you want. To make things easier for you, you can use your `OS.Room.DoLast()` function to do this when your room changes, but you'll need to specify each object's properties manually. Make sure you always Destroy unused objects or else they'll stick around in the Room for the whole game session. Destroy is used with  `OS.GameObject.Destroy()`.
* You'll want to need to have each separate direction as a separate animation set on your sprite sheet(s) in order to indicate direction. This is because inverting images in any direction (using scale) is outrageously inefficient on HTML5 canvas and is not friendly to video games.

Policy for Contribution
-------------

If you want to contribute to OversimplifiedJS's code to add/improve functionality or to include a module or something, then I absolutely welcome you to! All I ask is that you keep one thing in mind: Is it simple? The way I built OversimplifiedJS focuses on giving users options and simplicity: if you want to create an object in the current room, just call `var object = OS.Create(//some prefab, {x: 10, y: 4})` and it's there and ready to be used; if you want an object to do something, the code is `object.Do = function() {//thing to do here}` _(and I would have gone without the "`= function()`" bit if JavaScript would have allowed me to)_. The point is that the code should be readable, understandable, and relatively easy to use. If your code can be described as such, then it will be welcomed with open arms!

Planned Additions
-------------

Things I'm planning to add to OversimplifiedJS at some point in the future include (in no particular order):
* Grouped bounding boxes for complex collisions
* Sample Modules
* ~Sound and Music classes~ Added in Version 0.8 within the `OS.Effects` namespace: `OS.Effects.AddSound()` and `OS.Effects.AddTune()`.
* ~~Touch controls~~ Added in Version 0.62&mdash;touches emulate mouse buttons (1 finger = left mouse, 2 fingers = right mouse, 3 fingers = middle mouse)
* ~Easy-access Settings adjustments~ Added in Version 0.8 with more options probably coming.
* ~~Maybe scale the canvas and its contents if the window can't fit it.~~ Because of HTML5 canvas' AA, this would not be ideal.
* ~~`Axis` control class that returns positive, negative, or 0 based on a set of 2 keys~~ Added in Version 0.6
* ~~`AddAnimation()` function for easily adding Animations to GameObjects after creation.~~ Added in Version 0.6

About
-------------

I'll put this section down at the bottom because I'm sure it's the least important to you. My name is Robbie Antenesse, and I manage [Alamantus GameDev](http://www.alamantus.com), a hobby game development studio with a focus on inclusivity and education (on top of developing games). Because I'm still learning myself, I tend to sporadically start new projects using new skills and techniques I've learned, which is a really bad business model when your goal is to make (and finish) games. At the time of this writing, I have completed two games ([DataFall](http://alamantus-gamedev.itch.io/datafall), which is playable online with the Unity Web Player, and [Trade Windw](https://alamantus-gamedev.itch.io/trade-winds)) and am always working on some sort of project ([Personal Github](https://github.com/Alamantus) and [Gamedev Githu](https://github.com/AlamantusGameDev), but I decided to make a game engine just to see if I could do it in one week. It turns out that I can! It's pretty basic and has lots of room for expansion, but that's what you get when you only give it one week. I went with "Oversimplified" as a name because I wanted to make it easy on both myself and whoever ends up using it.  
Anyway, I'll be updating and accepting updates from you all if you want to contribute at a pretty slow pace. My mindset is "It can certainly be improved, but it's done for now," so don't expect a reliable schedule of updates. I'll update it if I get the chance to come back to it.

License
-------------
I don't know. Probably a CC Share-Alike, NonCommercial license or something. If you use it, please let me know! I'd love to see what you can make with it. If you modify it or fork it or anything like that, also let me know so I can stay in the loop with what's happening to my code.

Thanks!  
-Robbie Antenesse
