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
Oversimplified.loadedScripts = [];
Oversimplified.emptyImage = new Image();
Oversimplified.emptyImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
Oversimplified.emptyImage.width = 1;
Oversimplified.emptyImage.height = 1;

// Settings Namespace
Oversimplified.Settings = {
    defaultStep : 1/30,
    numberOfScriptsToLoad : 0,
    soundVolume : 0.75,
    musicVolume : 0.75,
    preventRightClick : true
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
Oversimplified.step = Oversimplified.Settings.defaultStep;     //seconds per frame, i.e. one 30th of a second passes each frame.

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

/* Set up the camera.

It is important that this is done first at the time the game is loaded because this determines the size of the HTML5 canvas.
Be sure that the objectToFollow has already been created in the current room. Can be referenced with a variable.
objectToFollow, hBorder, and vBorder are optional arguments, but if you want to set hBorder and vBorder, there must be an objectToFollow.
*/
Oversimplified.SetCamera = function (options) {
    Oversimplified.camera.width = typeof options.width !== 'undefined' ? options.width : Oversimplified.camera.width;
    Oversimplified.camera.height = typeof options.height !== 'undefined' ? options.height : Oversimplified.camera.height;
    Oversimplified.SetCanvasToCameraSize();

    Oversimplified.camera.x = typeof options.x !== 'undefined' ? options.x : Oversimplified.camera.x;
    Oversimplified.camera.y = typeof options.y !== 'undefined' ? options.y : Oversimplified.camera.y;

    if (typeof options.objectToFollow !== 'undefined') {
        if (options.objectToFollow.name) {
            Oversimplified.camera.Follow(options.objectToFollow);
        } else {
            if (Oversimplified.DEBUG.showMessages) console.log("Oversimplified.Settings.SetCamera()'s objectToFollow argument must be a Oversimplified.GameObject.");
        }
    }

    Oversimplified.camera.hBorder = (typeof options.hBorder !== 'undefined') ? options.hBorder : Oversimplified.camera.hBorder;
    Oversimplified.camera.vBorder = (typeof options.vBorder !== 'undefined') ? options.vBorder : Oversimplified.camera.vBorder;

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

    this.down = this.pressed = false;
    this.held = false;
    this.up = this.released = false;
}
Oversimplified.Control.prototype.type = "Control";
Oversimplified.Control.prototype.Check = function () {
    if (Oversimplified.heldKeys.indexOf(this.keyCode) != -1) {
        this.held = true;
    } else {
        this.held = false;
    }
    if (Oversimplified.pressedKeys.indexOf(this.keyCode) != -1) {
        this.down = this.pressed = true;
    } else {
        this.down = this.pressed = false;
    }
    if (Oversimplified.releasedKeys.indexOf(this.keyCode) != -1) {
        this.up = this.released = true;
    } else {
        this.up = this.released = false;
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
    currentRoomName: "Default",
    AllBeforeDo: function () {},
    AllDo: function () {},
    AllAfterDo: function () {}
}

// Get the current room
Oversimplified.Rooms.Current = function () {
    return Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName];
}

// Add a Room to the collection of Rooms
Oversimplified.Rooms.Add = function (name, options) {
    if (typeof Oversimplified.Rooms[name] === 'undefined') {
        Oversimplified.Rooms[name] = new Oversimplified.Room(name, options);

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
options (optional) : An object with extra parameters for the Room. Options include:
    width : The width of the room. The camera will not travel beyond this to the right. If it is larger than the camera's width and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's width, it will be set to the camera's width. -- default = Oversimplified.camera.width
    height : The height of the room. The camera will not travel beyond this to the bottom. If it is larger than the camera's height and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's height, it will be set to the camera's height. -- default = Oversimplified.camera.height
    backgroundSrc : The image that will be displayed as the room's background. If excluded or set to empty string (""), no background will show.
    stepSpeed : The step speed for the Room. If excluded or set to 0, the default is used. -- default = Oversimplified.Settings.defaultStep
    backgroundSize : Sets the room size to whatever the backgroundSrc image size is, regardless of what is entered as width and height!
    backgroundColor : Any hex color value. Sets the far background color (behind the background image, visible only if transparent or excluded). A JavaScript alternative to setting the HTML5 canvas's background color CSS.
    foreground : Path to any image file, though .png or .gif file with transparency is ideal. Sets the foreground image that displays over the background and all objects in the room. Appears below the Room's DrawAbove() function but above any GameObject's DrawAbove() function.
*/
Oversimplified.Room = function (name, options) {
    this.id = Oversimplified.nextID++;
    var self = this;

    this.name = name;

    this.hasRunStart = false;

    options = typeof options !== 'undefined' ? options : {};

    options.width = (typeof options.width !== 'undefined' && options.width >= Oversimplified.camera.width) ? options.width : Oversimplified.camera.width;
    options.height = (typeof options.height !== 'undefined' && options.height >= Oversimplified.camera.height) ? options.height : Oversimplified.camera.height;
    options.stepSpeed = (typeof options.stepSpeed !== 'undefined' && options.stepSpeed > 0) ? options.stepSpeed : Oversimplified.Settings.defaultStep;

    this.width = options.width;
    this.height = options.height;

    // Room Background Image is held within the "bg" variable so the information about the background can be held in the "background" variable.
    if (typeof options.backgroundSrc !== 'undefined' && options.backgroundSrc != "") {
        this.bg = new Image();
        this.bg.src = options.backgroundSrc;
    } else {
        // If options.backgroundSrc is excluded or an empty string, instead use Oversimplified.emptyImage instead.
        this.bg = Oversimplified.emptyImage;
    }
    this.background = {};
    this.background.loaded = false;

    if (this.bg != Oversimplified.emptyImage) {
        this.bg.onload = function () {
            self.background.loaded = true;
            self.background.width = this.width;
            self.background.height = this.height;
            // If options "backgroundSize" is set to true, then make room the size of the background image.
            if (options.backgroundSize == true) {
                self.width = this.width;
                self.height = this.height;
            }
        }
    }


    this.stepSpeed = options.stepSpeed;

    this.objects = {};
    this.O = this.objects;

    if (typeof options.backgroundColor !== 'undefined') {
        this.background.color = options.backgroundColor;
        // if (Oversimplified.DEBUG.showMessages) console.log(this.name + " has a background color of " + this.background.color);
    }
    if (typeof options.foreground !== 'undefined') {
        this.foreground = new Image();
        this.foreground.loaded = false;
        this.foreground.src = options.foreground;
        this.foreground.onload = function () {this.loaded = true;}
    }

    // Set any extra properties from Options.
    for (var property in options) {
        if (typeof this[property] === 'undefined') {
            this[property] = options[property];
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

    if (this.name === Oversimplified.Rooms.currentRoomName) {
        for (var object in this.objects) {
            this.objects[object].Start();
        }
    }
    this.hasRunStart = true;
}
Oversimplified.Room.prototype.Update = function () {
    if (Oversimplified.step != this.stepSpeed) {
        Oversimplified.step = this.stepSpeed;
    }

    this.drawOrder = [];        //Determine draw order every frame
    for (var object in this.objects) {
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

    if (!this.hasRunStart) {
        this.Start();
    }

    this.BeforeDo();

    this.Do();

    if (this.name === Oversimplified.Rooms.currentRoomName) {
        for (var object in this.objects) {
            this.objects[object].Update();
        }
    }

    this.AfterDo();
}
Oversimplified.Room.prototype.End = function () {
    this.DoLast();
    if (this) this.hasRunStart = false;
}
Oversimplified.Room.prototype.Draw = function () {
    var self = this;
    //Always draw background first if there is one
    if (typeof this.background.color !== 'undefined') {
        var tmp = Oversimplified.context.fillStyle;
        Oversimplified.context.fillStyle = this.background.color;
        Oversimplified.context.fillRect(0, 0, Oversimplified.camera.width, Oversimplified.camera.height);
        Oversimplified.context.fillStyle = tmp;
    }
    if (this.background.loaded) {
        Oversimplified.context.drawImage(self.bg, Oversimplified.camera.x, Oversimplified.camera.y, (Oversimplified.camera.width <= self.background.width) ? Oversimplified.camera.width : self.background.width, (Oversimplified.camera.height <= self.background.height) ? Oversimplified.camera.height : self.background.height, 0, 0, self.background.width, self.background.height);
    }

    this.DrawBelow();    //Draw this before any objects are drawn

    for (var i = 0; i < this.drawOrder.length; i++) {
        if (typeof this.objects[this.drawOrder[i]] !== 'undefined') {
            this.objects[this.drawOrder[i]].Draw();
        }
    }

    // If there is a foreground, draw it.
    if (typeof this.foreground !== 'undefined') {
        if (this.foreground.loaded) {
            Oversimplified.context.drawImage(self.foreground, Oversimplified.camera.x, Oversimplified.camera.y, Oversimplified.camera.width, Oversimplified.camera.height, 0, 0, self.foreground.width, self.foreground.height);
        }
    }

    this.DrawAbove();    //Draw this after all other drawing is done
}

// Add a GameObject or PremadeObject to the room.
Oversimplified.Room.prototype.AddObject = function (objectOrNewName, objectOptions) {
    objectOptions = (typeof objectOptions !== 'undefined') ? objectOptions : {};
    var self = this;

    if (objectOrNewName.type == "GameObject") {    //Create from prefabricated object
        // Overwrite manual id or name, if entered.
        objectOptions.id = Oversimplified.nextID++;
        objectOptions.name = objectOrNewName.name + objectOptions.id.toString();
        // console.log(objectOptions.name);
        self.objects[objectOptions.name] = Oversimplified.CopyObject(objectOrNewName, objectOptions);

        return self.objects[objectOptions.name];
    }
    else {
        if (self.objects[objectOrNewName]) {
            if (Oversimplified.DEBUG.showMessages) console.log("Object with name \"" + objectOrNewName + "\" already exists in current room!");
            return false;
        }
        self.objects[objectOrNewName] = new Oversimplified.GameObject(objectOrNewName, objectOptions);

        return self.objects[objectOrNewName];
    }
}

// Set the specified room as the current room.
Oversimplified.Room.prototype.SetAsCurrentRoom = function () {
    Oversimplified.SetRoom(this);
}

// Create an object in the current room.
Oversimplified.Create = function (objectOrNewName, objectOptions) {
    return Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].AddObject(objectOrNewName, objectOptions);
}

// Change to the specified room.
// Runs the current Room's End() function, changes the room, and runs the specified Room's Start() function.
Oversimplified.SetRoom = function (room) {
    if (typeof Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName] !== 'undefined') {
        Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].End();
    }

    Oversimplified.Rooms.currentRoomName = room.name;
    Oversimplified.O = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects;    //Update the Oversimplified.O alias when room changes
    Oversimplified.camera.following = "";

    Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].Start();
    if (Oversimplified.DEBUG.showMessages) console.log("The current room is \"" + Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].name + "\".");
}

// PremadeObjects (Prefab) Namespace
Oversimplified.PremadeObjects = {};

// Add a GameObject to the list of PremadeObjects.
Oversimplified.PremadeObjects.Add = function (name, objectOptions) {// x, y, imageSrc, maskImageSrc, animationsArray) {
    if (typeof Oversimplified.PremadeObjects[name] === 'undefined') {
        Oversimplified.PremadeObjects[name] = new Oversimplified.GameObject(name, objectOptions);// x, y, imageSrc, maskImageSrc, animationsArray);
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
Oversimplified.GameObject = function (name, options) {// x, y, imageSrc, maskImageSrc, animationsArray) {
    this.id = Oversimplified.nextID++;

    var self = this;
    this.self = self;
    this.hasRunStart = false;

    //Required Options
    this.name = name;

    //Optional Options
    this.depth = typeof options.depth !== 'undefined' ? options.depth : 0; // Objects with higher depth are drawn *later* than (above) objects with lower depths. Objects with the same depth are drawn in the order they are created.
    this.solid = typeof options.solid !== 'undefined' ? options.solid : false;
    this.persistent = typeof options.persistent !== 'undefined' ? options.persistent : false;
    this.x = typeof options.x !== 'undefined' ? options.x : -1;
    this.y = typeof options.y !== 'undefined' ? options.y : -1;
    this.xPrevious = this.x;
    this.yPrevious = this.y;
    this.screenX = this.x - Oversimplified.camera.x;
    this.screenY = this.y - Oversimplified.camera.y;

    // If there is no options.imageSrc, use Oversimplified.emptyImage. If there is and it has a .src already, use the image, otherwise, create a new Image.
    this.image = (options.imageSrc) ? ((options.imageSrc.src) ? options.imageSrc : new Image()) : Oversimplified.emptyImage;
    this.image.src = (this.image.src) ? this.imageSrc.src : options.imageSrc;

    this.sprite = {};
    this.sprite.xScale = typeof options.xScale !== 'undefined' ? options.xScale : 1;
    this.sprite.yScale = typeof options.yScale !== 'undefined' ? options.yScale : this.sprite.xScale;

    this.sprite.rotation = typeof options.rotation !== 'undefined' ? Math.clampAngle(options.rotation) : 0;

    this.sprite.animations = {};

    this.sprite.frameColumn = 0;
    this.sprite.frameRow = 0;

    if (typeof options.animations !== 'undefined') {
        for (var i = 0; i < options.animations.length; i++) {
            if (i == 0 && options.animations[i].name != "Default") {
                this.sprite.animations["Default"] = options.animations[i];    // Creates a duplicate animation of the first animation called "Default" in addition to the named animation below (unless the animation's name is "Default")
            }
            this.sprite.animations[options.animations[i].name] = options.animations[i];
        }
    } else {
        if (this.image != Oversimplified.emptyImage) {
            //If no animations array is included, then just show the whole image
            this.image.onload = function(){self.sprite.animations["Default"] = new Oversimplified.Animation("newAnimation", {width: this.width, height: this.height});}    // Creates the default animation as the whole image once the image is loaded.
        } else {
            this.sprite.animations["Default"] = new Oversimplified.Animation("newAnimation", {width: this.image.width, height: this.image.height});
        }
    }

    this.sprite.currentAnimation = "Default";

    this.mask = (options.maskImageSrc) ? new Image() : {};
    this.mask.src = (options.maskImageSrc) ? options.maskImageSrc : "";
    if (this.mask.src == "") {
        this.mask.width = this.sprite.animations["Default"].width;
        this.mask.height = this.sprite.animations["Default"].height;
    }

    if (this.mask.src != "") {
        this.mask.onload = function(){
            self.xBound = this.width / 2 * self.sprite.xScale;
            self.yBound = this.height / 2 * self.sprite.yScale;
        };
    } else {
        self.xBound = this.mask.width / 2 * self.sprite.xScale;
        self.yBound = this.mask.height / 2 * self.sprite.yScale;
    }

    // Set any extra properties from Options.
    for (var property in options) {
        if (typeof this[property] === 'undefined') {
            this[property] = options[property];
        }
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
Oversimplified.GameObject.prototype.AddAnimation = function (animation, animationWidth, animationHeight, animationOptions) {//columns, rows, speed, xOffset, yOffset) {
    //Takes either an animation or the name of an animation in the Animations namespace and adds it to the object.
    if (typeof animation.name !== 'undefined') {
        this.sprite.animations[animationOptions.name] = animation;
    } else {
        if (typeof Oversimplified.Animations[animation] === 'undefined') {
            Oversimplified.Animations.Add(animation, animationWidth, animationHeight, animationOptions);
        }
        this.sprite.animations[Oversimplified.Animations[animation].name] = Oversimplified.Animations[animation];
    }
}
Oversimplified.GameObject.prototype.Draw = function () {
    this.DrawBelow();

    var self = this;
    var animation = self.sprite.currentAnimation;
    if (self.sprite.animations[animation]) {
        var animationWidth = self.sprite.animations[animation].width;
        var animationHeight = self.sprite.animations[animation].height;
        var width = self.sprite.animations[animation].width * self.sprite.xScale;
        var height = self.sprite.animations[animation].height * self.sprite.yScale;
        var columns = self.sprite.animations[animation].columns;
        var rows = self.sprite.animations[animation].rows;
        var xOffset = self.sprite.animations[animation].xOffset;
        var yOffset = self.sprite.animations[animation].yOffset;
        var animationSpeed = self.sprite.animations[animation].speed;

        if (self.sprite.frameColumn < columns) {
            self.sprite.frameColumn += animationSpeed;
        }
        if (self.sprite.frameColumn >= columns) {
            self.sprite.frameColumn = 0;
            self.sprite.frameRow++;
        }
        if (self.sprite.frameRow > rows - 1) {
            self.sprite.frameRow = 0;
        }

        if (Oversimplified.IsOnCamera(self)) {
            var adjustedColumn = Math.floor(self.sprite.frameColumn);
            var adjustedRow = Math.floor(self.sprite.frameRow);

            Oversimplified.context.translate(self.x - Oversimplified.camera.x, self.y - Oversimplified.camera.y);
            var angleInRadians = self.sprite.rotation * (Math.PI/180);
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
    this.sprite.xScale = xScale;
    this.sprite.yScale = typeof yScale !== 'undefined' ? yScale : xScale;
    this.xBound = (this.mask.width / 2) * this.sprite.xScale;
    this.yBound = (this.mask.height / 2) * this.sprite.yScale;
}
Oversimplified.GameObject.prototype.SetImageRotation = function (rotation) {
    this.sprite.rotation = Math.clampAngle(rotation);
}
Oversimplified.GameObject.prototype.RotateImage = function (amount) {
    this.sprite.rotation += Math.clampAngle(amount);
}
Oversimplified.GameObject.prototype.SetAnimation = function (which) {
    if (which.name) {    //If you enter an actual animation instead of just its name,
        which = which.name;    //only use its name
    }
    this.sprite.currentAnimation = which;
    this.sprite.frameColumn = 0;
    this.sprite.frameRow = 0;
}
Oversimplified.GameObject.prototype.Start = function () {
    this.DoFirst();
    this.hasRunStart = true;
}
Oversimplified.GameObject.prototype.Update = function () {
    this.screenX = this.x - Oversimplified.camera.x;
    this.screenY = this.y - Oversimplified.camera.y;
    this.xPrevious = this.x;
    this.yPrevious = this.y;

    if (!this.hasRunStart) {
        this.Start();
    }

    this.BeforeDo();
    this.Do();
    this.AfterDo();

    //Make sure rotation is a valid angle before drawing
    this.sprite.rotation = Math.clampAngle(this.sprite.rotation);
}
Oversimplified.GameObject.prototype.End = function () {
    this.DoLast();
    if (this) this.hasRunStart = false;
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

    if (overlappingObject != false) {
        if (this.x < overlappingObject.x)
            this.x--;
        if (this.x >= overlappingObject.x)
            this.x++;
        if (this.y < overlappingObject.y)
            this.y--;
        if (this.y >= overlappingObject.y)
            this.y++;

        return true;
    } else {
        return false;
    }
}

// Prevents the object from moving outside of the room's boundaries.
Oversimplified.GameObject.prototype.KeepInsideRoom = function () {
    var currentRoom = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName];
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
// xSpeed and ySpeed are numbers, checkCollisions is true or false, and checkEveryXPixels is a number.
//
// Returns true if successfully moved and false if not.
Oversimplified.GameObject.prototype.SimpleMove = function (xSpeed, ySpeed, checkCollisions, checkEveryXPixels) {
    checkEveryXPixels = (typeof checkEveryXPixels !== 'undefined') ? checkEveryXPixels : 2;
    var collisionLeft = false,
        collisionRight = false,
        collisionUp = false,
        collisionDown = false;
    if (checkCollisions) {
        for (var vert = 0; vert < this.yBound * 2; vert += checkEveryXPixels) {
            var yToCheck = (this.y - this.yBound + vert);
            if (!collisionLeft) {
                collisionLeft = xSpeed < 0 && Oversimplified.CollisionAtPoint((this.x - this.xBound) + xSpeed, yToCheck);
            }
            if (!collisionRight) {
                collisionRight = xSpeed > 0 && Oversimplified.CollisionAtPoint((this.x + this.xBound) + xSpeed, yToCheck);
            }
        }
        for (var hor = 0; hor < this.xBound * 2; hor += checkEveryXPixels) {
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
        return true;
    } else {
        return false;
    }
}

// Removes the specified object from memory.
Oversimplified.GameObject.prototype.Destroy = function () {
    this.End();
    delete Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[this.name];
}

// Check if the point (x, y) lies inside the bounds of ANY object in the room.
// If yes and if that object is flagged as solid, then there is a collision.
Oversimplified.GameObjectsAtPoint = function (x, y) {
    var objectsAtPoint = [];
    for (var obj in Oversimplified.O) {
        var object = Oversimplified.O[obj];
        if (x <= object.x + object.xBound && x >= object.x - object.xBound &&
            y <= object.y + object.yBound && y >= object.y - object.yBound)
        {
            objectsAtPoint.push(object);
        }
    }

    if (objectsAtPoint.length > 0) {
        return objectsAtPoint;
    } else {
        return false;
    }
}

// Check if the point (x, y) lies inside the bounds of ANY object in the room.
// If yes and if that object is flagged as solid, then there is a collision.
Oversimplified.CollisionAtPoint = function (x, y) {
    var objectsAtPoint = Oversimplified.GameObjectsAtPoint(x, y);

    for (var i = 0; i < objectsAtPoint.length; i++) {
        if (objectsAtPoint[i].solid == true) {
            return true;
        }
    }
    return false;
}

// Animations Namespace
Oversimplified.Animations = {};
Oversimplified.Animations.Add = function (animationName, animationWidth, animationHeight, animationOptions) {
    if (typeof Oversimplified.Animations[animationName] === 'undefined') {
        Oversimplified.Animations[animationName] = new Oversimplified.Animation(animationName, animationWidth, animationHeight, animationOptions);
        return Oversimplified.Animations[animationName];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("An animation with the name \"" + animationName + "\" already exists!");
        return false;
    }
};
Oversimplified.Animations.New = Oversimplified.Animations.Add;
Oversimplified.A = Oversimplified.Animations;

// Animation class (for use with sprite sheets)
//
// Prevents animation mess-ups by preventing speeds higher than one with Math.clamp01.
Oversimplified.Animation = function (name, width, height, options) {
    this.id = Oversimplified.nextID++;

    //Required Options
    this.name = name;
    this.width = width;
    this.height = height;

    //Optional Options
    this.columns = typeof options.columns !== 'undefined' ? options.columns : 1;;
    this.rows = typeof options.rows !== 'undefined' ? options.rows : 1;
    this.speed = typeof options.speed !== 'undefined' ? Math.clamp01(options.speed) : 1;
    this.xOffset = typeof options.xOffset !== 'undefined' ? options.xOffset : 0;
    this.yOffset = typeof options.yOffset !== 'undefined' ? options.yOffset : 0;
}
Oversimplified.Animation.prototype.type = "Animation";

/*  Effects namespace
*/
Oversimplified.Effects = {
    Sounds: {},
    Tunes: {}
}

// Aliases for Sounds and Tunes
Oversimplified.Effects.S = Oversimplified.Effects.Sounds;
Oversimplified.Effects.T = Oversimplified.Effects.Music = Oversimplified.Effects.M = Oversimplified.Effects.Tunes;

// Alias for Effects
Oversimplified.E = Oversimplified.Effects;

Oversimplified.Effects.AddSound = function (soundName, soundSources) {
    if (typeof Oversimplified.Effects.Sounds[soundName] === 'undefined') {
        Oversimplified.Effects.Sounds[soundName] = new Oversimplified.Sound(soundName, soundSources);
        return Oversimplified.Effects.Sounds[soundName];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("A Sound with the name \"" + soundName + "\" already exists!");
        return false;
    }
}
Oversimplified.Effects.NewSound = Oversimplified.Effects.AddSound;

Oversimplified.Effects.AddTune = function (tuneName, tuneSources) {
    if (typeof Oversimplified.Effects.Tunes[tuneName] === 'undefined') {
        Oversimplified.Effects.Tunes[tuneName] = new Oversimplified.Sound(tuneName, tuneSources);
        return Oversimplified.Effects.Tunes[tuneName];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("A Tune with the name \"" + tuneName + "\" already exists!");
        return false;
    }
}
Oversimplified.Effects.AddMusic = Oversimplified.Effects.NewTune = Oversimplified.Effects.NewMusic = Oversimplified.Effects.AddTune;

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
Oversimplified.Sound = function (name, sourcesObject) {
    this.id = Oversimplified.nextID++;

    sourcesObject = typeof sourcesObject !== 'undefined' ? sourcesObject : {};

    this.name = name;
    this.source = {
        mp3: (typeof sourcesObject.mp3 !== 'undefined' && sourcesObject.mp3.length > 0) ? sourcesObject.mp3 : false,
        wav: (typeof sourcesObject.wav !== 'undefined' && sourcesObject.wav.length > 0) ? sourcesObject.wav : false,
        ogg: (typeof sourcesObject.ogg !== 'undefined' && sourcesObject.ogg.length > 0) ? sourcesObject.ogg : false
    };

    this.audioElement = document.createElement("audio");
    this.audioElement.id = this.name + this.id.toString();
    // Alias for this.audioElement
    this.element = this.audioElement;

    for (var type in this.source) {
        if (type !== false) {
            var audioSource = document.createElement("source");
            audioSource.src = this.source[type];
            this.audioElement.appendChild(audioSource);
        }
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
Oversimplified.Sound.prototype.Stop = function () {
    this.element.pause();
    this.element.currentTime = 0;
}
Oversimplified.Sound.prototype.IsPlaying = function () {
    return !this.element.paused && !this.element.ended && 0 < this.element.currentTime;
}

/*  Tune Class

    Preferably source should be a .mp3 file and secondarySource should be a .ogg file.
    If duration is specified, loop when duration is reached.
*/
Oversimplified.Tune = function (name, tuneOptions) {
    this.id = Oversimplified.nextID++;

    tuneOptions = (typeof tuneOptions !== 'undefined') ? tuneOptions : {};

    this.name = name;
    this.source = {
        mp3: (typeof tuneOptions.mp3 !== 'undefined' && tuneOptions.mp3.length > 0) ? tuneOptions.mp3 : false,
        wav: (typeof tuneOptions.wav !== 'undefined' && tuneOptions.wav.length > 0) ? tuneOptions.wav : false,
        ogg: (typeof tuneOptions.ogg !== 'undefined' && tuneOptions.ogg.length > 0) ? tuneOptions.ogg : false
    };
    this.duration = (typeof tuneOptions.duration !== 'undefined') ? tuneOptions.duration : false;

    this.audioElement = document.createElement("audio");
    this.audioElement.id = this.name + this.id.toString();
    // Alias for this.audioElement
    this.element = this.audioElement;

    for (var type in this.source) {
        if (type !== false) {
            var audioSource = document.createElement("source");
            audioSource.src = this.source[type];
            this.audioElement.appendChild(audioSource);
        }
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
Oversimplified.Tune.prototype.Stop = function () {
    this.element.pause();
    this.element.currentTime = 0;
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

/* Copy a GameObject
*/
Oversimplified.CopyObject = function (object, objectOptions) {
    var resultingCopy = {};

    //Copy Oversimplified.GameObject-unique properties
    if (object.type == 'GameObject') {
        resultingCopy.self = resultingCopy;
        resultingCopy.image = new Image();
        resultingCopy.image.src = object.image.src;
        resultingCopy.sprite = {};
        resultingCopy.sprite.xScale = object.sprite.xScale;
        resultingCopy.sprite.yScale = object.sprite.yScale;
        resultingCopy.sprite.rotation = object.sprite.rotation;
        resultingCopy.sprite.frameColumn = 0;
        resultingCopy.sprite.frameRow = 0;
        resultingCopy.sprite.animations = object.sprite.animations;
        resultingCopy.sprite.currentAnimation = object.sprite.currentAnimation;
        resultingCopy.mask = new Image();
        resultingCopy.mask.src = object.mask.src;
        if (resultingCopy.mask.src == "") {
            resultingCopy.mask.width = resultingCopy.sprite.animations["Default"].width;
            resultingCopy.mask.height = resultingCopy.sprite.animations["Default"].height;
        }
        resultingCopy.mask.onload = function(){
            resultingCopy.xBound = this.width / 2;
            resultingCopy.yBound = this.height / 2;
        };
    }
    for (var property in object) {
        if (typeof resultingCopy[property] === 'undefined') {
            if (object[property].slice) {      // If it's an array, copy its values.
                resultingCopy[property] = object[property].slice();
            } else {
                resultingCopy[property] = object[property];
            }
        }
    }
    for (var option in objectOptions) {
        //Overwrite any extra properties specified in objectOptions.
        if (objectOptions[option].slice) {      // If it's an array, copy its values.
            resultingCopy[option] = objectOptions[option].slice();
        } else {
            resultingCopy[option] = objectOptions[option];
        }
    }

    // If id and name were not specified in the objectOptions and are therefore not set, set them!
    if (typeof resultingCopy.id === 'undefined') resultingCopy.id = Oversimplified.nextID++;
    if (typeof resultingCopy.name === 'undefined') resultingCopy.name = object.name + resultingCopy.id.toString();

    return resultingCopy;
}

Oversimplified.Save = function (location, data) {
    // Set and overwrite data at specified location in browser's Local Storage
    if(typeof(Storage) !== "undefined") {
        localStorage.setItem(location, data);
        if (localStorage.getItem(location) == data) {
            if (Oversimplified.DEBUG.showMessages) console.log("Successfully saved " + data + " to localStorage[\"" + location + "\"].");
            return true;
        } else {
            if (Oversimplified.DEBUG.showMessages) console.log("Could not save " + data + " to localStorage[\"" + location + "\"].");
        }
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("This browser does not support saving to localStorage.");
    }
    return false;
}

Oversimplified.Load = function (location) {
    // Load data from specified location in browser's Local Storage
    if(typeof(Storage) !== "undefined") {
        if (localStorage.getItem(location)) {
            if (Oversimplified.DEBUG.showMessages) console.log("Successfully loaded from localStorage[\"" + location + "\"].");
            return localStorage.getItem(location);
        } else {
            if (Oversimplified.DEBUG.showMessages) console.log("No data saved in localStorage[\"" + location + "\"].");
        }
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("This browser does not support loading from localStorage.");
    }
    return false;
}

Oversimplified.Erase = function (location) {
    // Remove data at specified location in browser's Local Storage
    if(typeof(Storage) !== "undefined") {
        if (localStorage.getItem(location)) {
            localStorage.removeItem(location);
            if (!localStorage.getItem(location)) {
                if (Oversimplified.DEBUG.showMessages) console.log("Successfully erased localStorage[\"" + location + "\"].");
                return true;
            } else {
                if (Oversimplified.DEBUG.showMessages) console.log("Could not erase localStorage[\"" + location + "\"].");
            }
        } else {
            if (Oversimplified.DEBUG.showMessages) console.log("There is no data to remove from localStorage[\"" + location + "\"].");
        }
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("This browser does not support manipulating localStorage.");
    }
    return false;
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
            roomInQuestion = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName];
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
    if (Oversimplified.Settings.preventRightClick) Oversimplified.canvas.oncontextmenu = function() {return false;};
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
    if ((Oversimplified.Settings.numberOfScriptsToLoad > 0 && Oversimplified.loadedScripts.length == Oversimplified.Settings.numberOfScriptsToLoad) ||
        (Oversimplified.Settings.numberOfScriptsToLoad <= 0 &&Oversimplified.loadingScripts.length == 0))
    {
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
        if (Oversimplified.DEBUG.showMessages) {
            var debugMessage = "Loaded " + Oversimplified.loadedScripts.length.toString();
            debugMessage += (Oversimplified.Settings.numberOfScriptsToLoad > 0) ? " of " + Oversimplified.Settings.numberOfScriptsToLoad.toString() : "";
            debugMessage += " scripts:\n" + Oversimplified.loadedScripts.toString() + ".\nWaiting for:\n" + Oversimplified.loadingScripts.toString();
            console.log(debugMessage);
        }

        if (Oversimplified.Settings.numberOfScriptsToLoad > 0) {
            var percentage = Oversimplified.loadedScripts.length / Oversimplified.Settings.numberOfScriptsToLoad;
            var barHeight = 32;
            var maxBarWidth = Math.round(Oversimplified.camera.width * 0.6);
            var barWidth = Math.round(maxBarWidth * percentage);
            var barX = Math.round(Oversimplified.camera.width * 0.2);
            var barY = Math.round(Oversimplified.camera.height * 0.5) - Math.round(barHeight / 2);

            var saveFillStyle = OS.context.fillStyle;
            var saveStrokeStyle = OS.context.strokeStyle;

            OS.context.fillStyle = "#DD5511";
            OS.context.fillRect(barX, barY, barWidth, barHeight);

            OS.context.strokeStyle= "#882200";
            OS.context.lineWidth=5;
            OS.context.strokeRect(barX, barY, maxBarWidth, barHeight);

            OS.context.fillStyle = saveFillStyle;
            OS.context.strokeStyle = saveStrokeStyle;
        }
    }

    requestAnimationFrame(Oversimplified.Frame);
}

// Mechanical/action-based/calculation functions
Oversimplified.Update = function () {
    Oversimplified.Controls.CheckAll();

    Oversimplified.Rooms.AllBeforeDo();
    Oversimplified.Rooms.AllDo();
    if (typeof Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName] !== 'undefined') {
        Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].Update();
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("There is no current room. Please add one or make sure you are referencing the correct room with Oversimplified.Rooms.SetRoom().");
    }

    Oversimplified.Rooms.AllAfterDo();

    if (Oversimplified.camera.following != "") {    //If the camera is following an object, keep the object within its borders.
        if (Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[Oversimplified.camera.following].x - Oversimplified.camera.x > Oversimplified.camera.width - Oversimplified.camera.hBorder) {
            Oversimplified.camera.x = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[Oversimplified.camera.following].x - (Oversimplified.camera.width - Oversimplified.camera.hBorder);
        }
        if (Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[Oversimplified.camera.following].x - Oversimplified.camera.x < Oversimplified.camera.hBorder) {
            Oversimplified.camera.x = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[Oversimplified.camera.following].x - Oversimplified.camera.hBorder;
        }
        if (Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[Oversimplified.camera.following].y - Oversimplified.camera.y > Oversimplified.camera.height - Oversimplified.camera.vBorder) {
            Oversimplified.camera.y = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[Oversimplified.camera.following].y - (Oversimplified.camera.height - Oversimplified.camera.vBorder);
        }
        if (Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[Oversimplified.camera.following].y - Oversimplified.camera.y < Oversimplified.camera.vBorder) {
            Oversimplified.camera.y = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[Oversimplified.camera.following].y - Oversimplified.camera.vBorder;
        }
    }

    // Don't let camera move past room boundaries.
    if (Oversimplified.camera.x < 0) {
        Oversimplified.camera.x = 0;
    }
    if (Oversimplified.camera.x + Oversimplified.camera.width > Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].width) {
        Oversimplified.camera.x = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].width - Oversimplified.camera.width;
    }
    if (Oversimplified.camera.y < 0) {
        Oversimplified.camera.y = 0;
    }
    if (Oversimplified.camera.y + Oversimplified.camera.height > Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].height) {
        Oversimplified.camera.y = Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].height - Oversimplified.camera.height;
    }
}

// Drawing functions
Oversimplified.Draw = function () {
    Oversimplified.context.clearRect(0, 0, Oversimplified.canvas.width, Oversimplified.canvas.height);
    Oversimplified.DEBUG.objectsOnScreen = 0;

    if (typeof Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName] !== 'undefined') {
        Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].Draw();
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

        Oversimplified.loadedScripts.push(pathToScript);
        Oversimplified.loadingScripts.splice(Oversimplified.loadingScripts.indexOf(pathToScript), 1);
    };
    document.body.appendChild(script);
}

// Callback function that prevents any added scripts from executing until all scripts are loaded.
Oversimplified.WaitForScriptsToLoad = function (Function) {
    if (Oversimplified.DEBUG.showMessages && Oversimplified.Settings.numberOfScriptsToLoad > 0) console.log("Waiting for " + (Oversimplified.Settings.numberOfScriptsToLoad - Oversimplified.loadedScripts.length).toString() + " scripts to load");
    if (Oversimplified.loadingScripts.length > 0)
    {
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
