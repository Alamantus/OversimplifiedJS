## Before you begin....

You'll need to get the `index.html`, `Oversimplified.js` _(or Oversimplified.dev.js if you want to see the comments and get better error messages)_, and `start.js` files in this GitHub project and put them either in a local or server directory. OversimplifiedJS is designed to be exactly that&mdash;a little bit too simple for better or worse as you'll probably see below.

Once you have your directory ready, you begin by editing the `start.js` file. When you open the file, you'll find nothing but a sad, empty `function start() {}`, but as its name implies, this is the function where everything starts! It's the first function called even before the first frame of your game, and it is required in order for OversimplifiedJS to work, so always have a `start.js` file with a start function in it in the same directory as your index! _(Note, you can edit the `Oversimplified.js` file to change this expected location, but I'd recommend only doing that if you know how to read JavaScript well enough to not accidentally break something.)_

## Set Things Up

To start making your game, you'll want to make sure all the settings are in order (i.e. step speed, camera settings, controls, etc.). The {@link Oversimplified.Settings} namespace (aliased by `OS.S`) contains several useful elements like `OS.S.defaultStep`, `OS.S.preventRightClick`, and audio volume settings. The default step speed is `1/30`, which is to say 30 frames per second _(or more accurately, one thirtieth of a second passes per frame)_. If you want to change this, just access the `OS.Settings.defaultStep` variable and set it to your preferred default step speed. (Note: you can also set step speed per room, as you will see below.) Information about all of the options within `OS.Settings` can be found on the {@link Oversimplified.Settings} page in the documentation.

### The Camera

The camera size determines the size of the canvas on the page and is set to `640x480` by default. You can change this by using the {@link Oversimplified.SetCamera} function:

```javascript
// All of the options in the object below are optional and default to the values presented.
OS.SetCamera({
  width: 640,  // The width specified here will set the width of the HTML5 canvas.
  height: 480, // The height specified here will set the height of the HTML5 canvas.
  x: 0,        // The x position of the top left corner of the camera within the current room.
  y: 0,        // The y position of the top left corner of the camera within the current room.
  objectToFollow: null, // A reference to an OversimplifiedJS GameObject.
  hBorder: 64, // The number of pixels away from the camera's edge horizontally that the objectToFollow must be before the camera scrolls.
  vBorder: 64, // The number of pixels away from the camera's edge vertically that the objectToFollow must be before the camera scrolls.
});
```  
You can learn about all of `OS.camera`'s properties and behaviors on the {@link Oversimplified.camera} page in the documentation.

### Controls

Finally, you'll want to set up controls to use. Controls live in the {@link Oversimplified.Controls} namespace, which has a convenient alias `OS.C` that you can use instead, and are used to specify keyboard buttons that will be used within the game (mouse position and click status is stored separately in {@link Oversimplified.mouse} and do not need to be set up as a control).

Controls are created using the {@link Oversimplified.Controls#Add} function and the values in {@link Oversimplified.Keycode}. There are two kinds of controls in OversimplifiedJS: {@link Oversimplified.Control} and {@link Oversimplified.Axis}. A `OS.Control` checks for just one key to be pressed and provides data like `pressed`, `held`, and `released`, while an `OS.Axis` checks 2 keys as "directions" and returns `-1`, `0`, or `1` depending on which direction is pressed.

Here is an example of how these could each be useful:

```javascript
// Jumping and attacking are actions that you might want to know how the player pressed the button.
var ct_jump = {@link Oversimplified.Controls#Add|OS.C.Add}("Jump", OS.Keycode.z);
var ct_attack = {@link Oversimplified.Controls#Add|OS.C.New}("Duck", OS.Keycode.x); // OS.C.New is an alias of OS.C.Add and can be used if you prefer.

// Horizontal and vertical movement would be useful to have just a positive or negative value for so you can easily move based on speed, for example.
var ax_horizontal = {@link Oversimplified.Controls#Add|OS.C.Add}("Horizontal", OS.Keycode.right, OS.Keycode.left);
var ax_vertical = {@link Oversimplified.Controls#Add|OS.C.New}("Vertical", OS.Keycode.down, OS.Keycode.up);
```  
You can find all of the keycode shortcuts on the {@link Oversimplified.Keycode} page, and all of the information you could possibly need to know about Controls are on the {@link Oversimplified.Control} and {@link Oversimplified.Axis} pages.

## Make a Space

Next you'll want to create a room in the {@link Oversimplified.Rooms} namespace (which has a convenient alias `OS.R`). The first room that OversimplifedJS expects is called "Default", but you can create that room and access it with a variable like this.

```javascript
var rm_FirstRoom = {@link Oversimplified.Rooms#Add|OS.Rooms.Add}("Default", {
  width: 640,  // The width of the room. Can be bigger than the camera's width.
  height: 480, // The height of the room. Can be bigger than the camera's height.
  backgroundSrc: "path/to/background/image.png", // An image to use as the room's background (does not repeat/tile).
  backgroundColor: "#FFFFFF", // An HTML Hex value color to draw underneath the background image if you include one.
  stepSpeed: 1/30, // The frame speed for this particular room.
});
//You can also use OS.Rooms.New or even OS.R.Add or OS.R.New to do exactly the same thing as above.
```

To make things a little bit simpler, all of the arguments (except for the name) are optional! If you leave out the options (i.e. `OS.R.Add("Room Name");`), it defaults to the camera's size and prevents camera movement. If you leave out the path to the backgroundSrc or a backgroundColor, then it doesn't draw a background and becomes transparent, showing the background of either the canvas or the page (specified through CSS). If you leave out the step speed, then it uses the {@link Oversimplified.Settings|OS.Settings}.defaultStep` value.

Note that creating a `Room` requires a unique name for every `Room` in your game.

## Fill the Space

Last, you'll want to add objects to the room you just created.

Each Room you create holds its own {@link Oversimplified.GameObject}s in its {@link Oversimplified.Room#objects} property (accessible from `OS.R["Room Name"].objects` or `rm_FirstRoom.objects` if using a variable like the above example), so to add an object to a Room at the start of the game (so those objects will be there when the room is on screen), you'll use the {@link Oversimplified.Room#AddObject|OS.Room.AddObject} function or simply {@link Oversimplified.Create} to add to the current room. How you created your room determines how you'll use this function. For example:

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

In the above example, `imageSrc` specifies the sprite sheet you want to use for that object at "path/to/image.png". This is explained below with `OS.Animations`. `maskImageSrc` specifies an image whose size is used as reference for the object's bounding box and lives at "path/to/mask.png". If you exclude this option, it will use the size of the default `Animation`. Finally, if no `animations` value is set, OversimplifiedJS will simply use that object's `imageSrc` as a static sprite.

As with `Room`s above, `GameObject`s must have a unique name _within the `Room` they are added to_. This means that different `Room`s _can_ contain separate `GameObject`s with the same name.

After creating `GameObjects` within a `Room`, the _current_ `Room`'s `objects` can be accessed via `OS.O` for easier access when working with your code.

### Animations

The `animations` option above refers to an array of the last kind of thing you need for your game: {@link Oversimplified.Animation}s. `Animation`s live in the {@link Oversimplified.Animations} namespace (which can be accessed using the alias `OS.A`. Hopefully you've seen the pattern with the namespaces by now.) and can be created by, you guessed it, the familiar {@link Oversimplified.Animations#Add|OS.Animations.Add} syntax. You'll want to create your `Animation`s before you create your `GameObject` so you can actually access them. For example:

```javascript
var ani_idle = OS.Animations.Add("Idle", spriteWidth, spriteHeight, {
  columns: numberOfColumns,
  rows: numberOfRows,
  speed: speedScale,
  xOffset: xOffsetOnSheet,
  yOffset: yOffsetOnSheet
});
// OS.A.New is an alias of OS.A.Add and can be used if you prefer.
var ani_walkLeft = OS.Animations.New("Walk Left", spriteWidth, spriteHeight, {
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
// Then add them to a player GameObject
var player = rm_MainRoom.AddObject("Player", {
  x: 20,
  y: 20,
  imageSrc: "path/to/image",
  maskImageSrc: "path/to/mask",
  animations: [ani_idle, ani_walkLeft, ani_walkRight, ani_jumpLeft]
});
```

`Animation`s are meant to be used with a sprite sheet, which is set as the attached `GameObject`'s `imageSrc`.

If there are multiple rows in your sprite sheet, you're going to want to have just as many columns in the subsequent rows as there are in the first. Otherwise, just keep each animation in its own row.

- `spriteWidth` and `spriteHeight` refers to the dimensions of the individual frame while `columns` and `rows` refers to the number of animation frames from left to right that are in each of the vertical rows of the sprite sheet.
- `speed` should be a number between 0 and 1 (it is automatically clamped between 0 and 1 in case you enter a higher or lower number for some reason) that scales the animation speed relative to the Room's step speed.
- `xOffset` and `yOffset` is the pixel offset for the animation. For example, say you have your sprite sheet set up so that "Walk Left" is right above "Walk Right". To set `ani_walkRight` to the "Walk Right" section, you would set the `yOffset` to the height of the sprite so the animation would start reading at the correct spot.

These Animations can then be added to the animations array for the object within the object's `animations` declaration like this: `[ani_idle, ani_walkLeft, ani_walkRight, ani_jumpLeft]` or via {@link Oversimplified.GameObject#AddAnimation}, and they can be used on the `GameObject` using the {@link Oversimplified.GameObject#SetAnimation} function:

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

As with all the previous named instances within a collection namespace, the `name` of each `Animation` must be unique.

## Get Things Working

Once you've got your `Animation`s and `GameObject`s set up in your room, you're ready to start setting the `GameObject`s' actions! To do or check something every frame, use the {@link Oversimplified.GameObject#Do|OS.GameObject.Do} function:

```javascript
player.Do = function () {    //Due to JavaScript's syntax, you MUST either create your function ahead of time OR use this function() {} syntax to set your object's Do().
  console.log("My name is " + this.name);    //This will print out "My name is player<id>" 30 times every second in the browser's console if it's in the current room.
}
```

If you're not experienced with game development, heed this warning: you'll mostly want to use {@link Oversimplified.GameObject#Do|Do()} for things like checking controls and events rather than say creating other `GameObject`s or writing to the console because it runs once every [Frame]{@tutorial understandingTheFrame}!

There are lots of other object functions that you can create and access that perform differently and at different times, like {@link Oversimplified.GameObject#BeforeDo|BeforeDo()} and {@link Oversimplified.GameObject#DoLast|DoLast()}. Take a look at the documentation page for {@link Oversimplified.GameObject} for full details about the properties and methods available in each `GameObject`!

### PremadeObjects (a.k.a. Prefabs)

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
* You'll need to have each separate direction as a separate animation set on your sprite sheet(s) in order to indicate direction. This is because inverting images in any direction (using scale) is outrageously inefficient on HTML5 canvas and is not friendly to video games.