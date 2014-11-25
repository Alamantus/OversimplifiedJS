var canvas, context;
var nextID = 0;

//Settings Namespace - currently unused, to be used for audio
var Settings = window.Settings || {};
Settings.defaultStep = 1/30;
Settings.SetCamera = function (width, height, hBorder, vBorder, following) {
    hBorder = typeof hBorder !== 'undefined' ? hBorder : camera.hBorder;
    vBorder = typeof vBorder !== 'undefined' ? vBorder : camera.vBorder;
    
    if (typeof width !== 'undefined') {
        camera.width = width;
    } else {
        console.log("You must specify a width in function Settings.SetCamera()");
        return false;
    }
    if (typeof height !== 'undefined') {
        camera.height = height;
    } else {
        console.log("You must specify a height in function Settings.SetCamera()");
        return false;
    }
    
    camera.hBorder = hBorder;
    camera.vBorder = vBorder;
    
    if (following.name) {
        camera.Follow(following);
    }
}

var S = window.Settings;

//Time variables
function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
var now;
var dateTime = 0;
var lastFrame = timestamp();
var step = Settings.defaultStep;     //seconds per frame

var camera = {
    x: 0,
    y: 0,
    width: 640,
    height: 480,
    hBorder: 64,
    vBorder: 64,
    following: "",
    Follow: function (object) {
        this.following = object.name;
    }
}

var mouse = {
    x: 0,
    y: 0,
    leftCode: isInternetExplorer() ? 1 : 0,
    middleCode: isInternetExplorer() ? 4 : 1,
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

//Keys
var heldKeys = [];
var pressedKeys = [];
var releasedKeys = [];

//Key definitions
var Key = {
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
var Keycode = {
    backspace:    8,
    tab:    9,
    enter:    13,
    shift:    16,
    ctrl:    17,
    alt:    18,
    pausebreak:    19,
    capslock:    20,
    escape:    27,
    pageup:    33,
    pagedown:    34,
    end:    35,
    home:    36,
    left:    37,
    up:    38,
    right:    39,
    down:    40,
    insert:    45,
    delete:    46,
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

//Controls Namespace
var Controls = window.Controls || {};
Controls.Add = function(name, positiveKeycode, negativeKeycode) {
    if (typeof negativeKeycode !== 'undefined') {
        Controls[name] = new Axis(positiveKeycode, negativeKeycode);
    } else {
        Controls[name] = new Control(keycode);
    }
};
Controls.New = Controls.Add;
Controls.CheckAll = function () {
    for (control in Controls) {
        if (typeof Controls[control].Check !== 'undefined') {
            Controls[control].Check();
        }
    }
};
var C = window.Controls;

//Control Class
function Control (keycode) {
    var self = this;
    
    this.keyCode = keycode;
    this.keyName = Key[keycode];
    
    this.down = false;
    this.held = false;
    this.up = false;
}
Control.prototype.type = "Control";
Control.prototype.Check = function () {
    if (heldKeys.indexOf(this.keyCode) != -1) {
        this.held = true;
    } else {
        this.held = false;
    }
    if (pressedKeys.indexOf(this.keyCode) != -1) {
        this.down = true;
    } else {
        this.down = false;
    }
    if (releasedKeys.indexOf(this.keyCode) != -1) {
        this.up = true;
    } else {
        this.up = false;
    }
}

//Axis Class
function Axis (positiveKeycode, negativeKeycode) {
    //Keeps track of a direction, either -1, 0, or 1
    var self = this;
    
    this.positiveKeycode = positiveKeycode;
    this.positiveKeyName = Key[positiveKeycode];
    this.negativeKeycode = negativeKeycode;
    this.negativeKeyName = Key[negativeKeycode];
    
    this.direction = 0;
}
Axis.prototype.type = "Axis";
Axis.prototype.Check = function () {
    if (heldKeys.indexOf(this.positiveKeycode) != -1
        && heldKeys.indexOf(this.negativeKeycode) == -1)
    {
        this.direction = 1;
    }
    if (heldKeys.indexOf(this.negativeKeycode) != -1
        && heldKeys.indexOf(this.positiveKeycode) == -1)
    {
        this.direction = -1;
    }
    if ( (heldKeys.indexOf(this.negativeKeycode) == -1      //If neither are held
        && heldKeys.indexOf(this.positiveKeycode) == -1)
        || (heldKeys.indexOf(this.negativeKeycode) != -1    //or both are held
        && heldKeys.indexOf(this.positiveKeycode) != -1) )
    {
        this.direction = 0;
    }
}

//Rooms Namespace
var Rooms = window.Rooms || {
    currentRoom: "Default",
    AllBeforeDo: function () {},
    AllDo: function () {},
    AllAfterDo: function () {}
}
Rooms.Add = function (name, width, height, backgroundSrc, stepSpeed) {
    if (typeof Rooms[name] === 'undefined') {
        Rooms[name] = new Room(name, width, height, backgroundSrc, stepSpeed);
        
        return Rooms[name];
    } else {
        console.log("A Room with the name \"" + name + "\" already exists!");
        return false;
    }
}
Rooms.New = Rooms.Add;
var R = window.Rooms;
var O;    //Current Room Objects alias

//Room Class
function Room (name, width, height, backgroundSrc, stepSpeed) {
    this.id = nextID++;
    var self = this;
    
    stepSpeed = typeof stepSpeed !== 'undefined' ? stepSpeed : Settings.defaultStep;
    width = typeof width !== 'undefined' ? width : camera.width;
    height = typeof height !== 'undefined' ? height : camera.height;
    backgroundSrc = typeof backgroundSrc !== 'undefined' ? backgroundSrc : "";
    
    this.name = name;
    this.width = width;
    this.height = height;
    this.background = new Image();
    this.background.loaded = false;
    this.background.src = backgroundSrc;
    this.background.onload = function () {
            this.loaded = true;
        }
    this.stepSpeed = stepSpeed;
    
    this.AddObject = function (newObjectName, x, y, imageSrc, maskImageSrc, animationsArray) {
        if (newObjectName.type == "GameObject") {    //Create from prefabricated object
            var newID = nextID++;
            var newName = newObjectName.name + newID.toString();
            this.objects[newName] = CopyObject(newObjectName, newID, newName);
            
            return this.objects[newName];
        }
        else {
            if (this.objects[newObjectName]) {
                console.log("Object with name \"" + newObjectName + "\" already exists in current room!");
                return false;
            }
            this.objects[newObjectName] = new GameObject(newObjectName, x, y, imageSrc, maskImageSrc, animationsArray);
            
            return this.objects[newObjectName];
        }
    }
    
    this.objects = {};
    this.O = this.objects;
    
    this.drawOrder = [];
    
    this.DoFirst = function () {};
    
    this.BeforeDo = function () {};
    this.Do = function () {};
    this.AfterDo = function () {};
    
    this.DoLast = function () {};
    
    this.DrawBelow = function () {};
    this.DrawAbove = function () {};
}
Room.prototype.type = "Room";
Room.prototype.Start = function () {
    this.DoFirst();
    
    if (this.name === R.currentRoom) {
        for (var object in this.objects) {
            this.objects[object].Start();
        }
    }
}
Room.prototype.Update = function () {
    if (step != this.stepSpeed) {
        step = this.stepSpeed;
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
    
    if (this.name === R.currentRoom) {
        for (var object in this.objects) {
            this.objects[object].Update();
        }
    }
    
    this.AfterDo();
}
Room.prototype.End = function () {
    this.DoLast();
}
Room.prototype.Draw = function () {
    var self = this;
    //Always draw background first if there is one
    if (this.background.loaded) {
        context.drawImage(self.background, camera.x, camera.y, camera.width, camera.height, 0, 0, self.background.width, self.background.height);
    }
    
    this.DrawBelow();    //Draw this before any objects are drawn
    
    if (this.name === R.currentRoom) {
        for (var i = 0; i < this.drawOrder.length; i++) {
            if (typeof this.objects[this.drawOrder[i]] !== 'undefined') {
                this.objects[this.drawOrder[i]].Draw();
            }
        }
    }
    
    this.DrawAbove();    //Draw this after all other drawing is done
}

function SetRoom(room) {
    if (typeof R[R.currentRoom] !== 'undefined') {
        R[R.currentRoom].End();
    }
    
    R.currentRoom = room.name;
    O = window.Rooms[R.currentRoom].objects;    //Update the O alias when room changes
    camera.following = "";
    
    R[R.currentRoom].Start();
}

//PremadeObjects (Prefab) Namespace
var PremadeObjects = window.PremadeObjects || {};
PremadeObjects.Add = function (name, x, y, imageSrc, maskImageSrc, animationsArray) {
    if (typeof PremadeObjects[name] === 'undefined') {
        PremadeObjects[name] = new GameObject(name, x, y, imageSrc, maskImageSrc, animationsArray);
        return PremadeObjects[name];
    } else {
        console.log("A Premade Object with the name \"" + name + "\" already exists!");
        return false;
    }
}
PremadeObjects.New = PremadeObjects.Add;
var Prefabs = window.PremadeObjects;    //2 aliases in case someone likes the technical "prefab" term better
var P = window.PremadeObjects;

//GameObject class
function GameObject (name, x, y, imageSrc, maskImageSrc, animationsArray) {
    this.id = nextID++;
    
    var self = this;
    this.self = self;
    
    this.name = name;
    this.depth = 0;
    this.solid = false;
    this.persistent = false;
    
    this.x = typeof x !== 'undefined' ? x : -1;
    this.y = typeof y !== 'undefined' ? y : -1;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.xScale = 1;
    this.image.yScale = 1;
    this.image.rotation = 0;
    
    this.image.animations = {};
    
    this.image.frameColumn = 0;
    this.image.frameRow = 0;
    
    if (typeof animationsArray !== 'undefined') {
        for (var i = 0; i < animationsArray.length; i++) {
            if (i == 0 && animationsArray[i].name != "Default") {
                this.image.animations["Default"] = animationsArray[i];    //Creates a duplicate animation of the first animation called "Default" in addition to the named animation below (unless the animation's name is "Default"
            }
            this.image.animations[animationsArray[i].name] = animationsArray[i];
        }
    } else {
        //If no animations array is included, then just show the whole image
        this.image.onload = function(){this.animations["Default"] = new Animation("newAnimation", this.width, this.height)};    //Creates the default animation as the whole image once the image is loaded.
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
GameObject.prototype.type = "GameObject";
GameObject.prototype.AddAnimation = function (animation, width, height, columns, rows, speed, xOffset, yOffset) {
    //Takes either an animation or the name of an animation in the Animations namespace and adds it to the object.
    if (animation.name) {
        this.image.animations[animation.name] = animation;
    } else {
        if (typeof A[animation] === 'undefined') {
            A.Add(animation, width, height, columns, rows, speed, xOffset, yOffset);
        }
        this.image.animations[A[animation].name] = A[animation];
    }
}
GameObject.prototype.Draw = function () {
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
        
        if (isOnCamera(self)) {
            var adjustedColumn = Math.floor(self.image.frameColumn);
            var adjustedRow = Math.floor(self.image.frameRow);
            
            context.translate(self.x - camera.x, self.y - camera.y);
            var angleInRadians = self.image.rotation * (Math.PI/180);
            context.rotate(angleInRadians);
            context.drawImage(self.image, (animationWidth * adjustedColumn) + xOffset, (animationHeight * adjustedRow) + yOffset, animationWidth, animationHeight, -(width / 2), -(height / 2), width, height);
            context.rotate(-angleInRadians);
            context.translate(-(self.x - camera.x), -(self.y - camera.y));
            
            DEBUG.objectsOnScreen++;
        }
    } else {
        console.log("No animation at " + animation);
    }
    
    this.DrawAbove();
}
GameObject.prototype.SetScale = function (xScale, yScale) {
    //Negative scale does not flip image.
    this.image.xScale = xScale;
    this.image.yScale = typeof yScale !== 'undefined' ? yScale : xScale;
    this.xBound = (this.mask.width / 2) * this.image.xScale;
    this.yBound = (this.mask.height / 2) * this.image.yScale;
}
GameObject.prototype.SetImageRotation = function (rotation) {
    this.image.rotation = Math.clampAngle(rotation);
}
GameObject.prototype.RotateImage = function (amount) {
    this.image.rotation += Math.clampAngle(amount);
}
GameObject.prototype.SetAnimation = function (which) {
    if (which.name) {    //If you enter an actual animation instead of just its name,
        which = which.name;    //only use its name
    }
    this.image.currentAnimation = which;
    this.image.frameColumn = 0;
    this.image.frameRow = 0;
}
GameObject.prototype.Start = function () {
    this.DoFirst();
}
GameObject.prototype.Update = function () {
    this.BeforeDo();
    this.Do();
    this.AfterDo();
    
    //Make sure rotation is a valid angle before drawing
    this.image.rotation = Math.clampAngle(this.image.rotation);
}
GameObject.prototype.End = function () {
    this.DoLast();
}
GameObject.prototype.MoveTo = function (x, y, speed) {
    //Moves toward the given point at the given speed.
    //Imprecise and only moves at 90° and 45° angles, but gets the job done.
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
GameObject.prototype.PointOverlaps = function (x, y) {
    //Check if the given point is within the object's bounds.
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
GameObject.prototype.IsOverlapping = function () {
    // Check if object is overlapping any other object in the room
    var currentRoom = R[R.currentRoom];
    
    for (var obj in O) {
        var object = O[obj];
        if (object != this) {
            for (var i = 0; i < 2 * object.xBound; i++) {
                for (var j = 0; j < 2 * object.yBound; j++) {
                    var xToCheck = (object.x - object.xBound) + i;
                    var yToCheck = (object.y - object.yBound) + j;
                    
                    if (xToCheck > this.x - this.xBound
                        && xToCheck < this.x + this.xBound
                        && yToCheck > this.y - this.yBound
                        && yToCheck < this.y + this.yBound)
                    {    //Check if the point lies inside the bounds of ANY object in the room.
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
}
GameObject.prototype.MouseIsOver = function () {
    //Returns true if the mouse is within the object's bounding box.
    if (this.PointOverlaps(mouse.x, mouse.y))
    {
        return true;
    } else {
        return false;
    }
}
GameObject.prototype.Clicked = function (mouseClick) {
    //Returns true if the object is clicked with the given mouse click, eg. mouse.leftDown, mouse.rightUp, etc.
    //If no click is specified, it defaults to left down
    mouseClick = typeof mouseClick !== 'undefined' ? mouseClick : mouse.leftDown;
    if (this.MouseIsOver() && mouseClick)
    {
        return true;
    } else {
        return false;
    }
}
GameObject.prototype.SimpleMove = function (xSpeed, ySpeed, checkCollisions) {
    //Moves the object based upon xSpeed and ySpeed, stopping if colliding with solid objects
    //Speed is scaled based on camera's scale.
    var collisionLeft = collisionRight = collisionUp = collisionDown = false;
    if (checkCollisions) {
        for (var vert = 0; vert < this.yBound * 2; vert++) {
            var yToCheck = (this.y - this.yBound + vert);
            if (!collisionLeft) {    //If this has already been flagged true, don't make it false again.
                collisionLeft = xSpeed < 0 && CollisionAtPoint((this.x - this.xBound) + xSpeed, yToCheck);
            }
            if (!collisionRight) {    //If this has already been flagged true, don't make it false again.
                collisionRight = xSpeed > 0 && CollisionAtPoint((this.x + this.xBound) + xSpeed, yToCheck);
            }
        }
        for (var hor = 0; hor < this.xBound * 2; hor++) {
            var xToCheck = (this.x - this.xBound + hor);
            if (!collisionUp) {        //If this has already been flagged true, don't make it false again.
                collisionUp = ySpeed < 0 && CollisionAtPoint(xToCheck, (this.y - this.yBound) + ySpeed);
            }
            if (!collisionDown) {    //If this has already been flagged true, don't make it false again.
                collisionDown = ySpeed > 0 && CollisionAtPoint(xToCheck, (this.y + this.yBound) + ySpeed);
            }
        }
    }
    if (!checkCollisions || (!collisionLeft && !collisionRight && !collisionUp && !collisionDown)) {
        this.x += xSpeed;
        this.y += ySpeed;
    }
}
GameObject.prototype.Destroy = function () {
    this.End();
    delete R[R.currentRoom].objects[this.name];
}

function CollisionAtPoint (x, y) {
    var currentRoom = R[R.currentRoom];
    
    for (var obj in O) {
        var object = O[obj];
        if (object != this) {
            for (var i = 0; i < 2 * object.xBound; i++) {
                for (var j = 0; j < 2 * object.yBound; j++) {
                    var xToCheck = (object.x - object.xBound) + i;
                    var yToCheck = (object.y - object.yBound) + j;
                    
                    if (xToCheck == x && yToCheck == y)
                    {    //Check if the point lies inside the bounds of ANY object in the room.
                        if (object.solid) {    //If yes and if that object is flagged as solid, then there is a collision.
                            return true;
                        }
                    }
                }
            }
        }
    }
    
    return false;
}

//Animations Namespace
var Animations = window.Animations || {};
Animations.Add = function (name, width, height, columns, rows, speed, xOffset, yOffset) {
    if (typeof Animations[name] === 'undefined') {
        Animations[name] = new Animation(name, width, height, columns, rows, speed, xOffset, yOffset);
        return Animations[name];
    } else {
        console.log("An animation with the name \"" + name + "\" already exists!");
        return false;
    }
};
Animations.New = Animations.Add;
var A = window.Animations;

//Animation class (for use with sprite sheets)
function Animation (name, width, height, columns, rows, speed, xOffset, yOffset) {
    this.id = nextID++;
    
    columns = typeof columns !== 'undefined' ? columns : 1;
    rows = typeof rows !== 'undefined' ? rows : 1;
    speed = typeof speed !== 'undefined' ? speed : 1;
    xOffset = typeof xOffset !== 'undefined' ? xOffset : 0;
    yOffset = typeof yOffset !== 'undefined' ? yOffset : 0;
    
    speed = Math.clamp01(speed);    //Prevent animation mess-ups by preventing speeds higher than one.
    
    this.name = name;
    this.width = width;
    this.height = height;
    this.columns = columns;
    this.rows = rows;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.speed = speed;
}
Animation.prototype.type = "Animation";

function CreateObject (newObjectName, x, y, imageSrc, maskImageSrc, animationsArray) {
    //Create a new object inside the current rom and return it.
    if (newObjectName.type == "GameObject") {    //Create from prefabricated object
        var newID = nextID++;
        var newName = newObjectName.name + newID.toString();
        O[newName] = CopyObject(newObjectName, newID, newName);
        
        O[newName].x = x;
        O[newName].y = y;
        
        return O[newName];
    }
    else {
        if (O[newObjectName]) {
            console.log("Object with name \"" + newObjectName + "\" already exists in current room!");
            return false;
        }
        O[newObjectName] = new GameObject(newObjectName, x, y, imageSrc, maskImageSrc, animationsArray);
    }
    
    O[newObjectName].Start();
    
    return O[newObjectName];
}

function CopyObject (object, newID, newName) {
    var resultingCopy = {};
    if (newID != "identical") {
        resultingCopy.id = typeof newID !== 'undefined' ? newID : nextID++;
        resultingCopy.name = typeof newName !== 'undefined' ? newName : object.name + resultingCopy.id.toString();
    } else {    //If second argument is "identical" with quotes, then copy id and name, too.
        resultingCopy.id = object.id;
        resultingCopy.name = object.name;
    }
    //Copy GameObject-unique properties
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

var DEBUG = {
    DrawBoundingBox: function (object) {
        var fillStyle = context.fillStyle;
        context.fillStyle = "rgba(255, 0, 255, 0.5)";
        context.fillRect(object.x - object.xBound - camera.x, object.y - object.yBound - camera.y, object.xBound * 2, object.yBound * 2);
        context.fillStyle = fillStyle;
    },
    CountObjectsInRoom: function (roomName) {
        var roomInQuestion;
        var count = 0;
        if (typeof roomName !== 'undefined') {
            if (roomName.name) {
                roomInQuestion = roomName;
            } else {
                roomInQuestion = Rooms[roomName];
            }
        } else {
            roomInQuestion = Rooms[R.currentRoom];
        }
        for (objects in roomInQuestion.objects) {
            count++;
        }
        return count;
    },
    objectsOnScreen: 0,
    CountObjectsOnScreen: function () {return DEBUG.objectsOnScreen;},
    ListControls: function () {
        var numControls = 0;
        var numAxes = 0;
        var total = 0;
        
        for (control in Controls) {
            if (typeof Controls[control].Check !== 'undefined') {   //Only return values in Control that have Check(), i.e. controls & axes
                total++;
                var message = "C[\"" + control + "\"] "
                
                if (Controls[control].type == "Control") {
                    message += "(Control): " + C[control].keyName;
                    numControls++;
                }
                if (Controls[control].type == "Axis") {
                    message += "(Axis) Positive: " + C[control].positiveKeyName + ", Negative: " + C[control].negativeKeyName;
                    numAxes++;
                }
                
                console.log(message);
            }
        }
        
        console.log(numControls + " Controls and " + numAxes + " Axes.\n" + total + " in all");
    },
};

window.onload = function () {Initialize();};
function Initialize() {
    SetupCanvas();
    
    SetupControls();
    
    addScript("start.js", function(){
        start();
        SetupCamera();
        Frame();    //Only run the first frame after Start has been loaded.
    });
}

function SetupCanvas() {
    canvas = document.getElementById("game");
    if (canvas.getContext) {
        context = canvas.getContext("2d");
    } else {
        alert("No 2D Canvas Context for game.");
    }
    
    //Disable right click menu on canvas
    canvas.oncontextmenu = function() {return false;};
}

function SetupControls () {
    SetupMouseListeners();
    SetupKeyboardListeners();
}

function SetupMouseListeners () {    
    canvas.addEventListener("mousedown", function(e) {
        // Prevent 
        if(e.button === mouse.middleCode) {
            e.preventDefault();
        }
    }, false);
    
    canvas.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = (e.clientX - rect.left) + camera.x;
            mouse.y = (e.clientY - rect.top) + camera.y;
        }, false);
    canvas.addEventListener('mousedown', function (e){
            if (e.button === mouse.leftCode){
                if (!mouse.left) mouse.leftDown = true;
                mouse.left = true;
            }
            else if (e.button === mouse.middleCode) {
                e.preventDefault(); //Prevent browser from using the scroll wheel.
                
                if (!mouse.middle) mouse.middleDown = true;
                mouse.middle = true;
            }
            else if (e.button === mouse.rightCode){
                if (!mouse.right) mouse.rightDown = true;
                mouse.right = true;
            }
        }, false);
    canvas.addEventListener('mouseup', function (e){
            if (e.button === mouse.leftCode){
                mouse.left = false;
                mouse.leftUp = true;
            }
            else if (e.button === mouse.middleCode) {
                mouse.middle = false;
                mouse.middleUp = true;
            }
            else if (e.button === mouse.rightCode){
                mouse.right = false;
                mouse.rightUp = true;
            }
        }, false);
    //if mouse leaves the canvas, left, middle, and right click are unset.
    canvas.addEventListener('mouseout', function () {
            mouse.left = mouse.middle = mouse.right = false;
        }, false);
    
    //mouse wheel functionality
    canvas.addEventListener("mousewheel", MouseWheelHandler, false);
    canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false); //for (old?) Firefox
}

function SetupKeyboardListeners () {
    //Prevent scrolling with keys
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if([Keycode.left, Keycode.right, Keycode.up, Keycode.down, Keycode.space, Keycode.tab].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    
    document.addEventListener("keydown", function(e) {
        var thisKey = e.which;
        if (pressedKeys.indexOf(thisKey) == -1 && heldKeys.indexOf(thisKey) == -1) {
            pressedKeys.push(thisKey);
        }
        if (heldKeys.indexOf(thisKey) == -1) {
            heldKeys.push(thisKey);
        }
    }, false);
    document.addEventListener("keyup", function(e) {
        var thisKey = e.which;
        heldKeys.splice(heldKeys.indexOf(thisKey), 1);
        if (releasedKeys.indexOf(thisKey) == -1) {
            releasedKeys.push(thisKey);
        }
    }, false);
}

function SetupCamera () {
    canvas.width = camera.width;
    canvas.height = camera.height;
}

function Frame () {
    now = timestamp();
    dateTime = dateTime + Math.min(1, (now - lastFrame) / 1000);
    while (dateTime > step) {
        dateTime = dateTime - step;
        Update();
        Draw();
        EndFrame();
    }
    lastFrame = now;
    
    requestAnimationFrame(Frame);
}

function Update () {
    Controls.CheckAll();
    
    Rooms.AllBeforeDo();
    Rooms.AllDo();
    if (typeof Rooms[Rooms.currentRoom] !== 'undefined') {
        Rooms[Rooms.currentRoom].Update();
    } else {
        console.log("There is no current room. Please add one or make sure you are referencing the correct room with Rooms.SetRoom().");
    }
    
    Rooms.AllAfterDo();
    
    if (camera.following != "") {    //If the camera is following an object, keep the object within its borders.
        if (R[R.currentRoom].objects[camera.following].x - camera.x > camera.width - camera.hBorder) {
            camera.x = R[R.currentRoom].objects[camera.following].x - (camera.width - camera.hBorder);
        }
        if (R[R.currentRoom].objects[camera.following].x - camera.x < camera.hBorder) {
            camera.x = R[R.currentRoom].objects[camera.following].x - camera.hBorder;
        }
        if (R[R.currentRoom].objects[camera.following].y - camera.y > camera.height - camera.vBorder) {
            camera.y = R[R.currentRoom].objects[camera.following].y - (camera.height - camera.vBorder);
        }
        if (R[R.currentRoom].objects[camera.following].y - camera.y < camera.vBorder) {
            camera.y = R[R.currentRoom].objects[camera.following].y - camera.hBorder;
        }
    }
    
    //Don't let camera move past room boundaries.
    if (camera.x < 0) {
        camera.x = 0;
    }
    if (camera.x + camera.width > R.currentRoom.width) {
        camera.x = R[currentRoom].width - camera.width;
    }
    if (camera.y < 0) {
        camera.y = 0;
    }
    if (camera.y + camera.height > R.currentRoom.height) {
        camera.y = R[currentRoom].height - camera.height;
    }
}

function Draw () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    DEBUG.objectsOnScreen = 0;
    
    if (typeof Rooms[Rooms.currentRoom] !== 'undefined') {
        Rooms[Rooms.currentRoom].Draw();
    } else {
        console.log("There is no current room. Please add one or make sure you are referencing the correct room with Rooms.SetRoom().");
    }
}

function EndFrame () {
    mouse.wheel = 0;
    
    //Reset the presses/realeases of controls.
    mouse.leftDown = false;
    mouse.middleDown = false;
    mouse.rightDown = false;
    mouse.leftUp = false;
    mouse.middleUp = false;
    mouse.rightUp = false;
    pressedKeys = [];
    releasedKeys = [];
}

function getMousePos (canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left),
        y: (e.clientY - rect.top)
    };
}

function MouseWheelHandler (e) {
    //Prevent scrolling page when scrolling inside canvas.
    e.preventDefault();
    
    mouse.wheel = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));    //reverse Firefox’s detail value and return either 1 for up or -1 for down
}

function isOnCamera(x, y) {
    if (typeof y !== 'undefined') {    //If both are defined, then they are a point.
        if (x > camera.x && x < camera.x + camera.width
            && y > camera.y && y < camera.y + camera.height)
        {
            return true;
        } else {
            return false;
        }
    } else {        //if only one is defined, then it is an object
        var obj = x;
        if (obj.x + obj.xBound > camera.x && obj.x - obj.xBound < camera.x + camera.width
            && obj.y + obj.yBound > camera.y && obj.y - obj.yBound < camera.y + camera.height)
        {
            return true;
        } else {
            return false;
        }
    }
        
}

function addScript(pathToScript, mainFunction) {
    //You can either specify a main function or just make the main function within the script the same as the script's name (minus ".js")
    mainFunction = typeof mainFunction !== 'undefined' ? mainFunction : pathToScript.slice(((pathToScript.lastIndexOf("/")>-1)?pathToScript.lastIndexOf("/")+1:0), pathToScript.indexOf("."));
    var script = document.createElement('script');
    script.src = pathToScript;
    script.onload = function () {
        if (typeof mainFunction !== 'string') {
            mainFunction();
        } else {
            if (typeof window[mainFunction] === 'function') {
                window[mainFunction]();
            } else {
                console.log(mainFunction + " is not a function!");
            }
        }
    };
    document.body.appendChild(script);
}

//Detect Internet Explorer
function isInternetExplorer() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {        // If Internet Explorer, return true
        return true;
    } else {        // If another browser, return false
        return false;
    }
}

//Add more functionality to Math namespace
Math.clamp = function (value, min, max) {
    //Makes sure the value does not fall outide the min-max range
    //Usage: numberValue = Math.clamp(numberValue, 3, 10);
    //Handle Errors
    if (min == max) {
        console.log("Min and Max cannot be the same number!");
        return false;
    }
    if (min > max) {
        console.log("Min must be less than Max!");
        return false;
    }
    
    //clamp the value
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
};
Math.clamp01 = function (value) {
    //Makes sure the value does not fall outide the 0-1 range
    //Usage: numberValue = Math.clamp01(numberValue);
    
    //clamp the value
    if (value < 0) {
        value = 0;
    }
    if (value > 1) {
        value = 1;
    }
    return value;
};
Math.clampAngle = function (value, min, max) {
    //Returns the given numberValue as an angle 0 and 360
    //Usage: numberValue = Math.clampAngle(numberValue, 0, 180);
    //Alternate: numberValue = Math.clampAngle(numberValue);
    
    //Make sure angle is between 0 and 360
    while (value >= 360) {
        value -= 360;
    }
    while (value < 0) {
        value += 360;
    }
    
    if (typeof min !== 'undefined' && typeof max !== 'undefined') {
        //Adjust min and max values to be between 0 and 360
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
        //Handle Errors
        if (min == max) {
            console.log("Min and Max cannot be the same number!");
            return false;
        }
        if (min > max) {
            console.log("Min must be less than Max!");
            return false;
        }
        
        //clamp the value
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
    }
    return value;
};