/** The main namespace that acts as a container for everything that the game engine has to offer.
 * 
 * Conveniently aliased with `{@link OS}`, for example
 * 
 * ```
 * {@link OS}.SetCamera({ width: 600, height: 400 });
 * ```
 * 
 * is the same as
 * 
 * ```
 * {@link Oversimplified.SetCamera}({ width: 600, height: 400 });
 * ```
 * @namespace
 */
var Oversimplified = {};

/** A convenient alias for {@link Oversimplified}.
 * 
 * _Anywhere_ you might type `Oversimplified`, you can substitute `OS` instead to save some typing.
 * @namespace
 * @see {@link Oversimplified}
 */
var OS = Oversimplified;

/** _NOT FOR REGULAR USE._ Stores the HTML5 canvas element in `index.html` with the id of `game`.
 * @type {(HTMLCanvasElement|null)}
 * @restricted
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement|HTMLCanvasElement}
 */
Oversimplified.canvas = null;

/** Stores the HTML5 canvas context of {@link Oversimplified.canvas}.
 * @type {(CanvasRenderingContext2D|null)}
 * @readonly
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D|CanvasRenderingContext2D}
 */
Oversimplified.context = null;

/** Stores the next ID value to use when creating any Oversimplified object.
 * @type {number}
 * @restricted
 */
Oversimplified.nextID = 0;

/** Stores the paths of scripts that have been added via {@link Oversimplified.AddScript} need to load.
 * @type {string[]}
 * @readonly
 * @see {@link Oversimplified.AddScript}
 * @see {@link Oversimplified.loadedScripts}
 * @see {@link Oversimplified.numberOfScriptsToLoad}
 */
Oversimplified.loadingScripts = [];

/** Stores the paths of scripts that have been loaded via {@link Oversimplified.AddScript}.
 * @type {string[]}
 * @readonly
 * @see {@link Oversimplified.AddScript}
 * @see {@link Oversimplified.loadingScripts}
 * @see {@link Oversimplified.numberOfScriptsToLoad}
 */
Oversimplified.loadedScripts = [];

/** Stores the number of scripts that have been referenced via {@link Oversimplified.AddScript}.
 * @type {number}
 * @readonly
 * @see {@link Oversimplified.AddScript}
 * @see {@link Oversimplified.loadingScripts}
 * @see {@link Oversimplified.loadedScripts}
 */
Oversimplified.numberOfScriptsToLoad = 0;

/** An empty image to use as reference when no images are provided for a {@link Oversimplified.GameObject}
 * @type {Image}
 * @property {string} src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
 * @property {number} width=1
 * @property {number} height=1
 * @readonly
 */
Oversimplified.emptyImage = new Image();
Oversimplified.emptyImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
Oversimplified.emptyImage.width = 1;
Oversimplified.emptyImage.height = 1;



/** Stores various settings. Maybe you can make good use of it for your own game settings, so long as you don't overwrite the existing values.
 *
 * Conveniently aliased with `{@link OS.S}`, for example
 * 
 * ```
 * {@link OS.S}.loadingBar = false;
 * ```
 * is the same as
 * 
 * ```
 * {@link Oversimplified.Settings}.loadingBar = false;
 * ```
 * @namespace
 * @property {number} defaultStep=1/3 - The default frame speed for {@link Oversimplified.Room|Rooms}. Represents the number of seconds that pass before the next frame plays.
 * @property {(Object|false)} loadingBar - The style values for the loading bar that appears when scripts are being loaded.
 * 
 * Can be set to `false` to disable the loading bar completely and just show a blank screen when loading is happening instead.
 * @property {string} loadingBar.fillColor="#DD5511" - The color hex (including `#`) of the loading bar that fills in the outlined space.
 * @property {string} loadingBar.outlineColor="#882200" - The color hex (including `#`) of the outline that surrounds the loading bar.
 * @property {number} loadingBar.outlineWidth=5 - The number of pixels that the loading bar's outline has.
 * @property {number} soundVolume=0.75 - The level of volume between 0 and 1 that {@link Oversimplified.Sound|Sounds} play at.
 * @property {number} musicVolume=0.75 - The level of volume between 0 and 1 that {@link Oversimplified.Tune|Tunes} play at.
 * @property {boolean} preventRightClick=true - Whether or not to allow people viewing your game to right click the canvas.
 */
Oversimplified.Settings = {
    defaultStep: 1 / 30,
    loadingBar: {
        fillColor: "#DD5511",
        outlineColor: "#882200",
        outlineWidth: 5,
    },
    soundVolume: 0.75,
    musicVolume: 0.75,
    preventRightClick: true
}

/** A convenient alias for {@link Oversimplified.Settings}.
 * 
 * _Anywhere_ you might type `Oversimplified.Settings`, you can substitute `OS.S` instead to save some typing.
 * @namespace
 * @alias OS.S
 * @see {@link Oversimplified.Settings}
 */
Oversimplified.S = Oversimplified.Settings;



/** Gets the current timestamp for internally tracking steps in the {@link Oversimplified.Frame|Frame}.
 * @function
 * @returns {number}
 */
Oversimplified.timestamp = function() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

/** Stores the timestamp for the {@link Oversimplified.Frame|Frame} before performing its actions.
 * @type {number}
 * @restricted
 */
Oversimplified.now = null;

/** Used to track whether to run {@link Oversimplified.Frame|Frame} based on its relation to the step speed.
 * @type {number}
 * @restricted
 */
Oversimplified.dateTime = 0;

/** Stores the timestamp for the previous {@link Oversimplified.Frame|Frame}.
 * @type {number}
 * @restricted
 */
Oversimplified.lastFrame = Oversimplified.timestamp();

/** The fraction of a second between each {@link Oversimplified.Frame|Frame}.
 * For example, if the step is `1/30`, then one 30th of a second passes each frame.
 * 
 * This value is updated based on the current {@link Oversimplified.Room|Room}'s step. If it does not match
 * the current room's step, the room's {@link Oversimplified.Room#Update} method will change it to match.
 * @type {number}
 * @readonly
 * @default {@link Oversimplified.Settings}.defaultStep
 */
Oversimplified.step = Oversimplified.Settings.defaultStep;



/** The camera defines the size of the canvas and the viewport of the current {@link Oversimplified.Room|Room}.
 * If it is smaller than the current room, then it will only display what is visible within the area of the camera.
 * 
 * Intended only to be manipulated via the {@link Oversimplified.SetCamera} method.
 * 
 * Also accessible via `{@link OS}.camera`.
 * @namespace
 * @property {number} x - The x position of the top left corner of the camera within the current {@link Oversimplified.Room|Room}.
 * @property {number} y - The y position of the top left corner of the camera within the current {@link Oversimplified.Room|Room}.
 * @property {number} width=640 - The width of the HTML5 canvas and of the visible portion of the current {@link Oversimplified.Room|Room}.
 * @property {number} height=480 - The height of the HTML5 canvas and of the visible portion of the current {@link Oversimplified.Room|Room}.
 * @property {string} following="" - The `name` of the {@link Oversimplified.GameObject|GameObject} that the camera is following within the current {@link Oversimplified.Room|Room}
 * @property {number} hBorder=64 - The number of pixels away from the camera's edge horizontally that the {@link Oversimplified.GameObject|GameObject} being followed via `following` must be before the camera scrolls.
 * @property {number} vBorder=64 - The number of pixels away from the camera's edge vertically that the {@link Oversimplified.GameObject|GameObject} being followed via `following` must be before the camera scrolls.
 * @see {@link Oversimplified.SetCamera}
 */
Oversimplified.camera = {
    x: 0,
    y: 0,
    width: 640,
    height: 480,
    following: "",
    hBorder: 64,
    vBorder: 64,

    /** Set the object for the camera to follow.
     * @function
     * @param {Oversimplified.GameObject} object - The GameObject to follow in the current room.
     * 
     * Takes only the `name` and sets the `{@link Oversimplified.camera}.following` property.
     */
    Follow: function (object) {
        this.following = object.name;
    }
}

/** Set up {@link Oversimplified.camera}.
 *
 * It is important that this is done first at the time the game is loaded because this determines the size of the HTML5 canvas.
 * Be sure that the objectToFollow has already been created in the current room. Can be referenced with a variable.
 * objectToFollow, hBorder, and vBorder are optional arguments, but if you want to set hBorder and vBorder, there must be an options.objectToFollow.
 * @function
 * @param {Object} options
 * @param {number} [options.width=Oversimplified.camera.width] - The width specified here will set the width of the HTML5 canvas.
 * @param {number} [options.height=Oversimplified.camera.width] - The height specified here will set the height of the HTML5 canvas.
 * @param {number} [options.x=Oversimplified.camera.x] - The x position of the top left corner of the camera within the current room.
 * @param {number} [options.y=Oversimplified.camera.y] - The y position of the top left corner of the camera within the current room.
 * @param {Oversimplified.GameObject} [options.objectToFollow] - A reference to an OversimplifiedJS GameObject. Runs {@link Oversimplified.camera.Follow} to set the {@link Oversimplified.camera|camera}'s `following` property.
 * @param {number} [options.hBorder=Oversimplified.camera.hBorder] - The number of pixels away from the camera's edge horizontally that the options.objectToFollow must be before the camera scrolls.
 * @param {number} [options.vBorder=Oversimplified.camera.vBorder] - The number of pixels away from the camera's edge vertically that the options.objectToFollow must be before the camera scrolls.
 * @example
 * var obj_player = rm_Default.AddObject("Player", { x: 10, y: 10, imageSrc: "path/to/image", });
 * OS.SetCamera({
 *     width: 500,
 *     height: 200,
 *     x: 0,
 *     y: 0,
 *     objectToFollow: obj_player,
 *     hBorder: 100,
 *     vBorder: 50,
 * });
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



/** Stores data about the mouse and touch information.
 * 
 * Touches emulate mouse buttons:
 * 
 * * 1 finger = left mouse
 * * 2 fingers = right mouse
 * * 3 fingers = middle mouse)
 * @namespace
 * @readonly
 * @property {number} x - The x position of the mouse relative to the top left corner of the canvas.
 * @property {number} y - The y position of the mouse relative to the top left corner of the canvas.
 * @property {number} leftCode - The event code of the left mouse button for internal use.
 * 
 * Set dependent upon whether the browser is Internet Explorer or not.
 * @property {number} middleCode - The event code of the middle mouse button for internal use.
 * 
 * Set dependent upon whether the browser is Internet Explorer or not.
 * @property {number} rightCode - The event code of the right mouse button for internal use.
 * @property {boolean} leftDown - Whether the left mouse button has been clicked this {@link Oversimplified.Frame|Frame}.
 * 
 * Only returns true during the frame it was clicked down.
 * @property {boolean} left - Whether the left mouse button is held.
 * @property {boolean} leftUp - Whether the left mouse button has been released this {@link Oversimplified.Frame|Frame}.
 * 
 * Only returns true during the frame it was unclicked.
 * @property {boolean} middleDown - Whether the middle mouse button has been clicked this {@link Oversimplified.Frame|Frame}.
 * 
 * Only returns true during the frame it was clicked down.
 * @property {boolean} middle - Whether the middle mouse button is held.
 * @property {boolean} middleUp - Whether the middle mouse button has been released this {@link Oversimplified.Frame|Frame}.
 * 
 * Only returns true during the frame it was unclicked.
 * @property {boolean} rightDown - Whether the right mouse button has been clicked this {@link Oversimplified.Frame|Frame}.
 * 
 * Only returns true during the frame it was clicked down.
 * @property {boolean} right - Whether the right mouse button is held.
 * @property {boolean} rightUp - Whether the right mouse button has been released this {@link Oversimplified.Frame|Frame}.
 * 
 * Only returns true during the frame it was unclicked.
 * @property {number} wheel - Returns the direction that the scroll wheel was moved this {@link Oversimplified.Frame|Frame}:
 *
 * * 0 if it has not been moved,
 * * 1 if it was moved up, or
 * * -1 if it was moved down.
 */
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



/** Lists any keycodes for keys that are being held down.
 * @type {number[]}
 * @readonly
 */
Oversimplified.heldKeys = [];
/** Lists any keycodes for keys that have been pressed down this {@link Oversimplified.Frame|Frame}.
 * @type {number[]}
 * @readonly
 */
Oversimplified.pressedKeys = [];
 /** Lists any keycodes for keys that have been released this {@link Oversimplified.Frame|Frame}.
  * @type {number[]}
  * @readonly
  */
Oversimplified.releasedKeys = [];

/**
 * @namespace
 * @readonly
 * @see {@link Oversimplified.Keycode}
 * @description
 * Stores the key name by keycode. The keycode captured by a JavaScript `event` is what will be used to get the name of the key.
 * Mostly just used internally, but it can be handy to have if you're working with JavaScript `events` involving keystrokes.
 * 
 * keycode | key name
 * --- | ---
 * `37` | `"left arrow"`
 * `38` | `"up arrow"`
 * `39` | `"right arrow"`
 * `40` | `"down arrow"`
 * `48` | `"0"`
 * `49` | `"1"`
 * `50` | `"2"`
 * `51` | `"3"`
 * `52` | `"4"`
 * `53` | `"5"`
 * `54` | `"6"`
 * `55` | `"7"`
 * `56` | `"8"`
 * `57` | `"9"`
 * `65` | `"a"`
 * `66` | `"b"`
 * `67` | `"c"`
 * `68` | `"d"`
 * `69` | `"e"`
 * `70` | `"f"`
 * `71` | `"g"`
 * `72` | `"h"`
 * `73` | `"i"`
 * `74` | `"j"`
 * `75` | `"k"`
 * `76` | `"l"`
 * `77` | `"m"`
 * `78` | `"n"`
 * `79` | `"o"`
 * `80` | `"p"`
 * `81` | `"q"`
 * `82` | `"r"`
 * `83` | `"s"`
 * `84` | `"t"`
 * `85` | `"u"`
 * `86` | `"v"`
 * `87` | `"w"`
 * `88` | `"x"`
 * `89` | `"y"`
 * `90` | `"z"`
 * `13` | `"enter"`
 * `16` | `"shift"`
 * `17` | `"ctrl"`
 * `18` | `"alt"`
 * `8` | `"backspace"`
 * `9` | `"tab"`
 * `19` | `"pause"`
 * `20` | `"caps lock"`
 * `27` | `"escape"`
 * `32` | `"space"`
 * `33` | `"page up"`
 * `34` | `"page down"`
 * `35` | `"end"`
 * `45` | `"insert"`
 * `46` | `"delete"`
 * `91` | `"left special key"`
 * `92` | `"right special key"`
 * `93` | `"select key"`
 * `96` | `"numpad 0"`
 * `97` | `"numpad 1"`
 * `98` | `"numpad 2"`
 * `99` | `"numpad 3"`
 * `100` | `"numpad 4"`
 * `101` | `"numpad 5"`
 * `102` | `"numpad 6"`
 * `103` | `"numpad 7"`
 * `104` | `"numpad 8"`
 * `105` | `"numpad 9"`
 * `106` | `"numpad asterisk"`
 * `107` | `"numpad plus"`
 * `109` | `"numpad dash"`
 * `110` | `"numpad period"`
 * `111` | `"numpad slash"`
 * `112` | `"f1"`
 * `113` | `"f2"`
 * `114` | `"f3"`
 * `115` | `"f4"`
 * `116` | `"f5"`
 * `117` | `"f6"`
 * `118` | `"f7"`
 * `119` | `"f8"`
 * `120` | `"f9"`
 * `121` | `"f10"`
 * `122` | `"f11"`
 * `123` | `"f12"`
 * `144` | `"num lock"`
 * `145` | `"scroll lock"`
 * `186` | `"semicolon"`
 * `187` | `"equal"`
 * `188` | `"comma"`
 * `189` | `"dash"`
 * `190` | `"period"`
 * `191` | `"slash"`
 * `192` | `"grave accent"`
 * `219` | `"open bracket"`
 * `220` | `"backslash"`
 * `221` | `"close bracket"`
 * `222` | `"quote`
 * @example
 * var leftArrowKeyName = Oversimplified.Keycode[37];
 * console.log(leftArrowKeyName);   // Returns "left arrow"
 */
Oversimplified.Key = {
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
    37: "left arrow",
    38: "up arrow",
    39: "right arrow",
    40: "down arrow",
    45: "insert",
    46: "delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "left special key",
    92: "right special key",
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

/**
 * @namespace
 * @readonly
 * @see {@link Oversimplified.Key}
 * @description
 * Stores the keycode name by key name. The keycode captured by a JavaScript `event` is what is returned by the key name.
 * Used for creating new {@link Oversimplified.Control|Control}s using the {@link Oversimplified.Controls.Add} method.
 *
 * key name | keycode
 * --- | ---
 * `"left arrow"` | `37`
 * `"up arrow"` | `38`
 * `"right arrow"` | `39`
 * `"down arrow"` | `40`
 * `"0"` | `48`
 * `"1"` | `49`
 * `"2"` | `50`
 * `"3"` | `51`
 * `"4"` | `52`
 * `"5"` | `53`
 * `"6"` | `54`
 * `"7"` | `55`
 * `"8"` | `56`
 * `"9"` | `57`
 * `"a"` | `65`
 * `"b"` | `66`
 * `"c"` | `67`
 * `"d"` | `68`
 * `"e"` | `69`
 * `"f"` | `70`
 * `"g"` | `71`
 * `"h"` | `72`
 * `"i"` | `73`
 * `"j"` | `74`
 * `"k"` | `75`
 * `"l"` | `76`
 * `"m"` | `77`
 * `"n"` | `78`
 * `"o"` | `79`
 * `"p"` | `80`
 * `"q"` | `81`
 * `"r"` | `82`
 * `"s"` | `83`
 * `"t"` | `84`
 * `"u"` | `85`
 * `"v"` | `86`
 * `"w"` | `87`
 * `"x"` | `88`
 * `"y"` | `89`
 * `"z"` | `90`
 * `"enter"` | `13`
 * `"shift"` | `16`
 * `"ctrl"` | `17`
 * `"alt"` | `18`
 * `"backspace"` | `8`
 * `"tab"` | `9`
 * `"pause"` | `19`
 * `"caps lock"` | `20`
 * `"escape"` | `27`
 * `"space"` | `32`
 * `"page up"` | `33`
 * `"page down"` | `34`
 * `"end"` | `35`
 * `"insert"` | `45`
 * `"delete"` | `46`
 * `"left special key"` | `91`
 * `"right special key"` | `92`
 * `"select key"` | `93`
 * `"numpad 0"` | `96`
 * `"numpad 1"` | `97`
 * `"numpad 2"` | `98`
 * `"numpad 3"` | `99`
 * `"numpad 4"` | `100`
 * `"numpad 5"` | `101`
 * `"numpad 6"` | `102`
 * `"numpad 7"` | `103`
 * `"numpad 8"` | `104`
 * `"numpad 9"` | `105`
 * `"numpad asterisk"` | `106`
 * `"numpad plus"` | `107`
 * `"numpad dash"` | `109`
 * `"numpad period"` | `110`
 * `"numpad slash"` | `111`
 * `"f1"` | `112`
 * `"f2"` | `113`
 * `"f3"` | `114`
 * `"f4"` | `115`
 * `"f5"` | `116`
 * `"f6"` | `117`
 * `"f7"` | `118`
 * `"f8"` | `119`
 * `"f9"` | `120`
 * `"f10"` | `121`
 * `"f11"` | `122`
 * `"f12"` | `123`
 * `"num lock"` | `144`
 * `"scroll lock"` | `145`
 * `"semicolon"` | `186`
 * `"equal"` | `187`
 * `"comma"` | `188`
 * `"dash"` | `189`
 * `"period"` | `190`
 * `"slash"` | `191`
 * `"grave accent"` | `192`
 * `"open bracket"` | `219`
 * `"backslash"` | `220`
 * `"close bracket"` | `221`
 * `"quote` | `222`
 * @example
 * var leftArrowKeycode = Oversimplified.Keycode["left arrow"];
 * console.log(leftArrowKeycode);   // Returns 37
 * 
 * // If using the number row numbers, don't forget to wrap the number in quotes!
 * var threeKeycode = OS.Keycode["3"]   // threeKeycode === 51
 * // NOT like this: OS.Keycode[3]
 */
Oversimplified.Keycode = {}
for (var keyCode in Oversimplified.Keys) {
    Oversimplified.Keycode[Oversimplified.Keys[keyCode]] = keyCode;
}



/** Stores all of the keyboard-based controls that you specify for your game.
 * 
  * Conveniently aliased with `OS.C`, for example `OS.C.Add("Jump", OS.Keycode["z"]);` is
 * the same as `Oversimplified.Controls.Add("Jump", Oversimplified.Keycode["z"]);`
 * @namespace
 */
Oversimplified.Controls = {};

/** A convenient alias for {@link Oversimplified.Controls}.
 * 
 * _Anywhere_ you might type `Oversimplified.Controls`, you can substitute `OS.C` instead to save some typing.
 * @namespace
 * @alias OS.C
 * @see {@link Oversimplified.Controls}
 */
Oversimplified.C = Oversimplified.Controls;

/** Add either an Axis or a Control to the collection of Controls with the name `name`.
 * 
 * If both `positiveKeycode` and `negativeKeycode` are specified, an {@link Oversimplified.Axis|Axis} is created,
 * but if only `positiveKeycode` is specified, then a {@link Oversimplified.Control|Control} is created.
 * 
 * This function is also available as `Oversimplified.Controls.New`, so you can use whichever you prefer.
 * @generator
 * @param {string} name - The name of the control for accessing it later.
 * @param {number} positiveKeycode - The keycode value of the key that will trigger the created {@link Oversimplified.Control|Control}.
 * @param {number} negativeKeycode - The keycode value of the key that will trigger the negative value of the created {@link Oversimplified.Axis|Axis}.
 * @yields {(Oversimplified.Control|Oversimplified.Axis)}
 * @example
 * // Jumping and attacking are actions that you might want to know how the player pressed the button.
 * var ct_jump = Oversimplified.Controls.Add("Jump", OS.Keycode["z"]);
 * var ct_attack = OS.C.New("Duck", OS.Keycode["x"]);	// OS.C.New is an alias of OS.C.Add and can be used if you prefer.
 *
 * // Horizontal and vertical movement would be useful to have just a positive or negative value for so you can easily move based on speed, for example.
 * var ax_horizontal = OS.C.Add("Horizontal", OS.Keycode["right arrow"], OS.Keycode["left arrow"]);
 * var ax_vertical = OS.C.New("Vertical", OS.Keycode["down arrow"], OS.Keycode["up arrow"]);
 */
Oversimplified.Controls.Add = function(name, positiveKeycode, negativeKeycode) {
    if (typeof negativeKeycode !== 'undefined') {
        Oversimplified.Controls[name] = new Oversimplified.Axis(positiveKeycode, negativeKeycode);
    } else {
        Oversimplified.Controls[name] = new Oversimplified.Control(positiveKeycode);
    }
    return Oversimplified.Controls[name];
};

// Alias for Oversimplified.Controls.Add()
Oversimplified.Controls.New = Oversimplified.Controls.Add;

/** Internal function that checks each created {@link Oversimplified.Control} every {@link Oversimplified.Frame|Frame} for presses, releases, and holds.
 * @function
 * @restricted
 */
Oversimplified.Controls.CheckAll = function () {
    for (var control in Oversimplified.Controls) {
        if (typeof Oversimplified.Controls[control].Check !== 'undefined') {
            Oversimplified.Controls[control].Check();
        }
    }
};

// Control Class
/** Creates a new single-key control.
 * @class
 * @param {number} keycode - The keycode value of the key to be tracked
 * @classdesc
 * Stores information about the status of a specified key.
 * 
 * Access using {@link Oversimplified.Controls.Add}.
 * @example
 * // This will create a new `Control` and store it in `Oversimplified.Controls` under the name "Jump".
 * var ct_jump = Oversimplified.Controls.Add("Jump", OS.Keycode["z"]);
 * // Pressing and holding the `Z` key will cause both `ct_jump.pressed` and `ct_jump.down` to equal `true` for one frame
 * // and will set `ct_jump.held` to equal `true` until the `Z` key is released.
 * // When it is released, `ct_jump.released` and ct_jump.up` will both equal `true` for one frame.
 */
Oversimplified.Control = function (keycode) {
    keycode = keycode.toLowerCase();
    
    /** The keycode value of this Control.
     * @instance
     * @type {number}
     * @readonly
     */
    this.keyCode = keycode;

    /** The key name of this Control.
     * @instance
     * @type {string}
     * @readonly
     */
    this.keyName = Oversimplified.Key[keycode];
    
    /** Whether this Control's key was pressed during the current {@link Oversimplified.Frame|Frame}.
     * 
     * Also accessible via `{@link Oversimplified.Control#pressed}`.
     * @instance
     * @type {boolean}
     * @readonly
     */
    this.down = false;
    
    /** Whether this Control's key was pressed during the current {@link Oversimplified.Frame|Frame}.
     * 
     * Also accessible via `{@link Oversimplified.Control#down}`.
     * @instance
     * @type {boolean}
     * @readonly
     */
    this.pressed = false;
    
    /** Whether this Control's key is currently being held down.
     * @instance
     * @type {boolean}
     * @readonly
     */
    this.held = false;
    
    /** Whether this Control's key was released during the current {@link Oversimplified.Frame|Frame}.
     * 
     * Also accessible via `{@link Oversimplified.Control#released}`.
     * @instance
     * @type {boolean}
     * @readonly
     */
    this.up = false;
    
    /** Whether this Control's key was released during the current {@link Oversimplified.Frame|Frame}.
     * 
     * Also accessible via `{@link Oversimplified.Control#up}`.
     * @instance
     * @type {boolean}
     * @readonly
     */
    this.released = false;
}

/** Identifies that this object is a `Control`
 * @type {string}
 * @readonly
 * @default "Control"
 */
Oversimplified.Control.prototype.type = "Control";

/** Internal function that updates the status of the Control.
 * 
 * This is run automatically during each {@link Oversimplified.Frame|Frame} through {@link Oversimplified.Controls.CheckAll};
 * @function
 * @restricted
 */
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
/** Creates a new two-key control.
 * @class
 * @param {number} positiveKeycode - The keycode value of the key that will return a positive direction when held.
 * @param {number} negativeKeycode - The keycode value of the key that will return a negative direction when held.
 * @classdesc
 * Provides a way to tie two keys together such that holding one will return a positive `{@link Oversimplified.Axis#direction|direction}`
 * while the other returns a negative value. When neither or both of the specified keys are held, the `direction` will return 0.
 * 
 * Access using {@link Oversimplified.Controls.Add}.
 * @example
 * // This will create a new `Axis` and store it in `Oversimplified.Controls` under the name "Horizontal".
 * var ax_horizontal = Oversimplified.Controls.Add("Horizontal", OS.Keycode["right arrow"], OS.Keycode["left arrow"]);
 * // When neither of the specified keys are pressed, `ct_jump.direction` equals `0`.
 * // Pressing and holding the `right arrow` key will cause `ct_jump.direction` to equal `1` until the key is released.
 * // Pressing and holding the `left arrow` key will cause `ct_jump.direction` to equal `-1` until the key is released.
 * // But if both `right arrow` and `left arrow` are pressed and held at the same time, `ct_jump.direction` will equal `0`.
 */
Oversimplified.Axis = function (positiveKeycode, negativeKeycode) {
    //Keeps track of a direction, either -1, 0, or 1
    positiveKeycode = positiveKeycode.toLowerCase();
    negativeKeycode = negativeKeycode.toLowerCase();

    /** The keycode value of this Axis that will return `1` when held.
     * @instance
     * @type {number}
     * @readonly
     */
    this.positiveKeycode = positiveKeycode;

    /** The key name of the positive key for this Axis.
     * @instance
     * @type {string}
     * @readonly
     */
    this.positiveKeyName = Oversimplified.Key[positiveKeycode];
    
    /** The keycode value of this Axis that will return `-1` when held.
     * @instance
     * @type {number}
     * @readonly
     */
    this.negativeKeycode = negativeKeycode;

    /** The key name of the negative key for this Axis.
     * @instance
     * @type {string}
     * @readonly
     */
    this.negativeKeyName = Oversimplified.Key[negativeKeycode];
    
    /** Returns one of `0`, `-1`, or `1` depending upon which of the Axis keys are pressed.
     * @instance
     * @type {number}
     * @readonly
     */
    this.direction = 0;
}

/** Identifies that this object is an `Axis`
 * @type {string}
 * @readonly
 * @default "Axis"
 */
Oversimplified.Axis.prototype.type = "Axis";

/** Internal function that updates the status of the Axis.
 * 
 * This is run automatically during each {@link Oversimplified.Frame|Frame} through {@link Oversimplified.Controls.CheckAll};
 * @function
 * @restricted
 */
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
/** Where {@link Oversimplified.Room|Rooms} are created and stored.
 * 
 * Conveniently aliased with `{@link OS.R}`, for example
 * 
 * ```
 * OS.R.Add("Default");
 * ```
 * 
 * is the same as 
 * 
 * ```
 * Oversimplified.Rooms.Add("Default");
 * ```
 * @namespace
 */
Oversimplified.Rooms = {
    /** The name of the currently displayed {@link Oversimplified.Room|Room}
     * @type {string}
     * @readonly
     * @default "Default"
     */
    currentRoomName: "Default",

    /** A function that you can use to do something before anything else happens during a {@link Oversimplified.Room|Room}'s
     * {@link Oversimplified.Frame|Frame} loop. This function will always run first during the frame, before any other
     * specified `BeforeDo()` in the current room, and even before this namespace's `AllDo()` method, if one exists.
     * @function
     * @abstract
     * @default an empty Function
     */
    AllBeforeDo: function () {},

    /** A function that you can use to do something before anything else happens during a {@link Oversimplified.Room|Room}'s
     * {@link Oversimplified.Frame|Frame} loop. This function will always run before any other specified `BeforeDo()` in
     * the current room, but _after_ this namespace's `AllBeforeDo()` method, if one exists.
     * @function
     * @abstract
     * @default an empty Function
     */
    AllDo: function () {},

    /** A function that you can use to do something after anything else happens during a {@link Oversimplified.Room|Room}'s
     * {@link Oversimplified.Frame|Frame} loop. This function will _always run last_, after any other specified `AfterDo()`
     * in the current room.
     * @function
     * @abstract
     * @default an empty Function
     */
    AllAfterDo: function () {}
}

/** A convenient alias for {@link Oversimplified.Rooms}.
 *
 * _Anywhere_ you might type `Oversimplified.Rooms`, you can substitute `OS.R` instead to save some typing.
 * @namespace
 * @alias OS.R
 * @see {@link Oversimplified.Rooms}
 */
Oversimplified.R = Oversimplified.Rooms;

/** A convenient alias for accessing the objects in the current {@link Oversimplified.Room|Room}. Every time
 * the room is set via {@link Oversimplified.SetRoom}, `Oversimplified.O` updates to reference the specified
 * room's `objects`.
 *
 * _Anywhere_ you might type `{@link Oversimplified.Rooms.Current}().objects`, you can substitute `OS.O`
 * instead to save some typing.
 * @memberof Oversimplified
 * @see {@link Oversimplified.Rooms.Current}
 * @see {@link Oversimplified.Room#objects}
 */
Oversimplified.O = null;

/** Returns the current {@link Oversimplified.Room|Room}.
 * @function
 */
Oversimplified.Rooms.Current = function () {
    return Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName];
}

/** Add a {@link Oversimplified.Room|Room} to the collection of Rooms with the name `name`.
 *
 * This function is also available as `Oversimplified.Rooms.New`, so you can use whichever you prefer.
 * @function
 * @param {string} name - The name of the room that will be used to store and access the created room.
 * @param {Object} [options]
 * @param {number} [options.width={@link Oversimplified.camera}.width] - Sets the width of the room. The camera will not travel beyond this when moving right. If it is larger than the camera's width and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's width, it will be set to the camera's width.
 * @param {number} [options.height={@link Oversimplified.camera}.height] - Sets the height of the room. The camera will not travel beyond this when moving down. If it is larger than the camera's height and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's height, it will be set to the camera's height.
 * @param {string} [options.backgroundSrc=""] - The path to the image that will be displayed as the room's background. If excluded or set to empty string (""), no background will show.
 * @param {number} [options.stepSpeed={@link Oversimplified.Settings}.defaultStep] - The step speed for the Room. If excluded or set to 0, the default is used.
 * @param {boolean} [options.backgroundSize] - When `true`, sets the room size to whatever the backgroundSrc image size is, ignoring anything specified in `width` and `height`.
 * @param {string} [options.backgrounColor] - Any hex color value. Sets the far background color (behind the background image, visible only if transparent or excluded). A JavaScript alternative to setting the HTML5 canvas's background color CSS.
 * @param {string} [optoins.foreground] - Path to any image file, though `.png` or `.gif` file with transparency is ideal. Sets the foreground image that displays over the background and all objects in the room. Appears below the Room's {@link Oversimplified.Room#DrawAbove|DrawAbove()} function but above any GameObject's {@link Oversimplified.GameObject#DrawAbove|DrawAbove()} function.
 */
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

/** Creates a new Room with the name `name`.
 *
 * This function is also available as `Oversimplified.Rooms.New`, so you can use whichever you prefer.
 * @class
 * @classdesc Rooms are important containers that store, process, and display {@link Oversimplified.GameObject|GameObjects}. Each
 * Room has its own size (defaults to the size of {@link Oversimplified.camera} if none is specified) and process within {@link Oversimplified.Frame},
 * and only the Room that it identified within `{@link Oversimplified.Rooms}.currentRoom` has its process run.
 * 
 * Access using {@link Oversimplified.Rooms.Add}.
 * @param {string} name - The name of the room that will be used to store and access the created room.
 * @param {Object} options
 * @param {number} [options.width={@link Oversimplified.camera|OS.camera}.width] - Sets the width of the room. The camera will not travel beyond this when moving right. If it is larger than the camera's width and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's width, it will be set to the camera's width.
 * @param {number} [options.height={@link Oversimplified.camera|OS.camera}.height] - Sets the height of the room. The camera will not travel beyond this when moving down. If it is larger than the camera's height and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's height, it will be set to the camera's height.
 * @param {string} [options.backgroundSrc=""] - The path to the image that will be displayed as the room's background. If excluded or set to empty string (""), no background will show.
 * @param {number} [options.stepSpeed={@link Oversimplified.Settings|OS.S}.defaultStep] - The step speed for the Room. If excluded or set to 0, the default is used.
 * @param {boolean} [options.backgroundSize] - When `true`, sets the room size to whatever the backgroundSrc image size is, ignoring anything specified in `width` and `height`.
 * @param {string} [options.backgrounColor] - Any hex color value. Sets the far background color (behind the background image, visible only if transparent or excluded). A JavaScript alternative to setting the HTML5 canvas's background color CSS.
 * @param {string} [options.foreground] - Path to any image file, though `.png` or `.gif` file with transparency is ideal. Sets the foreground image that displays over the background and all objects in the room. Appears below the Room's {@link Oversimplified.Room#DrawAbove|DrawAbove()} function but above any GameObject's {@link Oversimplified.GameObject#DrawAbove|DrawAbove()} function.
 * @param {any} [options....] - Any additional parameter passed in the `options` will be added directly to the resulting Room.
 */
Oversimplified.Room = function (name, options) {
    /** The internal ID of this Room.
     * @instance
     * @type {number}
     * @readonly
     */
    this.id = Oversimplified.nextID++;
    
    var self = this;
    
    /** The name given to the room on creation.
     * @instance
     * @type {string}
     * @readonly
     */
    this.name = name;

    /** The internal flag that identifies whether the room has run all of its `DoFirst()` processes since it was set as
     * the current room.
     * @instance
     * @type {boolean}
     * @restricted
     */
    this.hasRunStart = false;

    options = typeof options !== 'undefined' ? options : {};
    
    options.width = (typeof options.width !== 'undefined' && options.width >= Oversimplified.camera.width) ? options.width : Oversimplified.camera.width;
    options.height = (typeof options.height !== 'undefined' && options.height >= Oversimplified.camera.height) ? options.height : Oversimplified.camera.height;
    options.stepSpeed = (typeof options.stepSpeed !== 'undefined' && options.stepSpeed > 0) ? options.stepSpeed : Oversimplified.Settings.defaultStep;
    
    /** The width of the room. The camera will not travel beyond this when moving right. If it is larger than the camera's width and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's width, it will be set to the camera's width.
     * @instance
     * @type {number}
     * @readonly
     */
    this.width = options.width;

     /** The height of the room. The camera will not travel beyond this when moving down. If it is larger than the camera's height and there is an object being followed by the camera, the camera can scroll to the farther portions of the room. If it is smaller than the camera's height, it will be set to the camera's height.
      * @instance
      * @type {number}
      * @readonly
      */
    this.height = options.height;

    if (typeof options.backgroundSrc !== 'undefined' && options.backgroundSrc != "") {
     /** Where the actual Image is held so the information _about_ the background can be held in the `background` variable.
      * @instance
      * @type {Image}
      * @readonly
      */
        this.bg = new Image();
        this.bg.src = options.backgroundSrc;
    } else {
        // If options.backgroundSrc is excluded or an empty string, instead use Oversimplified.emptyImage instead.
        this.bg = Oversimplified.emptyImage;
    }
    /** Where data about the background `Image` is stored.
     * @instance
     * @type {Object}
     * @readonly
     * @property {boolean} loaded - If {@link Oversimplified.Room#bg} was not set to the empty image, this will update to `true` when the `Image.src` file has been loaded.
     * @property {number} [width] - The width of the loaded Image file.
     * @property {number} [height] - The height of the loaded Image file.
     * @property {string} [backgroundColor] - A hex string representing the color that appears behind the background Image, if any.
     */
    this.background = {};
    this.background.loaded = false;

    if (this.bg.src != Oversimplified.emptyImage.src) {
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
    
    
    /** The fraction of a second that passes each time a {@link Oversimplified.Frame|Frame} is run.
     * @instance
     * @type {number}
     */
    this.stepSpeed = options.stepSpeed;
    
    /** This Room's collection of {@link Oversimplified.GameObject|GameObjects} organized by name.
     * @instance
     * @type {Object.<string, Oversimplified.GameObject>}
     */
    this.objects = {};

    /** A shorter alias for {@link Oversimplified.Room#objects}.
     * @type {Object.<string, Oversimplified.GameObject>}
     * @see {Oversimplified.Room#objects}
     */
    this.O = this.objects;

    if (typeof options.backgroundColor !== 'undefined') {
        this.background.color = options.backgroundColor;
    }
    if (typeof options.foreground !== 'undefined') {
        /** Where the foreground `Image` is stored, if specified.
         * @instance
         * @type {Image}
         * @readonly
         * @property {boolean} loaded - This will update to `true` when the `Image.src` file has been loaded.
         * @property {string} src - The path to the foreground image file.
         */
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
    
    /** Stores the order in which the {@link Oversimplified.Room#objects|Room's GameObjects} are drawn based on either their `depth`
     * or the order in which they were created, with most recently created {@link Oversimplified.GameObject|GameObjects} appearing
     * above less recently-created ones.
     * @instance
     * @type {Array.<string>}
     * @readonly
     */
    this.drawOrder = [];

    /** A function that you can use to do something every time the Room loads before the {@link Oversimplified.Frame|Frame} loop begins.
     * This function will run first, before any other specified `DoFirst()` in its `objects` list.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.DoFirst = function () {};

    /** A function that you can use to do something first each {@link Oversimplified.Frame|Frame}, before the Room's `Do()` method.
     * This function will run first, before any other specified `BeforeDo()` or `Do()` in its `objects` list.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.BeforeDo = function () {};

    /** A function that you can use to do something each {@link Oversimplified.Frame|Frame} before any other specified `BeforeDo()`
     * or `Do()` in its `objects` list.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.Do = function () {};

    /** A function that you can use to do something last each {@link Oversimplified.Frame|Frame}, after any other specified
     * `Do()` or `AfterDo()` in its `objects` list.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.AfterDo = function () {};

    /** A function that you can use to do something every time the current Room changes to a different Room. This function
     * will be run when the Room "ends".
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.DoLast = function () {};

    /** A function that you can use to draw something first each {@link Oversimplified.Frame|Frame}, after the Room's `Update()` method.
     * This function will run first, allowing you to draw something at the bottom of the canvas each Frame.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.DrawBelow = function () {};

    /** A function that you can use to draw something last each {@link Oversimplified.Frame|Frame}, after the Room's has drawn everything else.
     * This function will run last, allowing you to draw something at the top of the canvas each Frame, even on top of the Room's foreground.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.DrawAbove = function () {};
}

/** Identifies this object as a Room
 * @instance
 * @type {string}
 * @readonly
 */
Oversimplified.Room.prototype.type = "Room";

/** Internal function that runs when the Room is set as the current room via {@link Oversimplified.SetRoom}
 * or {@link Oversimplified.Room#SetAsCurrentRoom}.
 * @instance
 * @function
 * @restricted
 */
Oversimplified.Room.prototype.Start = function () {
    this.DoFirst();
    
    if (this.name === Oversimplified.Rooms.currentRoomName) {
        for (var objectName in this.objects) {
            this.objects[objectName].Start();
        }
    }
    this.hasRunStart = true;
}

/** Internal function that runs every {@link Oversimplified.Frame|Frame} and handles the {@link Oversiplified.GameObject#Update|Update()}
 * function of every {@link Oversimplified.GameObject} in its {@link Oversimplified.Room#objects|objects container}.
 * @instance
 * @function
 * @restricted
 */
Oversimplified.Room.prototype.Update = function () {
    if (Oversimplified.step != this.stepSpeed) {
        Oversimplified.step = this.stepSpeed;
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

/** Internal function that runs when a different Room is set as the current room via {@link Oversimplified.SetRoom}
 * or {@link Oversimplified.Room#SetAsCurrentRoom}.
 * @instance
 * @function
 * @restricted
 */
Oversimplified.Room.prototype.End = function () {
    this.DoLast();
    if (this) this.hasRunStart = false;
}

/** Internal function that runs every {@link Oversimplified.Frame|Frame} after {@link Oversimplified.Room#Update} and
 * handles the {@link Oversiplified.GameObject#Draw|Draw()} function of every {@link Oversimplified.GameObject} in
 * its {@link Oversimplified.Room#objects|objects container}.
 * @instance
 * @function
 * @restricted
 */
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

    this.drawOrder = Object.keys(this.objects);    // Determine draw order every frame to account for any new or removed objects. Object.keys support is IE9+
    this.drawOrder.sort(function (a, b) {
        var objA = this.objects[a], objB = this.objects[b];
        if (objA.depth == objB.depth) return 0; // Do not sort/use created order.
        return objA.depth < objB.depth ? 1 : -1;    // Put objA after objB so it is drawn above.
    });
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

/** Create a new {@link Oversimplified.GameObject|GameObject} or add an existing {@link Oversimplified.PremadeObject} to the Room.
 * @instance
 * @function
 * @param {(string|Oversimplified.PremadeObject)} objectOrNewName - If creating a new {@link Oversimplified.GameObject}, use a unique
 * string as its name and include `objectOptions` to create the new object. If the specified name already exists in the Room, this
 * function will return `false`.
 * 
 * If using a {@link Oversimplified.PremadeObject|PremadeObject}, simply use a reference to that object. The resulting GameObject will
 * be a copy of the PremadeObject with a new internal `id` and a name that takes the PremadeObject's name and adds the new id as a suffix.
 * @param {Object} objectOptions
 * @todo Specify the objectOptions params after you set it up on {@link Oversimplified.GameObject}!
 * @returns {(Oversimplified.GameObject|false)} Returns either the created GameObject or `false` if the specified name already exists in the Room.
 * 
 * Use `{@link Oversimplified.DEBUG.showMessages} = true` to show a message in the console that alerts you when name collisions occur.
 */
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

/** Set this Room as the current room.
 * @instance
 * @function
 */
Oversimplified.Room.prototype.SetAsCurrentRoom = function () {
    Oversimplified.SetRoom(this);
}

/** Create an object in the current room.
 * 
 * Internally calls {@link Oversimplified.Room#AddObject} on the current room.
 * @function
 * @param {(string|Oversimplified.PremadeObject)} objectOrNewName
 * @param {Object} objectOptions
 * @todo Specify the objectOptions params after you set it up on {@link Oversimplified.Room#AddObject}!
 * @see {@link Oversimplified.Room#AddObject}
 */
Oversimplified.Create = function (objectOrNewName, objectOptions) {
    return Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].AddObject(objectOrNewName, objectOptions);
}

/** Change to the specified room.
 * 
 * Runs the current Room's End() function, changes the room, and runs the specified Room's Start() function.
 * @function
 * @param {Oversimplified.Room} room - The Room you want to set as the current Room.
 */
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

// Convenient aliases for PremadeObjects.
Oversimplified.Prefabs = Oversimplified.PremadeObjects;    // In case someone likes the technical "prefab" term better.
Oversimplified.P = Oversimplified.PremadeObjects;

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

    // If provided options.imageSrc is an image, use it. If there's no options.imageSrc, use Oversimplified.emptyImage's src in a new image.
    this.image = (options.imageSrc && options.imageSrc.src) ? options.imageSrc : new Image();
    this.image.src = (this.image.src) ? this.image.src : (options.imageSrc ? options.imageSrc : Oversimplified.emptyImage.src);

    this.sprite = {};
    this.sprite.xScale = typeof options.xScale !== 'undefined' ? options.xScale : 1;
    this.sprite.yScale = typeof options.yScale !== 'undefined' ? options.yScale : this.sprite.xScale;

    this.sprite.rotation = typeof options.rotation !== 'undefined' ? Oversimplified.Math.clampAngle(options.rotation) : 0;

    this.sprite.animations = {};

    this.sprite.frameColumn = 0;
    this.sprite.frameRow = 0;
    
    if (typeof options.animations !== 'undefined' && options.animations.length > 0) {
        for (var i = 0; i < options.animations.length; i++) {
            if (i == 0 && options.animations[i].name != "Default") {
                this.sprite.animations["Default"] = options.animations[i];    // Creates a duplicate animation of the first animation called "Default" in addition to the named animation below (unless the animation's name is "Default")
            }
            this.sprite.animations[options.animations[i].name] = options.animations[i];
        }
    } else {
        var newAnimationName = "Default_GameObject" + this.id.toString();
        if (this.image.src != Oversimplified.emptyImage.src) {
            //If no animations array is included, then just show the whole image
            this.image.stillLoading = true;
            this.image.onload = function(){
                // Creates the default animation as the whole image once the image is loaded.
                self.sprite.animations["Default"] = new Oversimplified.Animation(newAnimationName, this.width, this.height);
                setupMask();
                self.image.stillLoading = false;
            }
        } else {
            this.sprite.animations["Default"] = new Oversimplified.Animation(newAnimationName, this.image.width, this.image.height);
        }
    }
    
    this.sprite.currentAnimation = "Default";

    if (!this.image.stillLoading) {
        setupMask();
    }
    
    function setupMask() {
        self.mask = (options.maskImageSrc) ? new Image() : {};
        self.mask.src = (options.maskImageSrc) ? options.maskImageSrc : "";
        if (self.mask.src == "") {
            self.mask.width = self.sprite.animations["Default"].width;
            self.mask.height = self.sprite.animations["Default"].height;
        }
        
        if (self.mask.src != "") {
            self.mask.onload = function(){
                self.xBound = self.width / 2 * self.sprite.xScale;
                self.yBound = self.height / 2 * self.sprite.yScale;
            };
        } else {
            self.xBound = self.mask.width / 2 * self.sprite.xScale;
            self.yBound = self.mask.height / 2 * self.sprite.yScale;
        }
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
    this.sprite.rotation = Oversimplified.Math.clampAngle(rotation);
}
Oversimplified.GameObject.prototype.RotateImage = function (amount) {
    this.sprite.rotation += Oversimplified.Math.clampAngle(amount);
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
    this.sprite.rotation = Oversimplified.Math.clampAngle(this.sprite.rotation);
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
Oversimplified.A = Oversimplified.Animations;
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

// Animation class (for use with sprite sheets)
//
// Prevents animation mess-ups by preventing speeds higher than one with Oversimplified.Math.clamp01.
Oversimplified.Animation = function (name, width, height, options) {
    options = typeof options !== 'undefined' ? options : {};
    
    this.id = Oversimplified.nextID++;

    //Required Options
    this.name = name;
    this.width = width;
    this.height = height;

    //Optional Options
    this.columns = typeof options.columns !== 'undefined' ? options.columns : 1;
    this.rows = typeof options.rows !== 'undefined' ? options.rows : 1;
    this.speed = typeof options.speed !== 'undefined' ? Oversimplified.Math.clamp01(options.speed) : 1;
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

// Alias for Effects
Oversimplified.E = Oversimplified.Effects;

// Aliases for Sounds and Tunes
Oversimplified.Effects.S = Oversimplified.Effects.Sounds;
Oversimplified.Effects.T = Oversimplified.Effects.Music = Oversimplified.Effects.M = Oversimplified.Effects.Tunes;

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
        if([
            Oversimplified.Keycode['left arrow'],
            Oversimplified.Keycode['right arrow'],
            Oversimplified.Keycode['up arrow'],
            Oversimplified.Keycode['down arrow'],
            Oversimplified.Keycode['space'],
            Oversimplified.Keycode['tab']
        ].indexOf(e.keyCode) > -1) {
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
    if (Oversimplified.loadedScripts.length >= Oversimplified.numberOfScriptsToLoad
        || Oversimplified.loadingScripts.length == 0)
    {
        // console.log(Oversimplified.loadedScripts);
        Oversimplified.now = Oversimplified.timestamp();
        Oversimplified.dateTime = Oversimplified.dateTime + Math.min(1, (Oversimplified.now - Oversimplified.lastFrame) / 1000);
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
            debugMessage += (Oversimplified.numberOfScriptsToLoad > 0) ? " of " + Oversimplified.numberOfScriptsToLoad.toString() : "";
            debugMessage += " scripts:\n" + Oversimplified.loadedScripts.toString() + ".\nWaiting for:\n" + Oversimplified.loadingScripts.toString();
            console.log(debugMessage);
        }
        
        if (Oversimplified.Settings.loadingBar !== false && Oversimplified.numberOfScriptsToLoad > 0) {
            var percentage = Oversimplified.loadedScripts.length / Oversimplified.numberOfScriptsToLoad;
            var barHeight = 32;
            var maxBarWidth = Math.round(Oversimplified.camera.width * 0.6);
            var barWidth = Math.round(maxBarWidth * percentage);
            var barX = Math.round(Oversimplified.camera.width * 0.2);
            var barY = Math.round(Oversimplified.camera.height * 0.5) - Math.round(barHeight / 2);

            var saveFillStyle = Oversimplified.context.fillStyle;
            var saveStrokeStyle = Oversimplified.context.strokeStyle;

            Oversimplified.context.fillStyle = Oversimplified.Settings.loadingBar.fillColor;
            Oversimplified.context.fillRect(barX, barY, barWidth, barHeight);

            Oversimplified.context.strokeStyle = Oversimplified.Settings.loadingBar.outlineColor;
            Oversimplified.context.lineWidth = Oversimplified.Settings.loadingBar.outlineWidth;
            Oversimplified.context.strokeRect(barX, barY, maxBarWidth, barHeight);

            Oversimplified.context.fillStyle = saveFillStyle;
            Oversimplified.context.strokeStyle = saveStrokeStyle;
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

// Check if the defined point (x, y) or object x is currently visible on the canvas.
Oversimplified.IsOnCamera = function (x, y) {
    var cameraLeft = Oversimplified.camera.x,
        cameraRight = Oversimplified.camera.x + Oversimplified.camera.width,
        cameraTop = Oversimplified.camera.y,
        cameraBottom = Oversimplified.camera.y + Oversimplified.camera.height;
    if (typeof y === 'undefined') {    //If y is not defined, then x is an object.
        var objLeft = x.x - x.xBound, objRight = x.x + x.xBound, objTop = x.y - x.yBound, objBottom = x.y + x.yBound;
        return (objLeft <= cameraRight) && (objRight >= cameraLeft) && (objTop <= cameraBottom) && (objBottom >= cameraTop);
    }
    return x >= cameraLeft && x <= cameraRight
        && y >= cameraTop && y <= cameraBottom;
}

/* Dynamically add a source script to the page.

You can either specify a main function or just make the main function within the script the same as the script's name (minus ".js")
*/
Oversimplified.AddScript = function (pathToScript, mainFunction) {
    mainFunction = typeof mainFunction !== 'undefined'
        ? mainFunction
        : pathToScript.slice((
            pathToScript.lastIndexOf("/") > -1 ? pathToScript.lastIndexOf("/") + 1 : 0
        ), pathToScript.lastIndexOf("."));
    
    Oversimplified.numberOfScriptsToLoad++;
    Oversimplified.loadingScripts.push(pathToScript);
    
    var script = document.createElement('script');
    script.src = pathToScript;
    script.onload = function () {
        if (typeof mainFunction !== 'string') {
            mainFunction();
        } else {
            if (typeof window[mainFunction] === 'function') {
                window[mainFunction]();
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
    if (Oversimplified.DEBUG.showMessages && Oversimplified.loadingScripts.length > 0) console.log("Waiting for " + (Oversimplified.numberOfScriptsToLoad - Oversimplified.loadedScripts.length).toString() + " scripts to load");

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

// Oversimplified.Math namespace
Oversimplified.Math = {};

/* Make sure the value does not fall outide the min-max range

Usage: numberValue = Oversimplified.Math.clamp(numberValue, 3, 10);
*/
Oversimplified.Math.clamp = function (value, min, max) {
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

Usage: numberValue = Oversimplified.Math.clamp01(numberValue);
*/
Oversimplified.Math.clamp01 = function (value) {
    if (value < 0) {
        value = 0;
    }
    if (value > 1) {
        value = 1;
    }
    return value;
};


/* Return the given numberValue as a clamped angle between 0 and 360

Usage: numberValue = Oversimplified.Math.clampAngle(numberValue, 0, 180);

Alternate: numberValue = Oversimplified.Math.clampAngle(numberValue);
*/
Oversimplified.Math.clampAngle = function (value, min, max) {
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

Usage: degreeValue = Oversimplified.Math.radToDeg(radianValue);
*/
Oversimplified.Math.radToDeg = function (radians) {
    return radians / (Math.PI / 180);
};

/* Convert a degree value to radians

Usage: radianValue = Oversimplified.Math.degToRad(degreeValue);
*/
Oversimplified.Math.degToRad = function (degrees) {
    return degrees * (Math.PI / 180);
};

/* Get the cosine of an angle given in degrees

Usage: cosine = Oversimplified.Math.getCos(angleInDegrees);
*/
Oversimplified.Math.getCos = function (angle) {
    return Math.cos(Oversimplified.Math.degToRad(angle));
};

/* Get the sine of an angle given in degrees

Usage: sine = Oversimplified.Math.getSin(angleInDegrees);
*/
Oversimplified.Math.getSin = function (angle) {
    return Math.sin(Oversimplified.Math.degToRad(angle));
};

/* Return true or false based on a 50% chance

Usage: flippedHeads = Oversimplified.Math.coinFlip();
*/
Oversimplified.Math.coinFlip = function () {
    if (Math.random() >= 0.5) {
        return true;
    } else {
        return false;
    }
};

/* Return a random number between min and max (inclusive)

Usage: numberBetween3And15 = Oversimplified.Math.randomRange(3, 15);
*/
Oversimplified.Math.randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
};
