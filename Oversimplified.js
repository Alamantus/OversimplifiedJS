/*OversimplifiedJS
Author: Robbie Antenesse
Description: A lightweight, modular 2-D game engine for HTML5 canvas & JavaScript designed to try to make it as simple as possible to get your game made.
*/
var Oversimplified = {};
var OS = Oversimplified;    // Handy-dandy alias for shortening code.

// Engine variables
Oversimplified.canvas = null;
Oversimplified.context = null;
Oversimplified.nextID = 0;
Oversimplified.loadingScripts = [];
Oversimplified.emptyImage = new Image();
Oversimplified.emptyImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
Oversimplified.emptyImage.width = 1;
Oversimplified.emptyImage.height = 1;

// Settings Namespace
Oversimplified.Settings = {};
Oversimplified.Settings.defaultStep = 1/30;
Oversimplified.Settings.soundVolume = 0.75;
Oversimplified.Settings.musicVolume = 0.75;

/* Set up the camera.

It is important that this is done first at the time the game is loaded because this determines the size of the HTML5 canvas.
Be sure that the objectToFollow has already been created in the current room. Can be referenced with a variable.
objectToFollow, hBorder, and vBorder are optional arguments, but if you want to set hBorder and vBorder, there must be an objectToFollow.
*/
Oversimplified.Settings.SetCamera = function (width, height, objectToFollow, hBorder, vBorder) {
    hBorder = typeof hBorder !== 'undefined' ? hBorder : Oversimplified.camera.hBorder;
    vBorder = typeof vBorder !== 'undefined' ? vBorder : Oversimplified.camera.vBorder;
    
    if (typeof width !== 'undefined') {
        Oversimplified.camera.width = width;
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("You must specify a width in function Oversimplified.Settings.SetCamera()");
        return false;
    }
    if (typeof height !== 'undefined') {
        Oversimplified.camera.height = height;
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("You must specify a height in function Oversimplified.Settings.SetCamera()");
        return false;
    }
    
    if (typeof objectToFollow !== 'undefined') {
        if (objectToFollow.name) {
            Oversimplified.camera.Follow(objectToFollow);
        } else {
            if (Oversimplified.DEBUG.showMessages) console.log("Oversimplified.Settings.SetCamera()'s objectToFollow argument must be a Oversimplified.GameObject.");
        }
    }
    
    Oversimplified.camera.hBorder = hBorder;
    Oversimplified.camera.vBorder = vBorder;
    
    Oversimplified.SetCanvasToCameraSize();
}
// Convenient alias for Settings.
Oversimplified.S = Oversimplified.Settings;

// Time variables
Oversimplified.timestamp = function() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
Oversimplified.now = null;
Oversimplified.dateTime = 0;
Oversimplified.lastFrame = Oversimplified.timestamp();
Oversimplified.step = Oversimplified.Settings.defaultStep;     //seconds per frame

// Camera Object
Oversimplified.camera = {
    x: 0,
    y: 0,
    width: 640,
    height: 480,
    hBorder: 64,
    vBorder: 64,
    following: "",
    // Set the object for the camera to follow.
    Follow: function (object) {
        this.following = object.name;
    }
}

// Mouse Object
Oversimplified.mouse = {
    x: 0,
    y: 0,
    leftCode: IsInternetExplorer() ? 1 : 0,
    middleCode: IsInternetExplorer() ? 4 : 1,
    rightCode: 2,
    leftDown: false,
    left: false,
    leftUp: false,
    middleDown: false,
    middle: false,
    middleUp: false,
    rightDown: false,
    right: false,
    rightUp: false,
    wheel: 0
}

// Lists of Detected Keys
Oversimplified.heldKeys = [];
Oversimplified.pressedKeys = [];
Oversimplified.releasedKeys = [];

/* Key definitions

Get Key name based on keycode.
*/
Oversimplified.Key = {
    37: "left arrow",
    38: "up arrow",
    39: "right arrow",
    40: "down arrow",
    45: "insert",
    46: "delete",
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "caps lock",
    27: "escape",
    32: "space",
    33: "page up",
    34: "page down",
    35: "end",
    91: "left win/special key",
    92: "right win/special key",
    93: "select key",
    96: "numpad 0",
    97: "numpad 1",
    98: "numpad 2",
    99: "numpad 3",
    100: "numpad 4",
    101: "numpad 5",
    102: "numpad 6",
    103: "numpad 7",
    104: "numpad 8",
    105: "numpad 9",
    106: "numpad asterisk",
    107: "numpad plus",
    109: "numpad dash",
    110: "numpad period",
    111: "numpad slash",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    144: "num lock",
    145: "scroll lock",
    186: "semicolon",
    187: "equal",
    188: "comma",
    189: "dash",
    190: "period",
    191: "slash",
    192: "grave accent",
    219: "open bracket",
    220: "backslash",
    221: "close bracket",
    222: "quote"
};

// Get Keycode based on key name
Oversimplified.Keycode = {
    backspace:    8,
    tab:    9,
    enter:    13,
    shift:    16,
    ctrl:    17,
    alt:    18,
    pausebreak:    19,
    capslock:    20,
    escape:    27,
    space: 32,
    pageup:    33,
    pagedown:    34,
    end:    35,
    home:    36,
    left:    37,
    up:    38,
    right:    39,
    down:    40,
    insert:    45,
    del:    46,
    zero:    48,
    one:    49,
    two:    50,
    three:    51,
    four:    52,
    five:    53,
    six:    54,
    seven:    55,
    eight:    56,
    nine:    57,
    a:    65,
    b:    66,
    c:    67,
    d:    68,
    e:    69,
    f:    70,
    g:    71,
    h:    72,
    i:    73,
    j:    74,
    k:    75,
    l:    76,
    m:    77,
    n:    78,
    o:    79,
    p:    80,
    q:    81,
    r:    82,
    s:    83,
    t:    84,
    u:    85,
    v:    86,
    w:    87,
    x:    88,
    y:    89,
    z:    90,
    leftwinkey:    91,
    rightwinkey:    92,
    selectkey:    93,
    numpad_0:    96,
    numpad_1:    97,
    numpad_2:    98,
    numpad_3:    99,
    numpad_4:    100,
    numpad_5:    101,
    numpad_6:    102,
    numpad_7:    103,
    numpad_8:    104,
    numpad_9:    105,
    numpad_asterisk:    106,
    numpad_plus:    107,
    numpad_dash:    109,
    numpad_period:    110,
    numpad_slash:    111,
    f1:    112,
    f2:    113,
    f3:    114,
    f4:    115,
    f5:    116,
    f6:    117,
    f7:    118,
    f8:    119,
    f9:    120,
    f10:    121,
    f11:    122,
    f12:    123,
    numlock:    144,
    scrolllock:    145,
    semicolon:    186,
    equal:    187,
    comma:    188,
    dash:    189,
    period:    190,
    slash:    191,
    grave:    192,
    openbracket:    219,
    backslash:    220,
    closebraket:    221,
    quote:    222
}

// Controls Namespace
Oversimplified.Controls = {};
// Add a control to the collection of Controls.
Oversimplified.Controls.Add = function(name, positiveKeycode, negativeKeycode) {
    if (typeof negativeKeycode !== 'undefined') {
        Oversimplified.Controls[name] = new Oversimplified.Axis(positiveKeycode, negativeKeycode);
    } else {
        Oversimplified.Controls[name] = new Oversimplified.Control(positiveKeycode);
    }
    return Oversimplified.Controls[name];
};

// Alias for OS.Controls.Add()
Oversimplified.Controls.New = Oversimplified.Controls.Add;

// Checks each control every frame for presses/releases/holds
Oversimplified.Controls.CheckAll = function () {
    for (var control in Oversimplified.Controls) {
        if (typeof Oversimplified.Controls[control].Check !== 'undefined') {
            Oversimplified.Controls[control].Check();
        }
    }
};

// Convenient alias for Controls
Oversimplified.C = Oversimplified.Controls;

// Control Class
Oversimplified.Control = function (keycode) {
    var self = this;
    
    this.keyCode = keycode;
    this.keyName = Oversimplified.Key[keycode];
    
    this.down = false;
    this.held = false;
    this.up = false;
}
Oversimplified.Control.prototype.type = "Control";
Oversimplified.Control.prototype.Check = function () {
    if (Oversimplified.heldKeys.indexOf(this.keyCode) != -1) {
        this.held = true;
    } else {
        this.held = false;
    }
    if (Oversimplified.pressedKeys.indexOf(this.keyCode) != -1) {
        this.down = true;
    } else {
        this.down = false;
    }
    if (Oversimplified.releasedKeys.indexOf(this.keyCode) != -1) {
        this.up = true;
    } else {
        this.up = false;
    }
}

//Axis Class
Oversimplified.Axis = function (positiveKeycode, negativeKeycode) {
    //Keeps track of a direction, either -1, 0, or 1
    var self = this;
    
    this.positiveKeycode = positiveKeycode;
    this.positiveKeyName = Oversimplified.Key[positiveKeycode];
    this.negativeKeycode = negativeKeycode;
    this.negativeKeyName = Oversimplified.Key[negativeKeycode];
    
    this.direction = 0;
}
Oversimplified.Axis.prototype.type = "Axis";
Oversimplified.Axis.prototype.Check = function () {
    if (Oversimplified.heldKeys.indexOf(this.positiveKeycode) != -1
        && Oversimplified.heldKeys.indexOf(this.negativeKeycode) == -1)
    {
        this.direction = 1;
    }
    if (Oversimplified.heldKeys.indexOf(this.negativeKeycode) != -1
        && Oversimplified.heldKeys.indexOf(this.positiveKeycode) == -1)
    {
        this.direction = -1;
    }
    if ( (Oversimplified.heldKeys.indexOf(this.negativeKeycode) == -1      //If neither are held
        && Oversimplified.heldKeys.indexOf(this.positiveKeycode) == -1)
        || (Oversimplified.heldKeys.indexOf(this.negativeKeycode) != -1    //or both are held
        && Oversimplified.heldKeys.indexOf(this.positiveKeycode) != -1) )
    {
        this.direction = 0;
    }
}

//Rooms Namespace
Oversimplified.Rooms = {
    currentRoom: "Default",
    AllBeforeDo: function () {},
    AllDo: function () {},
    AllAfterDo: function () {}
}

// Add a Room to the collection of Rooms
Oversimplified.Rooms.Add = function (name, width, height, backgroundSrc, stepSpeed, extraParameters) {
    if (typeof Oversimplified.Rooms[name] === 'undefined') {
        Oversimplified.Rooms[name] = new Oversimplified.Room(name, width, height, backgroundSrc, stepSpeed, extraParameters);
        
        return Oversimplified.Rooms[name];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("A Room with the name \"" + name + "\" already exists!");
        return false;
    }
}

// Alias for Rooms.Add
Oversimplified.Rooms.New = Oversimplified.Rooms.Add;

// Convenient alias for Rooms
Oversimplified.R = Oversimplified.Rooms;

// Convenient way to access the objects within the current room.
Oversimplified.O = null;

/* Room Class

name (required) : The unique identifier of the room. Used to locate the room within the Rooms namespace.
width (optional) : The width of the room. The camera will not travel beyond this to the right. If it is larger than the camera's width and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's width, it will be set to the camera's width. -- default = Oversimplified.camera.width
height (optional) : The height of the room. The camera will not travel beyond this to the bottom. If it is larger than the camera's height and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's height, it will be set to the camera's height. -- default = Oversimplified.camera.height
backgroundSrc (optional) : The image that will be displayed as the room's background. If excluded or set to empty string (""), no background will show.
stepSpeed (optional) : The step speed for the Room. If excluded or set to 0, the default is used. -- default = Oversimplified.Settings.defaultStep
extraParameters (optional) : An array of extra parameters for the Room. Options include:

"background size" = sets the room size to whatever the backgroundSrc image size is, regardless of what is entered as width and height!

"#FF0000" (any hex color value) = sets the far background color (behind the background image, visible only if transparent or excluded). A JavaScript alternative to setting the HTML5 canvas's background color CSS.

"foreground.png" (path to any .png or .gif file) = sets the foreground image that displays over the background and all objects in the room. Appears below the Room's DrawAbove() function but above any GameObject's DrawAbove() function.
*/
Oversimplified.Room = function (name, width, height, backgroundSrc, stepSpeed, extraParameters) {
    this.id = Oversimplified.nextID++;
    var self = this;
    
    stepSpeed = (typeof stepSpeed !== 'undefined' && stepSpeed > 0) ? stepSpeed : Oversimplified.Settings.defaultStep;
    extraParameters = typeof extraParameters !== 'undefined' ? extraParameters : [];
    width = (typeof width !== 'undefined' && width >= Oversimplified.camera.width) ? width : Oversimplified.camera.width;
    height = (typeof height !== 'undefined' && height >= Oversimplified.camera.height) ? height : Oversimplified.camera.height;
    
    this.name = name;
    this.width = width;
    this.height = height;
    
    if (typeof backgroundSrc !== 'undefined' && backgroundSrc != "") {
        this.background = new Image();
        this.background.src = backgroundSrc;
    } else {
        // If backgroundSrc is excluded or an empty string, instead use Oversimplified.emptyImage instead.
        this.background = Oversimplified.emptyImage;
    }
    this.background.loaded = false;
    
    if (this.background != Oversimplified.emptyImage) {
        this.background.onload = function () {
            this.loaded = true;
            // If extraParameters contains "background size", then make room the size of the background image.
            if (extraParameters.indexOf("background size") != -1) {
                self.width = this.width;
                self.height = this.height;
            }
        }
    }
    
    
    this.stepSpeed = stepSpeed;
    
    this.objects = {};
    this.O = this.objects;
    
    if (extraParameters.length > 0) {
        for (var p = 0; p < extraParameters.length; p++) {
            switch (typeof extraParameters[p]) {
                case "string":
                    // If the parameter starts with #, then it is a background color hex.
                    if (extraParameters[p].substring(0,1) == "#") {
                        self.background.color = extraParameters[p];
                    } else {
                        var ext = extraParameters[p].substr(extraParameters[p].length - 4);
                        if (ext == ".png" || ext == ".gif") {   // If the string is a PNG or GIF, set it as foreground.
                            self.foreground = new Image();
                            self.foreground.loaded = false;
                            self.foreground.src = extraParameters[p];
                            self.foreground.onload = function () {this.loaded = true;}
                        }
                    }
                    break;
                // Can be expanded later.
                default:
                    break;
            }
        }
    }
    
    this.drawOrder = [];
    
    this.DoFirst = function () {};
    
    this.BeforeDo = function () {};
    this.Do = function () {};
    this.AfterDo = function () {};
    
    this.DoLast = function () {};
    
    this.DrawBelow = function () {};
    this.DrawAbove = function () {};
}
Oversimplified.Room.prototype.type = "Room";
Oversimplified.Room.prototype.Start = function () {
    this.DoFirst();
    
    if (this.name === Oversimplified.R.currentRoom) {
        for (var object in this.objects) {
            this.objects[object].Start();
        }
    }
}
Oversimplified.Room.prototype.Update = function () {
    if (Oversimplified.step != this.stepSpeed) {
        Oversimplified.step = this.stepSpeed;
    }
    
    this.drawOrder = [];        //Determine draw order every frame
    for (object in this.objects) {
        if (this.objects[object].type == 'GameObject') {
            if (this.drawOrder.length <= 0) {    //If this is the first object checked,
                this.drawOrder = [object];        //Add it to the array
                continue;        //And move to the next object without sorting
            }
            var depth = this.objects[object].depth;
            for (var i = 0; i < this.drawOrder.length; i++) {        //Loop through the objects already in array
                if (depth < this.objects[this.drawOrder[i]].depth) {    //if the object's depth is less than the object being checked,
                    this.drawOrder.splice(i, 0, object);    //insert the object before it in the array
                    break;                                    //and stop looking in the array
                }
            }
            if (this.drawOrder.indexOf(object) < 0) {        //if it gets through the loop and the depth is not less than any object,
                this.drawOrder.push(object);        //put it at the end
            }
        }
    }
    
    this.BeforeDo();
    
    this.Do();
    
    if (this.name === Oversimplified.R.currentRoom) {
        for (var object in this.objects) {
            this.objects[object].Update();
        }
    }
    
    this.AfterDo();
}
Oversimplified.Room.prototype.End = function () {
    this.DoLast();
}
Oversimplified.Room.prototype.Draw = function () {
    var self = this;
    //Always draw background first if there is one
    if (typeof this.background.color !== "undefined") {
        var tmp = Oversimplified.context.fillStyle;
        Oversimplified.context.fillStyle = this.background.color;
        Oversimplified.context.fillRect(0, 0, Oversimplified.camera.width, Oversimplified.camera.height);
        Oversimplified.context.fillStyle = tmp;
    }
    if (this.background.loaded) {
        Oversimplified.context.drawImage(self.background, Oversimplified.camera.x, Oversimplified.camera.y, (Oversimplified.camera.width <= self.background.width) ? Oversimplified.camera.width : self.background.width, (Oversimplified.camera.height <= self.background.height) ? Oversimplified.camera.height : self.background.height, 0, 0, self.background.width, self.background.height);
    }
    
    this.DrawBelow();    //Draw this before any objects are drawn
    
    if (this.name === Oversimplified.R.currentRoom) {
        for (var i = 0; i < this.drawOrder.length; i++) {
            if (typeof this.objects[this.drawOrder[i]] !== 'undefined') {
                this.objects[this.drawOrder[i]].Draw();
            }
        }
    }
    
    // If there is a foreground, draw it.
    if (typeof this.foreground !== "undefined") {
        if (this.foreground.loaded) {
            Oversimplified.context.drawImage(self.foreground, Oversimplified.camera.x, Oversimplified.camera.y, Oversimplified.camera.width, Oversimplified.camera.height, 0, 0, self.foreground.width, self.foreground.height);
        }
    }
    
    this.DrawAbove();    //Draw this after all other drawing is done
}

// Add a GameObject or PremadeObject to the room.
Oversimplified.Room.prototype.AddObject = function (newObjectName, x, y, imageSrc, maskImageSrc, animationsArray) {
    var self = this;
    
    if (newObjectName.type == "GameObject") {    //Create from prefabricated object
        var newID = Oversimplified.nextID++;
        var newName = newObjectName.name + newID.toString();
        self.objects[newName] = Oversimplified.CopyObject(newObjectName, newID, newName);
        
        return self.objects[newName];
    }
    else {
        if (self.objects[newObjectName]) {
            if (Oversimplified.DEBUG.showMessages) console.log("Object with name \"" + newObjectName + "\" already exists in current room!");
            return false;
        }
        self.objects[newObjectName] = new Oversimplified.GameObject(newObjectName, x, y, imageSrc, maskImageSrc, animationsArray);
        
        return self.objects[newObjectName];
    }
}

// Change to the specified room.
// Runs the current Room's End() function, changes the room, and runs the specified Room's Start() function.
Oversimplified.SetRoom = function (room) {
    if (typeof Oversimplified.R[Oversimplified.R.currentRoom] !== 'undefined') {
        Oversimplified.R[Oversimplified.R.currentRoom].End();
    }
    
    Oversimplified.R.currentRoom = room.name;
    Oversimplified.O = Oversimplified.Rooms[Oversimplified.R.currentRoom].objects;    //Update the Oversimplified.O alias when room changes
    Oversimplified.camera.following = "";
    
    Oversimplified.R[Oversimplified.R.currentRoom].Start();
}

// PremadeObjects (Prefab) Namespace
Oversimplified.PremadeObjects = {};

// Add a GameObject to the list of PremadeObjects.
Oversimplified.PremadeObjects.Add = function (name, x, y, imageSrc, maskImageSrc, animationsArray) {
    if (typeof Oversimplified.PremadeObjects[name] === 'undefined') {
        Oversimplified.PremadeObjects[name] = new Oversimplified.GameObject(name, x, y, imageSrc, maskImageSrc, animationsArray);
        return Oversimplified.PremadeObjects[name];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("A Premade Object with the name \"" + name + "\" already exists!");
        return false;
    }
}

// Alias for PremadeObjects.Add().
Oversimplified.PremadeObjects.New = Oversimplified.PremadeObjects.Add;

// Convenient aliases for PremadeObjects.
Oversimplified.Prefabs = Oversimplified.PremadeObjects;    // In case someone likes the technical "prefab" term better.
Oversimplified.P = Oversimplified.PremadeObjects;

// GameObject class
Oversimplified.GameObject = function (name, x, y, imageSrc, maskImageSrc, animationsArray) {
    this.id = Oversimplified.nextID++;
    
    var self = this;
    this.self = self;
    
    this.name = name;
    this.depth = 0;
    this.solid = false;
    this.persistent = false;
    
    this.x = typeof x !== 'undefined' ? x : -1;
    this.y = typeof y !== 'undefined' ? y : -1;
	this.xPrevious = this.x;
	this.yPrevious = this.y;
    this.screenX = this.x - Oversimplified.camera.x;
    this.screenY = this.y - Oversimplified.camera.y;
    
    if (typeof imageSrc !== 'undefined' && imageSrc != "") {
        this.image = new Image();
        this.image.src = imageSrc;
    } else {
        this.image = Oversimplified.emptyImage;
    }
    this.image.xScale = 1;
    this.image.yScale = 1;
    this.image.rotation = 0;
    
    this.image.animations = {};
    
    this.image.frameColumn = 0;
    this.image.frameRow = 0;
    
    if (typeof animationsArray !== 'undefined') {
        for (var i = 0; i < animationsArray.length; i++) {
            if (i == 0 && animationsArray[i].name != "Default") {
                this.image.animations["Default"] = animationsArray[i];    // Creates a duplicate animation of the first animation called "Default" in addition to the named animation below (unless the animation's name is "Default")
            }
            this.image.animations[animationsArray[i].name] = animationsArray[i];
        }
    } else {
        if (this.image != Oversimplified.emptyImage) {
            //If no animations array is included, then just show the whole image
            this.image.onload = function(){this.animations["Default"] = new Oversimplified.Animation("newAnimation", this.width, this.height)};    // Creates the default animation as the whole image once the image is loaded.
        } else {
            this.image.animations["Default"] = new Oversimplified.Animation("newAnimation", this.image.width, this.image.height)
        }
    }
    
    this.image.currentAnimation = "Default";
    
    this.mask = (maskImageSrc) ? new Image() : {};
    this.mask.src = (maskImageSrc) ? maskImageSrc : "";
    if (this.mask.src == "") {
        this.mask.width = this.image.animations["Default"].width;
        this.mask.height = this.image.animations["Default"].height;
    }
    
    if (this.mask.src != "") {
        this.mask.onload = function(){
            self.xBound = this.width / 2;
            self.yBound = this.height / 2;
        };
    } else {
        self.xBound = this.mask.width / 2;
        self.yBound = this.mask.height / 2;
    }
    
    this.DoFirst = function () {};
    
    this.BeforeDo = function () {};
    this.Do = function () {};
    this.AfterDo = function () {};
    
    this.DoLast = function () {};
    
    this.DrawBelow = function () {};
    this.DrawAbove = function () {};
}
Oversimplified.GameObject.prototype.type = "GameObject";
Oversimplified.GameObject.prototype.AddAnimation = function (animation, width, height, columns, rows, speed, xOffset, yOffset) {
    //Takes either an animation or the name of an animation in the Animations namespace and adds it to the object.
    if (animation.name) {
        this.image.animations[animation.name] = animation;
    } else {
        if (typeof Oversimplified.Animations[animation] === 'undefined') {
            Oversimplified.Animations.Add(animation, width, height, columns, rows, speed, xOffset, yOffset);
        }
        this.image.animations[Oversimplified.Animations[animation].name] = Oversimplified.Animations[animation];
    }
}
Oversimplified.GameObject.prototype.Draw = function () {
    this.DrawBelow();
    
    var self = this;
    var animation = self.image.currentAnimation;
    if (self.image.animations[animation]) {
        var animationWidth = self.image.animations[animation].width;
        var animationHeight = self.image.animations[animation].height;
        var width = self.image.animations[animation].width * self.image.xScale;
        var height = self.image.animations[animation].height * self.image.yScale;
        var columns = self.image.animations[animation].columns;
        var rows = self.image.animations[animation].rows;
        var xOffset = self.image.animations[animation].xOffset;
        var yOffset = self.image.animations[animation].yOffset;
        var animationSpeed = self.image.animations[animation].speed;
        
        if (self.image.frameColumn < columns) {
            self.image.frameColumn += animationSpeed;
        }
        if (self.image.frameColumn >= columns) {
            self.image.frameColumn = 0;
            self.image.frameRow++;
        }
        if (self.image.frameRow > rows - 1) {
            self.image.frameRow = 0;
        }
        
        if (Oversimplified.IsOnCamera(self)) {
            var adjustedColumn = Math.floor(self.image.frameColumn);
            var adjustedRow = Math.floor(self.image.frameRow);
            
            Oversimplified.context.translate(self.x - Oversimplified.camera.x, self.y - Oversimplified.camera.y);
            var angleInRadians = self.image.rotation * (Math.PI/180);
            Oversimplified.context.rotate(angleInRadians);
            Oversimplified.context.drawImage(self.image, (animationWidth * adjustedColumn) + xOffset, (animationHeight * adjustedRow) + yOffset, animationWidth, animationHeight, -(width / 2), -(height / 2), width, height);
            Oversimplified.context.rotate(-angleInRadians);
            Oversimplified.context.translate(-(self.x - Oversimplified.camera.x), -(self.y - Oversimplified.camera.y));
            
            Oversimplified.DEBUG.objectsOnScreen++;
        }
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("No animation at " + animation);
    }
    
    this.DrawAbove();
}
Oversimplified.GameObject.prototype.SetScale = function (xScale, yScale) {
    //Negative scale does not flip image.
    this.image.xScale = xScale;
    this.image.yScale = typeof yScale !== 'undefined' ? yScale : xScale;
    this.xBound = (this.mask.width / 2) * this.image.xScale;
    this.yBound = (this.mask.height / 2) * this.image.yScale;
}
Oversimplified.GameObject.prototype.SetImageRotation = function (rotation) {
    this.image.rotation = Math.clampAngle(rotation);
}
Oversimplified.GameObject.prototype.RotateImage = function (amount) {
    this.image.rotation += Math.clampAngle(amount);
}
Oversimplified.GameObject.prototype.SetAnimation = function (which) {
    if (which.name) {    //If you enter an actual animation instead of just its name,
        which = which.name;    //only use its name
    }
    this.image.currentAnimation = which;
    this.image.frameColumn = 0;
    this.image.frameRow = 0;
}
Oversimplified.GameObject.prototype.Start = function () {
    this.DoFirst();
}
Oversimplified.GameObject.prototype.Update = function () {
    this.screenX = this.x - Oversimplified.camera.x;
    this.screenY = this.y - Oversimplified.camera.y;
	this.xPrevious = this.x;
	this.yPrevious = this.y;
    
    this.BeforeDo();
    this.Do();
    this.AfterDo();
    
    //Make sure rotation is a valid angle before drawing
    this.image.rotation = Math.clampAngle(this.image.rotation);
}
Oversimplified.GameObject.prototype.End = function () {
    this.DoLast();
}

// Move toward the given point at the given speed.
// Imprecise and only moves at 90° and 45° angles, but gets the job done.
Oversimplified.GameObject.prototype.MoveTo = function (x, y, speed) {
    speed = typeof speed !== 'undefined' ? speed : 1;
    if (this.x < x) {
        this.x += speed;
    }
    if (this.x > x) {
        this.x -= speed;
    }
    if (this.y < y) {
        this.y += speed;
    }
    if (this.y > y) {
        this.y -= speed;
    }
}

// Check if the given point is within the object's bounds.
Oversimplified.GameObject.prototype.PointOverlaps = function (x, y) {
    if (x > this.x - this.xBound
        && x < this.x + this.xBound
        && y > this.y - this.yBound
        && y < this.y + this.yBound)
    {
        return true;
    } else {
        return false;
    }
}

// Check if object is overlapping any other object in the room
//
// Accepts true, false, or no value.
Oversimplified.GameObject.prototype.IsOverlapping = function (doSimple) {
    doSimple = (typeof doSimple !== 'undefined') ? doSimple : false;
    
    for (var obj in Oversimplified.O) {
        var object = Oversimplified.O[obj];
        if (object != this) {
            // If doSimple is false or not set, then scan all pixels in object boundaries.
            if (!doSimple)
            {
                for (var i = 0; i < 2 * object.xBound; i++) {
                    for (var j = 0; j < 2 * object.yBound; j++) {
                        var xToCheck = (object.x - object.xBound) + i;
                        var yToCheck = (object.y - object.yBound) + j;
                        
                        if (xToCheck > this.x - this.xBound &&
                            xToCheck < this.x + this.xBound &&
                            yToCheck > this.y - this.yBound &&
                            yToCheck < this.y + this.yBound)
                        {    //Check if the point lies inside the bounds of ANY object in the room.
                            return object;
                        }
                    }
                }
            }
            // If doSimple is true, only check the corner pixels and center pixels of object bounds. This makes for much faster checking.
            else
            {
                if (object.PointOverlaps(this.x - this.xBound, this.y - this.yBound) ||
                    object.PointOverlaps(this.x + this.xBound, this.y - this.yBound) ||
                    object.PointOverlaps(this.x - this.xBound, this.y + this.yBound) ||
                    object.PointOverlaps(this.x + this.xBound, this.y + this.yBound) ||
                    object.PointOverlaps(this.x - this.xBound, this.y) ||
                    object.PointOverlaps(this.x + this.xBound, this.y) ||
                    object.PointOverlaps(this.x, this.y - this.yBound) ||
                    object.PointOverlaps(this.x, this.y + this.yBound))
                {
                    return object;
                }
            }
        }
    }
    
    return false;
}

// Move the object away from any overlapping objects.
//
// Accepts true, false, or no value.
Oversimplified.GameObject.prototype.IfOverlappingThenMove = function (doSimple) {
	var overlappingObject = this.IsOverlapping(doSimple);
	
	if (overlappingObject != false)
	{
		if (this.x < overlappingObject.x)
		this.x--;
		if (this.x >= overlappingObject.x)
			this.x++;
		if (this.y < overlappingObject.y)
			this.y--;
		if (this.y >= overlappingObject.y)
			this.y++;
	}
}

// Prevents the object from moving outside of the room's boundaries.
Oversimplified.GameObject.prototype.KeepInsideRoom = function () {
    var currentRoom = Oversimplified.R[Oversimplified.R.currentRoom]
	if (this.x < this.xBound || this.x > currentRoom.width - this.xBound)
    {
        this.x = this.xPrevious;
    }
    if (this.y < this.yBound || this.y > currentRoom.height - this.yBound)
    {
        this.y = this.yPrevious;
    }
}

// Returns true if the mouse is within the object's bounding box.
Oversimplified.GameObject.prototype.MouseIsOver = function () {
    if (this.PointOverlaps(Oversimplified.mouse.x, Oversimplified.mouse.y))
    {
        return true;
    } else {
        return false;
    }
}


// Returns true if the object is clicked with the given mouse click, eg. Oversimplified.mouse.leftDown, Oversimplified.mouse.rightUp, etc.
//
// If no click is specified, it defaults to left down
Oversimplified.GameObject.prototype.Clicked = function (mouseClick) {
    mouseClick = typeof mouseClick !== 'undefined' ? mouseClick : Oversimplified.mouse.leftDown;
    if (this.MouseIsOver() && mouseClick)
    {
        return true;
    } else {
        return false;
    }
}

// Move the object based upon xSpeed and ySpeed, stopping if colliding with solid objects
//
// xSpeed and ySpeed are numbers, and checkCollisions is true or false.
Oversimplified.GameObject.prototype.SimpleMove = function (xSpeed, ySpeed, checkCollisions) {
    var collisionLeft = false,
        collisionRight = false,
        collisionUp = false,
        collisionDown = false;
    if (checkCollisions) {
        for (var vert = 0; vert < this.yBound * 2; vert++) {
            var yToCheck = (this.y - this.yBound + vert);
            if (!collisionLeft) {
                collisionLeft = xSpeed < 0 && Oversimplified.CollisionAtPoint((this.x - this.xBound) + xSpeed, yToCheck);
            }
            if (!collisionRight) {
                collisionRight = xSpeed > 0 && Oversimplified.CollisionAtPoint((this.x + this.xBound) + xSpeed, yToCheck);
            }
        }
        for (var hor = 0; hor < this.xBound * 2; hor++) {
            var xToCheck = (this.x - this.xBound + hor);
            if (!collisionUp) {
                collisionUp = ySpeed < 0 && Oversimplified.CollisionAtPoint(xToCheck, (this.y - this.yBound) + ySpeed);
            }
            if (!collisionDown) {
                collisionDown = ySpeed > 0 && Oversimplified.CollisionAtPoint(xToCheck, (this.y + this.yBound) + ySpeed);
            }
        }
    }
    if (!checkCollisions || (!collisionLeft && !collisionRight && !collisionUp && !collisionDown)) {
        this.x += xSpeed;
        this.y += ySpeed;
    }
}

// Removes the specified object from memory.
Oversimplified.GameObject.prototype.Destroy = function () {
    this.End();
    delete Oversimplified.R[Oversimplified.R.currentRoom].objects[this.name];
}

// Check if the point (x, y) lies inside the bounds of ANY object in the room.
// If yes and if that object is flagged as solid, then there is a collision.
Oversimplified.CollisionAtPoint = function (x, y) {
    var currentRoom = Oversimplified.R[Oversimplified.R.currentRoom];
    
    for (var obj in Oversimplified.O) {
        var object = Oversimplified.O[obj];
        if (object != this) {
            for (var i = 0; i < 2 * object.xBound; i++) {
                for (var j = 0; j < 2 * object.yBound; j++) {
                    var xToCheck = (object.x - object.xBound) + i;
                    var yToCheck = (object.y - object.yBound) + j;
                    
                    if (xToCheck == x && yToCheck == y)
                    {
                        if (object.solid) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    
    return false;
}

// Animations Namespace
Oversimplified.Animations = {};
Oversimplified.Animations.Add = function (name, width, height, columns, rows, speed, xOffset, yOffset) {
    if (typeof Oversimplified.Animations[name] === 'undefined') {
        Oversimplified.Animations[name] = new Oversimplified.Animation(name, width, height, columns, rows, speed, xOffset, yOffset);
        return Oversimplified.Animations[name];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("An animation with the name \"" + name + "\" already exists!");
        return false;
    }
};
Oversimplified.Animations.New = Oversimplified.Animations.Add;
Oversimplified.A = Oversimplified.Animations;

// Animation class (for use with sprite sheets)
//
// Prevents animation mess-ups by preventing speeds higher than one with Math.clamp01.
Oversimplified.Animation = function (name, width, height, columns, rows, speed, xOffset, yOffset) {
    this.id = Oversimplified.nextID++;
    
    columns = typeof columns !== 'undefined' ? columns : 1;
    rows = typeof rows !== 'undefined' ? rows : 1;
    speed = typeof speed !== 'undefined' ? speed : 1;
    xOffset = typeof xOffset !== 'undefined' ? xOffset : 0;
    yOffset = typeof yOffset !== 'undefined' ? yOffset : 0;
    
    speed = Math.clamp01(speed);
    
    this.name = name;
    this.width = width;
    this.height = height;
    this.columns = columns;
    this.rows = rows;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.speed = speed;
}
Oversimplified.Animation.prototype.type = "Animation";

Oversimplified.Effects = {
    Sounds: [],
    Tunes: [],
}

Oversimplified.Effects.Tunes.CheckLoops = function () {
    for (var tune in Oversimplified.Effects.Tunes) {
        if (Oversimplified.Effects.Tunes[tune].type == "Tune" && Oversimplified.Effects.Tunes[tune].IsPlaying()) {
            Oversimplified.Effects.Tunes[tune].CheckLoop();
        }
    }
}

/*  Sound Class
    
    Plays a sound effect once.    
    Preferably source should be a .wav file and secondarySource should be a .mp3 file.
*/
Oversimplified.Sound = function (name, source, secondarySource) {
    this.id = Oversimplified.nextID++;
    
    secondarySource = typeof secondarySource !== 'undefined' ? secondarySource : false;
    
    this.name = name;
    this.source = source;
    this.secondarySource = secondarySource;
    
    this.audioElement = document.createElement("audio");
    this.audioElement.id = this.name + this.id.toString();
    
    var audioSource = document.createElement("source");
    audioSource.src = this.source;
    this.audioElement.appendChild(audioSource);
    
    if (this.secondarySource != false) {
        audioSource.src = this.secondarySource;
        this.audioElement.appendChild(audioSource);
    }
    
    document.getElementById("audio").appendChild(this.audioElement);
    this.audioElement.load();
}
Oversimplified.Sound.prototype.type = "Sound";

Oversimplified.Sound.prototype.Play = function () {
    this.element.currentTime = 0;
    this.element.volume = Oversimplified.Settings.soundVolume;
    this.element.play();
}
Oversimplified.Sound.prototype.IsPlaying = function () {
    return !this.element.paused && !this.element.ended && 0 < this.element.currentTime;
}

/*  Tune Class
    
    Preferably source should be a .mp3 file and secondarySource should be a .ogg file.    
    If duration is specified, loop when duration is reached.
*/
Oversimplified.Tune = function (name, source, secondarySource, duration) {
    this.id = Oversimplified.nextID++;
    
    secondarySource = typeof secondarySource !== 'undefined' ? secondarySource : false;
    duration = typeof duration !== 'undefined' ? duration : false;
    
    this.name = name;
    this.source = source;
    this.secondarySource = secondarySource;
    this.duration = duration;
    
    this.audioElement = document.createElement("audio");
    this.audioElement.id = this.name + this.id.toString();
    
    var audioSource = document.createElement("source");
    audioSource.src = this.source;
    this.audioElement.appendChild(audioSource);
    
    if (this.secondarySource != false) {
        audioSource.src = this.secondarySource;
        this.audioElement.appendChild(audioSource);
    }
    
    document.getElementById("audio").appendChild(this.audioElement);
    this.audioElement.load();
}
Oversimplified.Tune.prototype.type = "Tune";

Oversimplified.Tune.prototype.Play = function () {
    this.element.currentTime = 0;
    this.element.volume = Oversimplified.Settings.musicVolume;
    this.element.loop = true;
    this.element.play();
}
Oversimplified.Tune.prototype.CheckLoop = function () {
    if (this.duration < this.element.duration) {
        if (this.element.currentTime > this.duration) {
            this.element.currentTime = 0;
        }
    }
}
Oversimplified.Tune.prototype.IsPlaying = function () {
    return !this.element.paused && !this.element.ended && 0 < this.element.currentTime;
}

// Aliases for Sounds and Tunes
Oversimplified.Effects.S = Oversimplified.Effects.Sounds;
Oversimplified.Effects.T = Oversimplified.Effects.Tunes;

// Alias for "Tunes" in case it's too hard to remember.
Oversimplified.Effects.Music = Oversimplified.Effects.Tunes;
Oversimplified.Effects.M = Oversimplified.Effects.Tunes;

// Alias for Effects
Oversimplified.E = Oversimplified.Effects;

// Create a new GameObject inside the current Room and return it.
Oversimplified.CreateObject = function (newObjectName, x, y, imageSrc, maskImageSrc, animationsArray) {
    if (newObjectName.type == "GameObject") {    //Create from prefabricated object
        var newID = Oversimplified.nextID++;
        var newName = newObjectName.name + newID.toString();
        Oversimplified.O[newName] = Oversimplified.CopyObject(newObjectName, newID, newName);
        
        Oversimplified.O[newName].x = x;
        Oversimplified.O[newName].y = y;
        
        return Oversimplified.O[newName];
    }
    else {
        if (Oversimplified.O[newObjectName]) {
            if (Oversimplified.DEBUG.showMessages) console.log("Object with name \"" + newObjectName + "\" already exists in current room!");
            return false;
        }
        Oversimplified.O[newObjectName] = new Oversimplified.GameObject(newObjectName, x, y, imageSrc, maskImageSrc, animationsArray);
    }
    
    Oversimplified.O[newObjectName].Start();
    
    return Oversimplified.O[newObjectName];
}

/* Copy a GameObject

newID and newName are optional. If excluded, they are auto-populated with the next id value and the original object's name.
Use "identical" to copy name and id of original object.
*/
Oversimplified.CopyObject = function (object, newID, newName) {
    var resultingCopy = {};
    if (newID != "identical") {
        resultingCopy.id = typeof newID !== 'undefined' ? newID : Oversimplified.nextID++;
        resultingCopy.name = typeof newName !== 'undefined' ? newName : object.name + resultingCopy.id.toString();
    } else {    //If second argument is "identical" with quotes, then copy id and name, too.
        resultingCopy.id = object.id;
        resultingCopy.name = object.name;
    }
    //Copy Oversimplified.GameObject-unique properties
    if (object.type == 'GameObject') {
        resultingCopy.self = resultingCopy;
        resultingCopy.image = new Image();
        resultingCopy.image.src = object.image.src;
        resultingCopy.image.xScale = object.image.xScale;
        resultingCopy.image.yScale = object.image.yScale;
        resultingCopy.image.rotation = object.image.rotation;
        resultingCopy.image.frameColumn = 0;
        resultingCopy.image.frameRow = 0;
        resultingCopy.image.animations = object.image.animations;
        resultingCopy.image.currentAnimation = object.image.currentAnimation;
        resultingCopy.mask = new Image();
        resultingCopy.mask.src = object.mask.src;
        if (resultingCopy.mask.src == "") {
            resultingCopy.mask.width = resultingCopy.image.animations["Default"].width;
            resultingCopy.mask.height = resultingCopy.image.animations["Default"].height;
        }
        resultingCopy.mask.onload = function(){
            resultingCopy.xBound = this.width / 2;
            resultingCopy.yBound = this.height / 2;
        };
    }
    for (var property in object) {
        if (typeof resultingCopy[property] === 'undefined') {
            resultingCopy[property] = object[property];
        }
    }
    
    return resultingCopy;
}

/* Copy any class (needs expanding)

newID and newName are optional. If excluded, they are auto-populated with the next id value and the original object's name.
Use "identical" to copy the id and name of the original object.
*/
Oversimplified.Copy = function (object, newID, newName) {
    var resultingCopy = {};
    if (newID != "identical") {
        resultingCopy.id = typeof newID !== 'undefined' ? newID : Oversimplified.nextID++;
        resultingCopy.name = typeof newName !== 'undefined' ? newName : object.name + resultingCopy.id.toString();
    } else {    //If second argument is "identical" with quotes, then copy id and name, too.
        resultingCopy.id = object.id;
        resultingCopy.name = object.name;
    }
    //Copy Oversimplified.GameObject-unique properties
    if (object.type == 'GameObject') {
        resultingCopy = Oversimplified.CopyObject(object, newID, newName);
    }
    if (object.type == 'Room') {
        /* resultingCopy.background = new Image();
        resultingCopy.background.loaded = false;
        resultingCopy.background.src = object.background.src;
        resultingCopy.background.onload = function () {
                resultingCopy.loaded = true;
            } */
        resultingCopy.objects = {};
        for (var subObject in object.objects) {
            resultingCopy.objects[subObject] = Oversimplified.Copy(object.objects[subObject]);
        }
    }
    for (var property in object) {
        if (typeof resultingCopy[property] === 'undefined') {
            resultingCopy[property] = object[property];
        }
    }
    
    return resultingCopy;
}

// DEBUG object
Oversimplified.DEBUG = {
    // Show console.log messages.
    showMessages: true,
    
    // Draw a magenta bounding box around the specified object representing the object's collision extents.
    DrawBoundingBox: function (object) {
        var fillStyle = Oversimplified.context.fillStyle;
        Oversimplified.context.fillStyle = "rgba(255, 0, 255, 0.5)";
        Oversimplified.context.fillRect(object.x - object.xBound - Oversimplified.camera.x, object.y - object.yBound - Oversimplified.camera.y, object.xBound * 2, object.yBound * 2);
        Oversimplified.context.fillStyle = fillStyle;
    },
    
    // Return the number of objects currently in the room.
    CountObjectsInRoom: function (roomName) {
        var roomInQuestion;
        var count = 0;
        if (typeof roomName !== 'undefined') {
            if (roomName.name) {
                roomInQuestion = roomName;
            } else {
                roomInQuestion = Oversimplified.Rooms[roomName];
            }
        } else {
            roomInQuestion = Oversimplified.Rooms[Oversimplified.R.currentRoom];
        }
        for (var objects in roomInQuestion.objects) {
            count++;
        }
        return count;
    },
    
    objectsOnScreen: 0,
    
    // Return the number of objects currently being drawn on the canvas.
    CountObjectsOnScreen: function () {return Oversimplified.DEBUG.objectsOnScreen;},
    
    // List all current controls to the console.
    ListControls: function () {
        var numControls = 0;
        var numAxes = 0;
        var total = 0;
        
        for (var control in Oversimplified.Controls) {
            if (typeof Oversimplified.Controls[control].Check !== 'undefined') {   //Only return values in Control that have Check(), i.e. controls & axes
                total++;
                var message = "Oversimplified.C[\"" + control + "\"] "
                
                if (Oversimplified.Controls[control].type == "Control") {
                    message += "(Control): " + Oversimplified.C[control].keyName;
                    numControls++;
                }
                if (Oversimplified.Controls[control].type == "Axis") {
                    message += "(Axis) Positive: " + Oversimplified.C[control].positiveKeyName + ", Negative: " + Oversimplified.C[control].negativeKeyName;
                    numAxes++;
                }
                
                console.log(message);
            }
        }
        
        console.log(numControls + " Controls and " + numAxes + " Axes.\n" + total + " in all");
    },
};

/* window.onload call

If there is another place that sets window.onload, then Oversimplified.Initialize() will need to be manually called!
*/
window.onload = function () {Oversimplified.Initialize();};

// Set up important engine pieces.
Oversimplified.Initialize = function () {
    Oversimplified.SetupCanvas();
    
    Oversimplified.SetupControls();
    
    Oversimplified.AddScript("start.js", function(){
        start();
        Oversimplified.SetCanvasToCameraSize();
        Oversimplified.Frame();    //Only run the first frame after Start has been loaded.
    });
}

Oversimplified.SetupCanvas = function () {
    Oversimplified.canvas = document.getElementById("game");
    if (Oversimplified.canvas.getContext) {
        Oversimplified.context = Oversimplified.canvas.getContext("2d");
    } else {
        alert("No 2D Canvas Context for game.");
    }
    
    //Disable right click menu on canvas
    Oversimplified.canvas.oncontextmenu = function() {return false;};
}

Oversimplified.SetupControls = function () {
    Oversimplified.SetupMouseListeners();
    Oversimplified.SetupKeyboardListeners();
}

Oversimplified.SetupMouseListeners = function () {
    Oversimplified.canvas.addEventListener('mousemove', function (e) {
            var rect = Oversimplified.canvas.getBoundingClientRect();
            Oversimplified.mouse.x = (e.clientX - rect.left) + Oversimplified.camera.x;
            Oversimplified.mouse.y = (e.clientY - rect.top) + Oversimplified.camera.y;
        }, false);
    Oversimplified.canvas.addEventListener('mousedown', function (e){
            if (e.button === Oversimplified.mouse.leftCode){
                if (!Oversimplified.mouse.left) Oversimplified.mouse.leftDown = true;
                Oversimplified.mouse.left = true;
            }
            else if (e.button === Oversimplified.mouse.middleCode) {
                e.preventDefault(); //Prevent browser from using the scroll wheel.
                
                if (!Oversimplified.mouse.middle) Oversimplified.mouse.middleDown = true;
                Oversimplified.mouse.middle = true;
            }
            else if (e.button === Oversimplified.mouse.rightCode){
                if (!Oversimplified.mouse.right) Oversimplified.mouse.rightDown = true;
                Oversimplified.mouse.right = true;
            }
        }, false);
    Oversimplified.canvas.addEventListener('mouseup', function (e){
            if (e.button === Oversimplified.mouse.leftCode){
                Oversimplified.mouse.left = false;
                Oversimplified.mouse.leftUp = true;
            }
            else if (e.button === Oversimplified.mouse.middleCode) {
                Oversimplified.mouse.middle = false;
                Oversimplified.mouse.middleUp = true;
            }
            else if (e.button === Oversimplified.mouse.rightCode){
                Oversimplified.mouse.right = false;
                Oversimplified.mouse.rightUp = true;
            }
        }, false);
    // if mouse leaves the canvas, left, middle, and right click are unset.
    Oversimplified.canvas.addEventListener('mouseout', function () {
            Oversimplified.mouse.left = Oversimplified.mouse.middle = Oversimplified.mouse.right = false;
        }, false);
    
    //mouse wheel functionality
    Oversimplified.canvas.addEventListener("mousewheel", Oversimplified.MouseWheelHandler, false);
    Oversimplified.canvas.addEventListener("DOMMouseScroll", Oversimplified.MouseWheelHandler, false); //for (old?) Firefox
    
    //Touch Mouse Emulation
    Oversimplified.canvas.addEventListener("touchstart", function(e) {
            e.preventDefault();
            switch (e.targetTouches.length) {
            case 1:
                Oversimplified.mouse.right = false;
                Oversimplified.mouse.middle = false;
                if (!Oversimplified.mouse.left) Oversimplified.mouse.leftDown = true;
                Oversimplified.mouse.left = true;
                break;
            case 2:
                Oversimplified.mouse.left = false;
                Oversimplified.mouse.middle = false;
                if (!Oversimplified.mouse.right) Oversimplified.mouse.rightDown = true;
                Oversimplified.mouse.right = true;
                break;
            case 3:
                Oversimplified.mouse.left = false;
                Oversimplified.mouse.right = false;
                if (!Oversimplified.mouse.middle) Oversimplified.mouse.middleDown = true;
                Oversimplified.mouse.middle = true;
                break;
            default:
                break;
            }
            var rect = Oversimplified.canvas.getBoundingClientRect();
            //Takes mouse position as First touch
            Oversimplified.mouse.x = (e.targetTouches[0].clientX - rect.left) + Oversimplified.camera.x;
            Oversimplified.mouse.y = (e.targetTouches[0].clientY - rect.top) + Oversimplified.camera.y;
        }, false);
    Oversimplified.canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var rect = Oversimplified.canvas.getBoundingClientRect();
            Oversimplified.mouse.x = (e.targetTouches[0].clientX - rect.left) + Oversimplified.camera.x;
            Oversimplified.mouse.y = (e.targetTouches[0].clientY - rect.top) + Oversimplified.camera.y;
        }, false);
    window.addEventListener('touchend', function (e) {
            //Does not record last position
            if (e.targetTouches.length < 1) {
                if (Oversimplified.mouse.left) Oversimplified.mouse.leftUp = true;
                Oversimplified.mouse.left = false;
                Oversimplified.mouse.right = false;
                Oversimplified.mouse.middle = false;
            } else if (e.targetTouches.length < 2) {
                if (Oversimplified.mouse.right) Oversimplified.mouse.rightUp = true;
                Oversimplified.mouse.right = false;
                Oversimplified.mouse.middle = false;
            } else if (e.targetTouches.length < 3) {
                if (Oversimplified.mouse.middle) Oversimplified.mouse.middleUp = true;
                Oversimplified.mouse.middle = false;
            }
        }, false);
}

Oversimplified.SetupKeyboardListeners = function () {
    //Prevent scrolling with keys
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if([Oversimplified.Keycode.left, Oversimplified.Keycode.right, Oversimplified.Keycode.up, Oversimplified.Keycode.down, Oversimplified.Keycode.space, Oversimplified.Keycode.tab].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    
    document.addEventListener("keydown", function(e) {
        var thisKey = e.which;
        if (Oversimplified.pressedKeys.indexOf(thisKey) == -1 && Oversimplified.heldKeys.indexOf(thisKey) == -1) {
            Oversimplified.pressedKeys.push(thisKey);
        }
        if (Oversimplified.heldKeys.indexOf(thisKey) == -1) {
            Oversimplified.heldKeys.push(thisKey);
        }
    }, false);
    document.addEventListener("keyup", function(e) {
        var thisKey = e.which;
        Oversimplified.heldKeys.splice(Oversimplified.heldKeys.indexOf(thisKey), 1);
        if (Oversimplified.releasedKeys.indexOf(thisKey) == -1) {
            Oversimplified.releasedKeys.push(thisKey);
        }
    }, false);
}

Oversimplified.SetCanvasToCameraSize = function () {
    if (Oversimplified.canvas.width != Oversimplified.camera.width) {
        if (Oversimplified.DEBUG.showMessages) console.log("Adjusting Camera Width from " + Oversimplified.canvas.width + " to " + Oversimplified.camera.width);
        
        Oversimplified.canvas.width = Oversimplified.camera.width;
    }
    if (Oversimplified.canvas.height != Oversimplified.camera.height) {
        if (Oversimplified.DEBUG.showMessages) console.log("Adjusting Camera Height from " + Oversimplified.canvas.height + " to " + Oversimplified.camera.height);
        
        Oversimplified.canvas.height = Oversimplified.camera.height;
    }
}

// Defines the order of operations for the Frame.
Oversimplified.Frame = function () {
    if (Oversimplified.loadingScripts.length == 0) {
        Oversimplified.now = Oversimplified.timestamp();
        Oversimplified.dateTime = Oversimplified.dateTime + Math.min(1, (Oversimplified.now - Oversimplified.lastFrame) / 1000);
        while (Oversimplified.dateTime > Oversimplified.step) {
            Oversimplified.dateTime = Oversimplified.dateTime - Oversimplified.step;
            Oversimplified.Update();
            Oversimplified.Draw();
            Oversimplified.EndFrame();
        }
        Oversimplified.lastFrame = Oversimplified.now;
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("Loading scripts: " + Oversimplified.loadingScripts.toString());
    }
    
    requestAnimationFrame(Oversimplified.Frame);
}

// Mechanical/action-based/calculation functions
Oversimplified.Update = function () {
    Oversimplified.Controls.CheckAll();
    
    Oversimplified.Rooms.AllBeforeDo();
    Oversimplified.Rooms.AllDo();
    if (typeof Oversimplified.Rooms[Oversimplified.Rooms.currentRoom] !== 'undefined') {
        Oversimplified.Rooms[Oversimplified.Rooms.currentRoom].Update();
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("There is no current room. Please add one or make sure you are referencing the correct room with Oversimplified.Rooms.SetRoom().");
    }
    
    Oversimplified.Rooms.AllAfterDo();
    
    if (Oversimplified.camera.following != "") {    //If the camera is following an object, keep the object within its borders.
        if (Oversimplified.R[Oversimplified.R.currentRoom].objects[Oversimplified.camera.following].x - Oversimplified.camera.x > Oversimplified.camera.width - Oversimplified.camera.hBorder) {
            Oversimplified.camera.x = Oversimplified.R[Oversimplified.R.currentRoom].objects[Oversimplified.camera.following].x - (Oversimplified.camera.width - Oversimplified.camera.hBorder);
        }
        if (Oversimplified.R[Oversimplified.R.currentRoom].objects[Oversimplified.camera.following].x - Oversimplified.camera.x < Oversimplified.camera.hBorder) {
            Oversimplified.camera.x = Oversimplified.R[Oversimplified.R.currentRoom].objects[Oversimplified.camera.following].x - Oversimplified.camera.hBorder;
        }
        if (Oversimplified.R[Oversimplified.R.currentRoom].objects[Oversimplified.camera.following].y - Oversimplified.camera.y > Oversimplified.camera.height - Oversimplified.camera.vBorder) {
            Oversimplified.camera.y = Oversimplified.R[Oversimplified.R.currentRoom].objects[Oversimplified.camera.following].y - (Oversimplified.camera.height - Oversimplified.camera.vBorder);
        }
        if (Oversimplified.R[Oversimplified.R.currentRoom].objects[Oversimplified.camera.following].y - Oversimplified.camera.y < Oversimplified.camera.vBorder) {
            Oversimplified.camera.y = Oversimplified.R[Oversimplified.R.currentRoom].objects[Oversimplified.camera.following].y - Oversimplified.camera.vBorder;
        }
    }
    
    // Don't let camera move past room boundaries.
    if (Oversimplified.camera.x < 0) {
        Oversimplified.camera.x = 0;
    }
    if (Oversimplified.camera.x + Oversimplified.camera.width > Oversimplified.R[Oversimplified.R.currentRoom].width) {
        Oversimplified.camera.x = Oversimplified.R[Oversimplified.R.currentRoom].width - Oversimplified.camera.width;
    }
    if (Oversimplified.camera.y < 0) {
        Oversimplified.camera.y = 0;
    }
    if (Oversimplified.camera.y + Oversimplified.camera.height > Oversimplified.R[Oversimplified.R.currentRoom].height) {
        Oversimplified.camera.y = Oversimplified.R[Oversimplified.R.currentRoom].height - Oversimplified.camera.height;
    }
}

// Drawing functions
Oversimplified.Draw = function () {
    Oversimplified.context.clearRect(0, 0, Oversimplified.canvas.width, Oversimplified.canvas.height);
    Oversimplified.DEBUG.objectsOnScreen = 0;
    
    if (typeof Oversimplified.Rooms[Oversimplified.Rooms.currentRoom] !== 'undefined') {
        Oversimplified.Rooms[Oversimplified.Rooms.currentRoom].Draw();
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("There is no current room. Please add one or make sure you are referencing the correct room with Oversimplified.Rooms.SetRoom().");
    }
}

// Anything left over/resetting the mouse and keys.
Oversimplified.EndFrame = function () {
    Oversimplified.mouse.wheel = 0;
    
    Oversimplified.mouse.leftDown = false;
    Oversimplified.mouse.middleDown = false;
    Oversimplified.mouse.rightDown = false;
    Oversimplified.mouse.leftUp = false;
    Oversimplified.mouse.middleUp = false;
    Oversimplified.mouse.rightUp = false;
    Oversimplified.pressedKeys = [];
    Oversimplified.releasedKeys = [];
    
    
}

// Prevent scrolling page when scrolling inside canvas.
Oversimplified.MouseWheelHandler = function (e) {
    e.preventDefault();
    
    Oversimplified.mouse.wheel = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));    //reverse Firefoxs detail value and return either 1 for up or -1 for down
}

// Check if the defined point (x, y) is currently visible on the canvas.
Oversimplified.IsOnCamera = function (x, y) {
    if (typeof y !== 'undefined') {    //If both are defined, then they are a point.
        if (x > Oversimplified.camera.x && x < Oversimplified.camera.x + Oversimplified.camera.width
            && y > Oversimplified.camera.y && y < Oversimplified.camera.y + Oversimplified.camera.height)
        {
            return true;
        } else {
            return false;
        }
    } else {        // if only one is defined, then it is an object
        var obj = x;
        if (obj.x + obj.xBound > Oversimplified.camera.x && obj.x - obj.xBound < Oversimplified.camera.x + Oversimplified.camera.width
            && obj.y + obj.yBound > Oversimplified.camera.y && obj.y - obj.yBound < Oversimplified.camera.y + Oversimplified.camera.height)
        {
            return true;
        } else {
            return false;
        }
    }
        
}

/* Dynamically add a source script to the page.

You can either specify a main function or just make the main function within the script the same as the script's name (minus ".js")
*/
Oversimplified.AddScript = function (pathToScript, mainFunction) {
    mainFunction = typeof mainFunction !== 'undefined' ? mainFunction : pathToScript.slice(((pathToScript.lastIndexOf("/")>-1)?pathToScript.lastIndexOf("/")+1:0), pathToScript.indexOf("."));
    
    Oversimplified.loadingScripts.push(pathToScript);
    
    var script = document.createElement('script');
    script.src = pathToScript;
    script.onload = function () {
        if (typeof mainFunction !== 'string') {
            Oversimplified.WaitForScriptsToLoad(function(){mainFunction()});
        } else {
            if (typeof window[mainFunction] === 'function') {
                Oversimplified.WaitForScriptsToLoad(function(){window[mainFunction]()});
            } else {
                if (Oversimplified.DEBUG.showMessages) console.log(mainFunction + " is not a function!");
            }
        }
        
        Oversimplified.loadingScripts.splice(Oversimplified.loadingScripts.indexOf(pathToScript), 1);
    };
    document.body.appendChild(script);
}

// Callback function that prevents any added scripts from executing until all scripts are loaded.
Oversimplified.WaitForScriptsToLoad = function (Function) {
    if (Oversimplified.loadingScripts.length > 0) {
        setTimeout(function(){Oversimplified.WaitForScriptsToLoad(Function)}, 0.1);
    } else {
        Function();
    }
}

// Global function to detect Internet Explorer
function IsInternetExplorer () {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {        // If Internet Explorer, return true
        return true;
    } else {        // If another browser, return false
        return false;
    }
}

// Add more functionality to Math namespace

/* Make sure the value does not fall outide the min-max range

Usage: numberValue = Math.clamp(numberValue, 3, 10);
*/
Math.clamp = function (value, min, max) {
    if (min == max) {
        if (Oversimplified.DEBUG.showMessages) console.log("Min and Max cannot be the same number!");
        return false;
    }
    if (min > max) {
        if (Oversimplified.DEBUG.showMessages) console.log("Min must be less than Max!");
        return false;
    }
    
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
};


/* Make sure the given value does not fall outide the 0-1 range

Usage: numberValue = Math.clamp01(numberValue);
*/
Math.clamp01 = function (value) {
    if (value < 0) {
        value = 0;
    }
    if (value > 1) {
        value = 1;
    }
    return value;
};


/* Return the given numberValue as a clamped angle between 0 and 360

Usage: numberValue = Math.clampAngle(numberValue, 0, 180);

Alternate: numberValue = Math.clampAngle(numberValue);
*/
Math.clampAngle = function (value, min, max) {
    // Make sure angle is between 0 and 360
    while (value >= 360) {
        value -= 360;
    }
    while (value < 0) {
        value += 360;
    }
    
    if (typeof min !== 'undefined' && typeof max !== 'undefined') {
        // Adjust min and max values to be between 0 and 360
        while (min >= 360) {
            min -= 360;
        }
        while (min < 0) {
            min += 360;
        }
        while (max >= 360) {
            max -= 360;
        }
        while (max < 0) {
            max += 360;
        }
        
        if (min == max) {
            if (Oversimplified.DEBUG.showMessages) console.log("Min and Max cannot be the same number!");
            return false;
        }
        if (min > max) {
            if (Oversimplified.DEBUG.showMessages) console.log("Min must be less than Max!");
            return false;
        }
        
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
    }
    return value;
};


/* Convert a radian value to degrees

Usage: degreeValue = Math.radToDeg(radianValue);
*/
Math.radToDeg = function (radians) {
    return radians / (Math.PI / 180);
};

/* Convert a degree value to radians

Usage: radianValue = Math.degToRad(degreeValue);
*/
Math.degToRad = function (degrees) {
    return degrees * (Math.PI / 180);
};

/* Get the cosine of an angle given in degrees

Usage: cosine = Math.getCos(angleInDegrees);
*/
Math.getCos = function (angle) {
    return Math.cos(Math.degToRad(angle));
};

/* Get the sine of an angle given in degrees

Usage: sine = Math.getSin(angleInDegrees);
*/
Math.getSin = function (angle) {
    return Math.sin(Math.degToRad(angle));
};

/* Return true or false based on a 50% chance

Usage: flippedHeads = Math.coinFlip();
*/
Math.coinFlip = function () {
    if (Math.random() >= 0.5) {
        return true;
    } else {
        return false;
    }
};

/* Return a random number between min and max (inclusive)

Usage: numberBetween3And15 = Math.randomRange(3, 15);
*/
Math.randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
};
