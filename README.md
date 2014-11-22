OversimplifiedJS
=============
(Current Version: 0.5)
A lightweight, modular 2-D game engine for HTML5 canvas &amp; JavaScript

Getting Started
-------------

You'll need to get the `index.html`, `Oversimplified.js` _(this is a minified but identical `OversimplifiedJS_source.js`)_, and `start.js` files in this GitHub project and put them either in a local or server directory. OversimplifiedJS is designed to be exactly that&mdash;a little bit too simple for better or worse as you'll probably see below.

Once you have your directory ready, you begin by editing the start.js file. When you open the file, you'll find nothing but a sad, empty start() function. As its name implies, however, this is the function where everything starts! It's the first function called even before the first frame of your game, and it is required in order for OversimplifiedJS to work, so always have a start.js file with a start function in it in the same directory as your index! _(Note, you can edit the OversimplifiedJS.js file to change this expected location, but I'd recommend only doing that if you know how to read JavaScript well enough to not accidentally break something.)_

To start making your game, you'll want to make sure all the settings are in order (i.e. step speed, camera settings, controls, etc.). Eventually there will be a Settings namespace where all of these useful settings will be stored and you can just knock it out all in one place, but as of version 0.5, they're a little bit scattered. The default step speed is 1/30, which is to say 30 frames per second. If you want to change this, just access the `DEFAULT_STEP` variable and set it to your preferred default step speed. (Note: you can set step speed per room, as you will see below.) The camera size determines the size of the canvas on the page and is set to 900x650 by default, just because. You can change this by doing this:    
```javascript
camera.width = 1000;
camera.height = 1000;
```
Just be sure that the camera size isn't inconvenient for your players! The camera also has x and y values that adjust its position in the room, though if your room isn't bigger than the camera, this won't mean anything, as the camera cannot move outside of the room's boundaries.    
Finally, you'll want to set up controls to use. Controls live in the Controls namespace (which has a convenient alias C that you can use instead) and are created using the syntax `Controls.Add(keycode)`, for example    
```javascript
var leftKey = Controls.Add(Keycode.left);
var rightKey = Controls.New(Keycode.right);
var upKey = C.Add(Keycode.up);
var downKey = C.New(Keycode.down);
```    
Note the four different ways of doing the same thing for your convenience. You can find all of the keycode shortcuts on [this page in the wiki](https://github.com/Alamantus/OversimplifiedJS-Engine/wiki/Keycodes). Now that you have controls, you can access them by their properties `down`, `held`, and `up`, which return true or false based on hopefully self-explanatory conditions.

Next you'll want to start creating rooms. You create rooms in the Rooms namespace (which has a convenient alias R) The first room that Oversimplifed expects is called "Default", but you can create that room and access it with a variable like this.    
```javascript
var roomWidth = 4000;
var roomHeight = 2000;
var stepSpeed = DEFAULT_STEP;	//DEFAULT_STEP is 1/30, but this can be changed if you want.

var firstRoom = Rooms.Add("Default", roomWidth, roomHeight, "path/to/background", stepSpeed);
//You can also use Rooms.New or even R.Add or R.New to do exactly the same thing as above.
```    
To make things a little bit simpler, all of the arguments (except for the name) are optional! If you leave out width and height (i.e. `R.Add("Room Name");`), it defaults to the camera's size and prevents camera movement. If you leave out the path to the background (i.e. `R.Add("Room Name", width, height);`), then it doesn't draw a background and becomes transparent, showing the background of either the canvas or the page (specified through CSS). If you leave out the step speed, then it uses the DEFAULT_STEP value.

Last, you'll want to add objects to the room. Each Room you create holds its own objects in its Room.objects property, so to add an object to a Room at the start of the game (so those objects will be there when the room is on screen), you'll use the `Room.AddObject()` function. How you created your room determines how you'll use this function. For example:    
```javascript
//If you created a room and set a variable reference...
var mainRoom = R.Add("Default");
//then you'll add objects using the variable reference:
mainRoom.AddObject("player", x, y, "path/to/image", "path/to/mask", [array, of, animations]);

//Otherwise, you'll add objects using the room's name, like so:
R.Add("Another Room");
R["Another Room"].AddObject("enemy", x, y, "path/to/image", "path/to/mask", [array, of, animations]);
```    
In the above example, "path/to/image" specifies the sprite sheet you want to use for that object. This is explained below with Animations. "path/to/mask" specifies an image whose size is used as reference for the object's bounding box. If you enter `false` instead of a valid image path, it will use the size of the default Animation.    
[array, of, animations] above refers to an array of the last kind of thing you need for your game: Animations. Animations live in the Animations namespace (which can be accessed using the alias A. Hopefully you've seen the pattern with the namespaces by now.) and can be created by, you guessed it, the `Animations.Add()` syntax. You'll want to create your animations before you create your objects so you can actually access them. For example:    
```javascript
var idleAnimation = Animations.Add("Idle", spriteWidth, spriteHeight, numberOfColumns, numberOfRows, speed, xOffsetOnSheet, yOffsetOnSheet);
var walkLeftAnimation = Animations.New("Walk Left", spriteWidth, spriteHeight, numberOfColumns, numberOfRows, speed, xOffsetOnSheet, yOffsetOnSheet);
var walkRightAnimation = A.Add("Walk Right", spriteWidth, spriteHeight, numberOfColumns, numberOfRows, speed, xOffsetOnSheet, yOffsetOnSheet);
var jumpLeftAnimation = A.New("Jump Left", spriteWidth, spriteHeight, numberOfColumns, numberOfRows, speed, xOffsetOnSheet, yOffsetOnSheet);
```
Animations are meant to be used with a sprite sheet, and if there are multiple rows, you're going to want to have just as many columns in the subsequent rows as there are in the first. Otherwise, just keep each animation in its own row. `spriteWidth` and `spriteHeight` refers to the dimensions of the individual frame while `numberOfColumns` and `numberOfRows` refers to the number of animation frames from left to right that are in each of the vertical rows of the sprite sheet. `speed` should be a number between 0 and 1 (it is automatically clamped between 0 and 1 in case you enter a higher or lower number for some reason) that scales the animation speed relative to the Room's step speed. Finally, `xOffsetOnSheet` and `yOffsetOnSheet` is the pixel offset for the animation. For example, say you have your sprite sheet set up so that "Walk Left" is right above "Walk Right". To set `walkRightAnimation` to the "Walk Right" section, you would set the `yOffsetOnSheet` to the height of the sprite so the animation would start reading at the correct spot.    
These Animations can then be added to the animations array for the object within the object's declaration like this: `[idleAnimation, walkLeftAnimation, walkRightAnimation, jumpLeftAnimation]` and can be set on the object using the Object's SetAnimation() function:
```javascript
if (leftKey.down) {
	player.SetAnimation("Walk Left");
}
//Or you can just put in the animation's variable:
if (rightKey.down) {
	player.SetAnimation(walkRightAnimation);
}
//OR you can access the animation directly from the Animations namespace,
//just as long as that animation is already in the object's animations array.
if (upKey.down) {
	player.SetAnimation(A["Jump Left"]);
}
```    
Note the last instance uses this syntax: `Object["property"]`. This is how you access things with spaces in their names, rather than using `Object.property`.

Once you've got your animations and objects set up in your room, you're ready to start setting the objects' actions! To do or check something every frame, use the `object.Do()` function:
```javascript
player.Do = function () {		//Due to JavaScript's syntax, you MUST either create your function ahead of time OR use this function() {} syntax to set your object's Do().
	console.log("My name is " + this.name);		//This will print out "My name is player<id>" 30 times every second in the console if it's in the current room.
}
```
If you're not experienced with game development, heed this warning: you'll mostly want to use Do() for things like checking controls and events rather than say creating objects or writing to the console. There are lots of other object functions that you can create and access that perform differently and at different times, like `BeforeDo()` and `DoLast()`, but those will be covered in the wiki once it is built. Until then, you'll have to dig in the source to find it all. :)

The last thing you need to know about are PremadeObjects (or Prefabs). You can create a Prefab that can then be used to easily add to Rooms or be created after the Room has been running for a while. To do this, you would create an object in the PremadeObjects namespace instead of directly in the room first. PremadeObjects live in the PremadeObjects namespace (aliased with either Prefabs or P) and can be created using the `PremadeObjects.Add()` syntax:    
```javascript
playerPrefab = PremadeObjects.Add("player", x, y, "path/to/image", "path/to/mask", [array, of, animations]);

mainRoom.AddObject(playerPrefab);

//After runtime, within a Do()
if (spaceKey.down) {
	CreateObject(playerPrefab);
}
```    
Prefabs and other methods for adding objects will be discussed further once the wiki is finished, but for now, that's what you get.

So I hope you enjoy using OversimplifiedJS! If you need to know more about how to do things, you'll unfortunately either need to wait until the wiki is ready or dig into that source code yourself to see what's there! Don't worry, I'll be working as quickly as I can to write up the most thorough wiki I can possibly make. Until then, good luck and have fun! :D

Things You Should Know
-------------

* OversimplifiedJS exists to make your game development process simpler by giving easy access to basic game development objects, so you'll definitely still need to know your way around JavaScript and be comfortable with text editors if you want to make a game with it.
* OversimplifiedJS has not been stress tested with lots of objects that all have complicated `Do()` functions! Be careful and report bugs to the issue tracker (or fix them yourself and send a pull request! That would be wonderful!).
* There is no built-in audio support yet (as of version 0.5), so you'll have to do that yourself using your own HTML5 knowledge. It's not hard, but it's complicated and it falls outside of the time limit I restricted myself to for this first version. Feel free to build your own and send a pull request if you want it sooner. Just remember to keep in line with the code policy outlined below. :)
* Basic browser mouse and keyboard scrolling controls are disabled on the canvas. You can right click and scroll outside of the canvas, but these default actions are disabled when hovering over the canvas! Likewise, the arrow keys and space bar will not scroll the page, period. Keep this in mind when choosing your camera size.
* Don't make rooms that are smaller than your camera! I haven't tested this, but I think it'll just make things display weird...
* Objects you create in rooms retain their properties after changing rooms! If you want objects to reset after changing rooms and returning, you'll need to manually set every property back to the value you want. To make things easier for you, you can use your `Room.DoLast()` function to do this when your room changes, but you'll need to specify each object's properties manually. Make sure you always Destroy unused objects or else they'll stick around in the Room for the whole game session.
* You'll want to need to have each separate direction as a separate animation set on your sprite sheet(s) in order to indicate direction. This is beacause inverting images in any direction (using scale) is outrageously inefficient on HTML5 canvas and is not friendly to video games.

Policy for Contribution
-------------

If you want to contribute to OversimplifiedJS's code to add/improve functionality or to include a module or something, then I absolutely welcome you to! All I ask is that you keep one thing in mind: Is it simple? The way I built OversimplifiedJS focuses on giving users options and simplicity: if you want to create an object in the current room, just call `object = CreateObject(//some prefab, x, y)` and it's there and ready to be used; if you want an object to do something, the code is `object.Do = function() {//thing to do here}` _(and I would have gone without the "`= function()` bit if JavaScript would have allowed me to)_. The point is that the code should be readable, understandable, and relatively easy to use. If your code can be described as such, then it will be welcomed with open arms!

Planned Additions
-------------

Things I'm planning to add to OversimplifiedJS at some point in the future include (in no particular order):
* `AddAnimation()` function for easily adding Animations to GameObjects after creation.
* Sound and Music classes
* Easy-access Settings adjustments
* Sample Modules
* Maybe scale the canvas and its contents if the window can't fit it.
* More I can't think of right now.

About
-------------

I'll put this section down at the bottom because I'm sure it's the least important to you. My name is Robbie Antenesse, and I manage [Alamantus GameDev](http://www.alamantus.com), a hobby game development studio with a focus on inclusivity and education (on top of developing games). Because I'm still learning myself, I tend to sporadically start new projects using new skills and techniques I've learned, which is a really bad business model when your goal is to make (and finish) games. At the time of this writing, I have completed one game ([DataFall](http://alamantus-gamedev.itch.io/datafall), which is playable online with the Unity Web Player) and am actively working on two others (_Petalina in Machine Land_, a 3-D collect-a-thon platformer in the spirit of Super Mario 64, Spyro the Dragon, and Croc, and _WarPhase_, a turn-based tactical board game where each player moves at the same time based on planned moves chosen for the player randomly from a deck), but I decided to make a game engine just to see if I could do it in one week. It turns out that I can! It's pretty basic and has lots of room for expansion, but that's what you get when you only give it one week. I went with "Oversimplified" as a name because I wanted to make it easy on both myself and whoever ends up using it.    
Anyway, I'll be updating and accepting updates from you all if you want to contribute at a pretty slow pace. My mindset is "It can certainly be improved, but it's done for now," so don't expect a reliable schedule of updates. I'll update it if I get the chance to come back to it.

License
-------------
I don't know. Probably a CC Share-Alike, NonCommercial license or something. If you use it, please let me know! I'd love to see what you can make with it. If you modify it or fork it or anything like that, also let me know so I can stay in the loop with what's happening to my code.    
Thanks!    
-Robbie Antenesse
