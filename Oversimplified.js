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

/** Stores the HTML5 canvas element in `index.html` with the id of `game`.
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
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image|Image}
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
 * @property {number} defaultStep=1/30 - The default frame speed for {@link Oversimplified.Room|Rooms}. Represents the number of seconds that pass before the next {@link Oversimplified.Frame} plays.
 * @property {(Object|false)} loadingBar - The style values for the loading bar that appears when scripts are being loaded.
 *
 * Can be set to `false` to disable the loading bar completely and just show a blank screen when loading is happening instead.
 * @property {string} loadingBar.fillColor="#DD5511" - The color hex (including `#`) of the loading bar that fills in the outlined space.
 * @property {string} loadingBar.outlineColor="#882200" - The color hex (including `#`) of the outline that surrounds the loading bar.
 * @property {number} loadingBar.outlineWidth=5 - The number of pixels that the loading bar's outline has.
 * @property {number} soundVolume=0.75 - The level of volume between 0 and 1 that {@link Oversimplified.Sound|Sounds} play at.
 * @property {number} tuneVolume=0.75 - The level of volume between 0 and 1 that {@link Oversimplified.Tune|Tunes} play at.
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
    tuneVolume: 0.75,
    preventRightClick: true,
};

/** A convenient alias for {@link Oversimplified.Settings}.
 * 
 * _Anywhere_ you might type `Oversimplified.Settings`, you can substitute `OS.S` instead to save some typing.
 * @namespace
 * @alias OS.S
 * @see {@link Oversimplified.Settings}
 */
Oversimplified.S = Oversimplified.Settings;

/** Adjust the volume for {@link Oversimplified.Sound|Sounds} and {@link Oversimplified.Tune|Music}. This function ensures that
 * any Tunes currently playing also have their volume adjusted.
 * @function
 * @param {number} soundVolume - A number between 0 and 1 that represents the volume percentage for sound effects.
 * @param {number} [tuneVolume=soundVolume] - A number between 0 and 1 that represents the volume percentage for music ({@link Oversimplified.Tune|Tunes}).
 * 
 * If excluded, it will default to whatever was entered for the `soundVolume` parameter.
 * @example
 * // This is a pretty straightforward function, but if you want to
 * // set just one volume and not the other, you can use the existing
 * // Oversimplified.Settings value like so:
 * Oversimplified.Settings.SetVolume(OS.S.soundVolume, 0.5);    // Keeps the Sound volume the same and changes Tune volume to 50%
 * Oversimplified.Settings.SetVolume(0.75, OS.S.tuneVolume);    // Keeps the Tune volume the same and changes only the Sound volume to 75%
 */
Oversimplified.Settings.SetVolume = function (soundVolume, tuneVolume) {
    soundVolume = Oversimplified.Math.clamp01(soundVolume);
    tuneVolume = typeof tuneVolume !== 'undefined' ? Oversimplified.Math.clamp01(tuneVolume) : soundVolume;
    Oversimplified.Settings.soundVolume = soundVolume;
    Oversimplified.Settings.tuneVolume = tuneVolume;
    // Sounds and Tunes have their volume adjusted on Play, but playing Tunes need to be adjusted.
    for (var tune in Oversimplified.Effects.Tunes) {
        if (Oversimplified.Effects.Tunes[tune].type == "Tune" && Oversimplified.Effects.Tunes[tune].IsPlaying()) {
            Oversimplified.Effects.Tunes[tune].audioElement.volume = Oversimplified.Settings.tuneVolume;
        }
    }
}



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
 * @returns {Oversimplified.Room}
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
 * @param {string} [options.foreground] - Path to any image file, though `.png` or `.gif` file with transparency is ideal. Sets the foreground image that displays over the background and all objects in the room. Appears below the Room's {@link Oversimplified.Room#DrawAbove|DrawAbove()} function but above any GameObject's {@link Oversimplified.GameObject#DrawAbove|DrawAbove()} function.
 */
Oversimplified.Rooms.Add = function (name, options) {
    if (typeof Oversimplified.Rooms[name] === 'undefined') {
        Oversimplified.Rooms[name] = new Oversimplified.Room(name, options);
        
        return Oversimplified.Rooms[name];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.error("A Room with the name \"" + name + "\" already exists!");
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
 * and only the Room that it identified within `{@link Oversimplified.Rooms}.currentRoomName` has its process run.
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
      * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image|Image}
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
     * @property {string} [color] - A hex string representing the color that appears behind the background Image, if any.
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
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image|Image}
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
 * @default "Room"
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
        var objA = self.objects[a], objB = self.objects[b];
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
 * @param {Object} objectOptions - The options that are applied to the creation of the GameObject.
 * @param {number} objectOptions.x=-1 - The `x` position of the GameObject within its containing Room, measured from the top left corner.
 * @param {number} objectOptions.y=-1 - The `y` position of the GameObject within its containing Room, measured from the top left corner.
 * @param {string} objectOptions.imageSrc - The path to the image file the GameObject will use to display itself. If using `animations`, this is the sprite sheet the animations will use.
 * @param {string} [objectOptions.maskImageSrc] - The path to the image file the GameObject will use the measurements of to identify its boundaries in place of the imageSrc. Useful for making the GameObject functionally smaller or larger than it appears.
 * @param {Oversimplified.Animation[]} [objectOptions.animations] - An array of Animations that identify the size and frames of a GameObject's animations when using a sprite sheet.
 * @param {number} [objectOptions.depth=0] - A number that identifies what order this GameObject should be drawn in. Lower numbers will be drawn first, which means that higher numbers will be drawn _on top of_ lower numbers.
 * @param {boolean} [objectOptions.solid=false] - A flag that is used to identify whether the GameObject should be considered something that cannot be moved through when using built-in simple movement functions.
 * @param {number} [objectOptions.xScale=1] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the horizontal direction. This number affects the boundaries of the GameObject and will distort its image.
 * @param {number} [objectOptions.yScale=1] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the vertical direction. This number affects the boundaries of the GameObject and will distort its image. If excluded, the specified xScale will be used instead.
 * @param {number} [objectOptions.rotation=0] - A number between 0 and 359 that represents the angle that the GameObject's image should display at. This _does not_ affect the image's boundaries.
 * @param {any} [objectOptions....] - Any other properties you include here will be added to the GameObject if another built-in property by the same name does not already exist.
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
            if (Oversimplified.DEBUG.showMessages) console.error("GameObject with name \"" + objectOrNewName + "\" already exists in current room!");
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
 * @param {Object} objectOptions - The options that are applied to the creation of the GameObject.
 * @param {number} objectOptions.x=-1 - The `x` position of the GameObject within its containing Room, measured from the top left corner.
 * @param {number} objectOptions.y=-1 - The `y` position of the GameObject within its containing Room, measured from the top left corner.
 * @param {string} objectOptions.imageSrc - The path to the image file the GameObject will use to display itself. If using `animations`, this is the sprite sheet the animations will use.
 * @param {string} [objectOptions.maskImageSrc] - The path to the image file the GameObject will use the measurements of to identify its boundaries in place of the imageSrc. Useful for making the GameObject functionally smaller or larger than it appears.
 * @param {Oversimplified.Animation[]} [objectOptions.animations] - An array of Animations that identify the size and frames of a GameObject's animations when using a sprite sheet.
 * @param {number} [objectOptions.depth=0] - A number that identifies what order this GameObject should be drawn in. Lower numbers will be drawn first, which means that higher numbers will be drawn _on top of_ lower numbers.
 * @param {boolean} [objectOptions.solid=false] - A flag that is used to identify whether the GameObject should be considered something that cannot be moved through when using built-in simple movement functions.
 * @param {number} [objectOptions.xScale=1] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the horizontal direction. This number affects the boundaries of the GameObject and will distort its image.
 * @param {number} [objectOptions.yScale=1] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the vertical direction. This number affects the boundaries of the GameObject and will distort its image. If excluded, the specified xScale will be used instead.
 * @param {number} [objectOptions.rotation=0] - A number between 0 and 359 that represents the angle that the GameObject's image should display at. This _does not_ affect the image's boundaries.
 * @param {any} [objectOptions....] - Any other properties you include here will be added to the GameObject if another built-in property by the same name does not already exist.
 * @returns {(Oversimplified.GameObject|false)} Returns either the created GameObject or `false` if the specified name already exists in the Room.
 *
 * Use `{@link Oversimplified.DEBUG.showMessages} = true` to show a message in the console that alerts you when name collisions occur.
 * @see {@link Oversimplified.Room#AddObject}
 */
Oversimplified.Create = function (objectOrNewName, objectOptions) {
    return Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].AddObject(objectOrNewName, objectOptions);
}

/** Change to the specified room.
 * 
 * Runs the current Room's {@link Oversimplified.Room#End|End()} function, changes the room, and runs the specified
 * Room's {@link Oversimplified.Room#Start|Start()} function.
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
/** Creates and stores {@link Oversimplified.GameObject}s that can be generated on the fly.
 * 
 * Alternatively accessible via `Oversimplified.Prefabs` if you prefer that terminology.
 * 
 * Conveniently aliased with `{@link OS.P}`, for example
 *
 * ```
 * OS.P.Add("Player", { x: 20, y: 20, imageSrc: 'path/to/image' });
 * ```
 *
 * is the same as
 *
 * ```
 * Oversimplified.PremadeObjects.Add("Player", { x: 20, y: 20, imageSrc: 'path/to/image' });
 * // OR
 * Oversimplified.Prefabs.Add("Player", { x: 20, y: 20, imageSrc: 'path/to/image' });
 * ```
 * @namespace
 */
Oversimplified.PremadeObjects = {};
Oversimplified.Prefabs = Oversimplified.PremadeObjects;    // In case someone likes the technical "prefab" term better.

/** A convenient alias for {@link Oversimplified.PremadeObjects}.
 *
 * _Anywhere_ you might type `Oversimplified.PremadeObjects` or `Oversimplified.Prefabs`, you can substitute `OS.P` instead to save some typing.
 * @namespace
 * @alias OS.P
 * @see {@link Oversimplified.Rooms}
 */
Oversimplified.P = Oversimplified.PremadeObjects;

/** Add a {@link Oversimplified.GameObject|GameObject} to the list of PremadeObjects with the name `name`.
 * 
 * This function is also available as `Oversimplified.PremadeObjects.New`, so you can use whichever you prefer.
 * @function
 * @param {string} name - The name that the GameObject will be identified by. Must be unique to PremadeObjects.
 * @param {Object} objectOptions - The options that are applied to the creation of the GameObject.
 * @param {number} objectOptions.x=-1 - The `x` position of the GameObject within its containing Room, measured from the top left corner.
 * @param {number} objectOptions.y=-1 - The `y` position of the GameObject within its containing Room, measured from the top left corner.
 * @param {string} objectOptions.imageSrc - The path to the image file the GameObject will use to display itself. If using `animations`, this is the sprite sheet the animations will use.
 * @param {string} [objectOptions.maskImageSrc] - The path to the image file the GameObject will use the measurements of to identify its boundaries in place of the imageSrc. Useful for making the GameObject functionally smaller or larger than it appears.
 * @param {Oversimplified.Animation[]} [objectOptions.animations] - An array of Animations that identify the size and frames of a GameObject's animations when using a sprite sheet.
 * @param {number} [objectOptions.depth=0] - A number that identifies what order this GameObject should be drawn in. Lower numbers will be drawn first, which means that higher numbers will be drawn _on top of_ lower numbers.
 * @param {boolean} [objectOptions.solid=false] - A flag that is used to identify whether the GameObject should be considered something that cannot be moved through when using built-in simple movement functions.
 * @param {number} [objectOptions.xScale=1] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the horizontal direction. This number affects the boundaries of the GameObject and will distort its image.
 * @param {number} [objectOptions.yScale=1] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the vertical direction. This number affects the boundaries of the GameObject and will distort its image. If excluded, the specified xScale will be used instead.
 * @param {number} [objectOptions.rotation=0] - A number between 0 and 359 that represents the angle that the GameObject's image should display at. This _does not_ affect the image's boundaries.
 * @param {any} [objectOptions....] - Any other properties you include here will be added to the GameObject if another built-in property by the same name does not already exist.
 * @returns {(Oversimplified.GameObject|false)} The resulting GameObject stored within `OS.PremadeObjects` that can be used via {@link Oversimplified.Room#AddObject} or {@link Oversimplified.Create} or `false` if the specified name already exists in the PremadeObjects container.
 *
 * Use `{@link Oversimplified.DEBUG.showMessages} = true` to show a message in the console that alerts you when name collisions occur.
 */
Oversimplified.PremadeObjects.Add = function (name, objectOptions) {// x, y, imageSrc, maskImageSrc, animationsArray) {
    if (typeof Oversimplified.PremadeObjects[name] === 'undefined') {
        Oversimplified.PremadeObjects[name] = new Oversimplified.GameObject(name, objectOptions);// x, y, imageSrc, maskImageSrc, animationsArray);
        return Oversimplified.PremadeObjects[name];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.error("A Premade Object with the name \"" + name + "\" already exists!");
        return false;
    }
}

// Alias for PremadeObjects.Add().
Oversimplified.PremadeObjects.New = Oversimplified.PremadeObjects.Add;



// GameObject class
/** Creates a new GameObject with the name `name` and the specified options.
 * 
 * Accesed via {@link Oversimplified.Room#Addobject} or {@link Oversimplified.Create}.
 * @class
 * @classdesc The objects that actually do things in your game. GameObjects are stored within a {@link Oversimplified.Room|Room}'s
 * {@link Oversimplified.Room#objects|objects} container, and are processed and displayed automatically by the Room.
 * @param {string} name - The name this GameObject identifies itself as.
 * @param {Object} options
 * @param {number} options.x=-1 - The `x` position of the GameObject within its containing Room, measured from the top left corner.
 * @param {number} options.y=-1 - The `y` position of the GameObject within its containing Room, measured from the top left corner.
 * @param {string} options.imageSrc - The path to the image file the GameObject will use to display itself. If using `animations`, this is the sprite sheet the animations will use.
 * @param {string} [options.maskImageSrc] - The path to the image file the GameObject will use the measurements of to identify its boundaries in place of the imageSrc. Useful for making the GameObject functionally smaller or larger than it appears.
 * @param {Oversimplified.Animation[]} [options.animations] - An array of Animations that identify the size and frames of a GameObject's animations when using a sprite sheet.
 * @param {number} [options.depth=0] - A number that identifies what order this GameObject should be drawn in. Lower numbers will be drawn first, which means that higher numbers will be drawn _on top of_ lower numbers.
 * @param {boolean} [options.solid=false] - A flag that is used to identify whether the GameObject should be considered something that cannot be moved through when using built-in simple movement functions.
 * @param {number} [options.xScale=1] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the horizontal direction. This number affects the boundaries of the GameObject and will distort its image.
 * @param {number} [options.yScale=1] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the vertical direction. This number affects the boundaries of the GameObject and will distort its image. If excluded, the specified xScale will be used instead.
 * @param {number} [options.rotation=0] - A number between 0 and 359 that represents the angle that the GameObject's image should display at. This _does not_ affect the image's boundaries.
 * @param {any} [options....] - Any other properties you include here will be added to the GameObject if another built-in property by the same name does not already exist.
 */
Oversimplified.GameObject = function (name, options) {
    /** The internal ID of this GameObject.
     * @instance
     * @type {number}
     * @readonly
     */
    this.id = Oversimplified.nextID++;
    
    var self = this;

    /** The internal flag that identifies whether the GameObject has run its `DoFirst()` process since its Room was set as
     * the current Room.
     * @instance
     * @type {boolean}
     * @restricted
     */
    this.hasRunStart = false;
    
    /** The name given to the GameObject on creation.
     * @instance
     * @type {string}
     * @readonly
     */
    this.name = name;

    /** GameObjects with higher depth are drawn _after_ GameObjects with lower depths and will therefore appear _on top of_
     * those lower-depth GameObjects. GameObjects with the same depth are drawn in the order they are created.
     * @instance
     * @type {number}
     * @default 0
     */
    this.depth = typeof options.depth !== 'undefined' ? options.depth : 0;

    /** Used to flag whether {@link Oversimplified.GameObject#SimpleMove} should evaluate the GameObject as something that
     * cannot be passed through.
     * @instance
     * @type {boolean}
     * @default false
     */
    this.solid = typeof options.solid !== 'undefined' ? options.solid : false;

    /** The number of pixels from the left side of the room that the GameObject should display. This value represents the _center_ of the GameObject's sprite boundaries _within its room_.
     * @instance
     * @type {number}
     * @default 0
     */
    this.x = typeof options.x !== 'undefined' ? options.x : 0;

    /** The number of pixels from the top of the room that the GameObject should display. This value represents the _center_ of the GameObject's sprite boundaries _within its room_.
     * @instance
     * @type {number}
     * @default 0
     */
    this.y = typeof options.y !== 'undefined' ? options.y : 0;

    /** Stores the value of {@link Oversimplified.GameObject#x} from the previous {@link Oversimplified.Frame} before updating `x`.
     * @instance
     * @type {number}
     * @readonly
     */
    this.xPrevious = this.x;

    /** Stores the value of {@link Oversimplified.GameObject#y} from the previous {@link Oversimplified.Frame} before updating `y`.
     * @instance
     * @type {number}
     * @readonly
     */
    this.yPrevious = this.y;

    /** Stores the GameObject's `x` position relative to the {@link Oversimplified.camera}.
     * @instance
     * @type {number}
     * @readonly
     */
    this.screenX = this.x - Oversimplified.camera.x;

    /** Stores the GameObject's `y` position relative to the {@link Oversimplified.camera}.
     * @instance
     * @type {number}
     * @readonly
     */
    this.screenY = this.y - Oversimplified.camera.y;

    // If provided options.imageSrc is an image, use it. If there's no options.imageSrc, use Oversimplified.emptyImage's src in a new image.
    /** Stores the Image loaded from `imageSrc` on creation. It is recommended that you don't modify this directly
     * after creating the GameObject or else its sizing will get messed up.
     * @instance
     * @type {Image}
     * @restricted
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image|Image}
     */
    this.image = (options.imageSrc && options.imageSrc.src) ? options.imageSrc : new Image();
    this.image.src = (this.image.src) ? this.image.src : (options.imageSrc ? options.imageSrc : Oversimplified.emptyImage.src);

    /** Stores information about the sprite received from the GameObject's `image` and `mask`
     * @instance
     * @type {Object}
     * @property {number} xScale=1 - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the horizontal direction. This number affects the boundaries of the GameObject and will distort its image.
     * 
     * A negative value _will not_ cause the image to mirror horizontally because doing so takes too much processing power each frame.
     * @property {number} yScale=1 - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the vertical direction. This number affects the boundaries of the GameObject and will distort its image.
     *
     * A negative value _will not_ cause the image to mirror vertically because doing so takes too much processing power each frame.
     * @property {number} rotation=0 - A number between 0 and 359 that represents the angle that the GameObject's image should display at.
     * 
     * This _does not_ affect the image's boundaries—OversimplifiedJS will always process the boundary as a rectangle with no rotation.
     * @property {Object.<string, Oversimplified.Animation>} animations - Stores references to Animations that the GameObject uses. The Animation names used are the same as the names they were created with.
     * 
     * The first Animation in the `options.animations` array is also duplicated as "Default" for the GameObject. If there are no animations, then "Default" will instead be the static `image` size.
     * @property {number} frameColumn=0 - (readonly) Used internally to track what frame of the current Animation to display during the {@link Oversimplified.Frame}.
     * @property {number} frameRow=0 - (readonly) Used internally to track what frame of the current Animation to display during the {@link Oversimplified.Frame}.
     * @property {string} currentAnimation="Default" - The name of the current Animation that the GameObject will display.
     */
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
        /** The Image the GameObject will use the measurements of to identify its boundaries in place of the {@link Oversimplified.GameObject#image}.
         * Useful for making the GameObject functionally smaller or larger than it appears.
         * 
         * If no mask is specified, then the frame size of the "Default" Animation is used instead.
         * @instance
         * @memberOf Oversimplified.GameObject
         * @type {(Image|Object)}
         * @restricted
         */
        self.mask = (options.maskImageSrc) ? new Image() : {};
        self.mask.src = (options.maskImageSrc) ? options.maskImageSrc : "";
        if (self.mask.src == "") {
            self.mask.width = self.sprite.animations["Default"].width;
            self.mask.height = self.sprite.animations["Default"].height;

            /** The distance in pixels from the center of the GameObject to its horizontal boundary, equalling half of the GameObject's width.
             * 
             * If using a {@link Oversimplified.GameObject#mask|mask}, this size will reflect the boundary imposed by the mask,
             * otherwise, the image size will be used.
             * @instance
             * @memberOf Oversimplified.GameObject
             * @type {number}
             * @readonly
             */
            self.xBound = self.mask.width / 2 * self.sprite.xScale;

            /** The distance in pixels from the center of the GameObject to its vertical boundary, equalling half of the GameObject's height.
             * 
             * If using a {@link Oversimplified.GameObject#mask|mask}, this size will reflect the boundary imposed by the mask,
             * otherwise, the image size will be used.
             * @instance
             * @memberOf Oversimplified.GameObject
             * @type {number}
             * @readonly
             */
            self.yBound = self.mask.height / 2 * self.sprite.yScale;
        } else {
            self.mask.onload = function(){
                self.xBound = this.width / 2 * self.sprite.xScale;
                self.yBound = this.height / 2 * self.sprite.yScale;
            };
        }
    }

    // Set any extra properties from Options.
    for (var property in options) {
        if (typeof this[property] === 'undefined') {
            this[property] = options[property];
        }
    }

    /** A function that you can use to do something every time the {@link Oversimplified.Room} loads before the
     * {@link Oversimplified.Frame|Frame} loop begins.
     * 
     * This function will run at the start of the Room in the order that the GameObjects for the Room were created.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.DoFirst = function () {};

    /** A function that you can use to do something first each {@link Oversimplified.Frame|Frame}, before the GameObject's `Do()` method.
     *
     * This function will run each Frame in the order that the GameObjects for the Room were created.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.BeforeDo = function () {};

    /** A function that you can use to do something each {@link Oversimplified.Frame|Frame}.
     *
     * This function will run each Frame in the order that the GameObjects for the Room were created.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.Do = function () {};

    /** A function that you can use to do something last each {@link Oversimplified.Frame|Frame}, after the GameObject's `Do()` method.
     *
     * This function will run each Frame in the order that the GameObjects for the Room were created.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.AfterDo = function () {};

    /** A function that you can use to do something when the GameObject is deleted _or_ every time the current Room changes to
     * a different Room.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.DoLast = function () {};

    /** A function that you can use to draw something first each {@link Oversimplified.Frame|Frame}, after the GameObject's `Update()` method.
     * 
     * This function will run in the {@link Oversimplified.Room#drawOrder|Room's draw order}, allowing you to draw something
     * below the GameObject each Frame.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.DrawBelow = function () {};

    /** A function that you can use to draw something last each {@link Oversimplified.Frame|Frame}, after the GameObject has drawn everything else.
     *
     * This function will run in the {@link Oversimplified.Room#drawOrder|Room's draw order}, allowing you to draw something
     * on top of the GameObject each Frame.
     * @instance
     * @function
     * @abstract
     * @default an empty Function
     */
    this.DrawAbove = function () {};
}

/** Identifies this object as a GameObject
 * @instance
 * @type {string}
 * @readonly
 * @default "GameObject"
 */
Oversimplified.GameObject.prototype.type = "GameObject";

/** Either adds an existing {@link Oversimplified.Animation} or creates a new one and adds it to the {@link Oversimplified.GameObject#sprite|GameObject's sprite}.
 * @instance
 * @function
 * @param {(Oversimplified.Animation|string)} animation - If given a pre-created `Animation`, then it will add that Animation to the `{@link Oversimplified.GameObject#sprite}.animations`
 * container with the Animation's name.
 * 
 * If given a `string`, then that value will be used as the name of the Animation that will be created.
 * @param {number} frameWidth - The width of a single animation frame on the sprite sheet.
 * @param {number} frameHeight - The height of a single animation frame on the sprite sheet.
 * @param {Object} options
 * @param {number} [options.columns=1] - The number of frames in the sprite sheet horizontally.
 * @param {number} [options.rows=1] - The number of frames in the sprite sheet vertically. Each row must have the same number of columns.
 * @param {number} [options.speed=1] - A number between 0 and 1 where 1 is the speed of the room and 0 is stopped. For example, using `0.5`
 * on a room with a step of `1/30` will make 2 {@link Oversimplified.Frame|Frames} pass for each animation frame, effectively making it animate
 * half as fast.
 * @param {number} [options.xOffset=0] - The horizontal pixel where the animation set starts on the image. This can be useful if your sprite sheet contains multiple animations.
 * @param {number} [options.yOffset=0] - The vertical pixel where the animation set starts on the image. This can be useful if your sprite sheet contains multiple animations.
 * @returns {(Oversimplified.Animation|false)}
 */
Oversimplified.GameObject.prototype.AddAnimation = function (animation, frameWidth, frameHeight, options) {
    //Takes either an animation or the name of an animation in the Animations namespace and adds it to the object.
    if (typeof animation.name !== 'undefined') {
        this.sprite.animations[options.name] = animation;
    } else {
        if (typeof Oversimplified.Animations[animation] === 'undefined') {
            Oversimplified.Animations.Add(animation, frameWidth, frameHeight, options);
        }
        this.sprite.animations[Oversimplified.Animations[animation].name] = Oversimplified.Animations[animation];
    }
}

/** Sets the sprite's scale and updates its bounds.
 * @instance
 * @function
 * @param {number} xScale - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the horizontal direction. This number affects the boundaries of the GameObject and will distort its image.
 * A negative value _will not_ cause the image to mirror horizontally.
 * @param {number} [yScale] - A positive number that is greater than zero that indicates the percentage that the GameObject's size should be stretched in the vertical direction. This number affects the boundaries of the GameObject and will distort its image.
 * A negative value _will not_ cause the image to mirror vertically.
 * 
 * If excluded, the `yScale` will be set to the same value as `xScale`
 */
Oversimplified.GameObject.prototype.SetScale = function (xScale, yScale) {
    //Negative scale does not flip image.
    this.sprite.xScale = xScale;
    this.sprite.yScale = typeof yScale !== 'undefined' ? yScale : xScale;
    this.xBound = (this.mask.width / 2) * this.sprite.xScale;
    this.yBound = (this.mask.height / 2) * this.sprite.yScale;
}

/** Sets the sprite's rotation to the angle specified, clamped between 0 and 359 degrees.
 * @instance
 * @function
 * @param {number} angle - The angle to rotate the object to, clockwise in degrees.
 */
Oversimplified.GameObject.prototype.SetImageRotation = function (angle) {
    this.sprite.rotation = Oversimplified.Math.clampAngle(angle);
}

/** Adds the amount specified (positive or negative) to the sprite's rotation, clamped between 0 and 359 degrees.
 * @instance
 * @function
 * @param {number} amount - The number of degrees to add to your sprite's rotation, positive to turn clockwise or negative to turn counter-clockwise.
 */
Oversimplified.GameObject.prototype.RotateImage = function (amount) {
    this.SetImageRotation(this.sprite.rotation + amount);
}

/** Changes the GameObject's current Animation to the one specified.
 * @instance
 * @function
 * @param {(string|Oversimplified.Animation)} which - Either the name of the animation as set in the `{@link Oversimplified.GameObject#sprite}.animations` container
 * or a direct reference to the Animation contained there.
 * 
 * **Note:** If using a direct reference, the Animation's name must be the same as what was used when it was added to the `animations` container!
 */
Oversimplified.GameObject.prototype.SetAnimation = function (which) {
    if (which.name) {    //If you enter an actual animation instead of just its name,
        which = which.name;    //only use its name
    }
    this.sprite.currentAnimation = which;
    this.sprite.frameColumn = 0;
    this.sprite.frameRow = 0;
}

/** Internal function that runs when the GameObject first appears in the current {@link Oversimplified.Room}.
 * 
 * Runs the {@link Oversimplified.GameObject#DoFirst} method if one has been specified.
 * @instance
 * @function
 * @restricted
 */
Oversimplified.GameObject.prototype.Start = function () {
    this.DoFirst();
    this.hasRunStart = true;
}

/** Internal function that runs every {@link Oversimplified.Frame|Frame}.
 * 
 * Runs the {@link Oversimplified.GameObject#BeforeDo}, {@link Oversimplified.GameObject#Do}, and
 * {@link Oversimplified.GameObject#AfterDo} methods in order if any have been specified.
 * @instance
 * @function
 * @restricted
 */
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

/** Internal function that runs every {@link Oversimplified.Frame|Frame} after {@link Oversimplified.GameObject#Update}
 * that handles drawing and animating the GameObject's sprite (if it is within the {@link Oversimplified.camera}'s boundaries)
 * as well as its {@link Oversimplified.GameObject#DrawBelow|DrawBelow()} and {@link Oversimplified.GameObject#DrawAbove|DrawAbove()}
 * methods, if any are specified.
 * @instance
 * @function
 * @restricted
 */
Oversimplified.GameObject.prototype.Draw = function () {
    this.DrawBelow();

    var self = this;
    var animation = self.sprite.currentAnimation;
    if (self.sprite.animations[animation]) {
        if (Oversimplified.IsOnCamera(self)) {
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

            var adjustedColumn = Math.floor(self.sprite.frameColumn);
            var adjustedRow = Math.floor(self.sprite.frameRow);

            Oversimplified.context.translate(self.x - Oversimplified.camera.x, self.y - Oversimplified.camera.y);
            var angleInRadians = self.sprite.rotation * (Math.PI / 180);
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

/** Internal function that runs when the GameObject is destroyed.
 * 
 * Runs the {@link Oversimplified.GameObject#DoLast} method if one has been specified.
 * @instance
 * @function
 * @restricted
 */
Oversimplified.GameObject.prototype.End = function () {
    this.DoLast();
    if (this) this.hasRunStart = false;
}

/** Move directly toward a given point at the given speed at 90° and 45° angles. Inefficient and does not take collision into
 * consideration, but it gets the job done.
 * @instance
 * @function
 * @param {number} x - The target `x` coordinate to move toward.
 * @param {number} y - The target `y` coordinate to move toward.
 * @param {number} [speed=1] - The number of pixels to advance each time it moves.
 */
Oversimplified.GameObject.prototype.MoveTo = function (x, y, speed) {
    speed = typeof speed !== 'undefined' ? speed : 1;
    this.x += speed * Math.sign(x - this.x);
    this.y += speed * Math.sign(y - this.y);
}

/** Check if the given point is within the GameObject's bounds.
 * @instance
 * @function
 * @param {number} x - The `x` coordinate to check.
 * @param {number} y - The `y` coordinate to check.
 * @returns {boolean}
 */
Oversimplified.GameObject.prototype.PointOverlaps = function (x, y) {
    return x > this.x - this.xBound && x < this.x + this.xBound
        && y > this.y - this.yBound && y < this.y + this.yBound;
}

/** Check if the GameObject is overlapping any other GameObject in the current Room
 * @instance
 * @function
 * @param {boolean} [doSimple=false] - If false or not set, all pixels in the GameObject's boundaries will be scanned to check for overlaps.
 * 
 * If true, it will only check the corners and centerpoints at the boundaries of the GameObject against the other GameObjects in the Room.
 * @returns {(Oversimplified.GameObject|false)} If no GameObject is overlapping, it will return false, otherwise, it will return the firstoverlapping GameObject that it finds.
 */
Oversimplified.GameObject.prototype.IsOverlapping = function (doSimple) {
    doSimple = (typeof doSimple !== 'undefined') ? doSimple : false;
    
    for (var obj in Oversimplified.O) {
        var object = Oversimplified.O[obj];
        if (object.id != this.id) {
            // If doSimple is false or not set, then scan all pixels in object boundaries.
            if (!doSimple) {
                for (var i = 0; i < 2 * object.xBound; i++) {
                    for (var j = 0; j < 2 * object.yBound; j++) {
                        var xToCheck = (object.x - object.xBound) + i;
                        var yToCheck = (object.y - object.yBound) + j;
                        
                        if (this.PointOverlaps(xToCheck, yToCheck)){
                            //Check if the point lies inside the bounds of ANY object in the room.
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

/** Run inside of the {@link Oversimplified.GameObject#Do}, {@link Oversimplified.GameObject#BeforeDo}, or {@link Oversimplified.GameObject#AfterDo}
 * methods (choose one) to move the GameObject away from any overlapping GameObjects 1 pixel at a time.
 * 
 * Uses {@link Oversimplified.GameObject#IsOverlapping} to find overlapping GameObjects.
 * @instance
 * @function
 * @param {boolean} [doSimple=false] - If false or not set, all pixels in the GameObject's boundaries will be scanned to check for overlaps.
 *
 * If true, it will only check the corners and centerpoints at the boundaries of the GameObject against the other GameObjects in the Room.
 * @returns {boolean} If overlapping a GameObject, it will return `true` after moving away. If not overlapping, it will return `false`.
 */
Oversimplified.GameObject.prototype.IfOverlappingThenMove = function (doSimple) {
    var overlappingObject = this.IsOverlapping(doSimple);
    
    if (overlappingObject != false) {
        this.x += Math.sign(this.x - overlappingObject.x);
        this.y += Math.sign(this.y - overlappingObject.y);

        return true;
    }
    return false;
}

/** Run inside of the {@link Oversimplified.GameObject#Do}, {@link Oversimplified.GameObject#BeforeDo}, or {@link Oversimplified.GameObject#AfterDo}
 * methods (choose one) to prevents the GameObject from moving outside of the current {@link Oversimplified.Room|Room}'s boundaries,
 * keeping the full {@link Oversimplified.GameObject#image} visible.
 * @instance
 * @function
 * @example
 * // The following will cause the `obj_player` GameObject to move right every frame,
 * // but it will stop once it reaches the Room's boundary.
 * obj_player.Do = function () {
 *     this.x++;
 * }
 * obj_player.AfterDo = function () {
 *     this.KeepInsideRoom();
 * }
 */
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

/** Checks if the mouse is within the GameObject's bounding box.
 * @instance
 * @function
 * @returns {boolean} Returns `true` if the mouse is over the GameObject or `false` if not.
 */
Oversimplified.GameObject.prototype.MouseIsOver = function () {
    return this.PointOverlaps(Oversimplified.mouse.x, Oversimplified.mouse.y);
}

/** Checks if the GameObject is clicked with the given mouse click, eg. {@link Oversimplified.mouse}.leftDown, {@link Oversimplified.mouse}.rightUp, etc.
 * @instance
 * @function
 * @param {boolean} [mouseClick={@link Oversimplified.mouse}.leftDown] - Accepts any `boolean` value, but prefers one of the {@link Oversimplified.mouse} click values.
 * @returns {boolean}
 */
Oversimplified.GameObject.prototype.Clicked = function (mouseClick) {
    mouseClick = typeof mouseClick !== 'undefined' ? mouseClick : Oversimplified.mouse.leftDown;
    return this.MouseIsOver() && mouseClick;
}

/** Move the object based upon xSpeed and ySpeed, stopping if the position it would move to would overlap with GameObjects that have
 * their `solid` flag set to `true`.
 * @instance
 * @function
 * @param {number} xSpeed - The number of pixels to move horizontally each frame. Positive numbers will move the GameObject right and negative will move it left.
 * @param {number} ySpeed - The number of pixels to move vertically each frame. Positive numbers will move the GameObject down and negative will move it up.
 * @param {boolean} [checkCollisions] - Whether or not to check for collisions at the point the GameObject would land on.
 * @param {number} [checkEveryXPixels=2] - What pixels around the GameObject's border to check for collisions. Starts at the top left and skips every other pixel until the number is reached.
 * 
 * Helpful for large sprites because checking more pixels each frame means an exponential slowdown.
 * @returns {boolean} `true` if the GameObject successfully moved and `false` if not.
 * @example
 * // Creating a `solid` GameObject will allow objects to collide with it.
 * var obj_wall = OS.Create('wall', { x: 500, y: 0, imageSrc: 'a/50/pixel/tall/image.png', solid: true });
 * // Setting the `obj_player`'s `Do()` method to use `SimpleMove()` will cause `obj_player` to move 5 pixels to the right each Frame
 * obj_player.Do = function () {
 *   this.SimpleMove(5, 0, true);
 * }
 * // But after 100 Frames, it will reach `x = 500` and stop moving because it is colliding with the `solid` wall!
 */
Oversimplified.GameObject.prototype.SimpleMove = function (xSpeed, ySpeed, checkCollisions, checkEveryXPixels) {
    checkEveryXPixels = (typeof checkEveryXPixels !== 'undefined') ? checkEveryXPixels : 2;
    var collisionLeft = false,
        collisionRight = false,
        collisionUp = false,
        collisionDown = false;
    if (checkCollisions) {
        for (var vert = 0; vert < this.yBound * 2; vert += checkEveryXPixels) {
            var yToCheck = (this.y - this.yBound + vert);
            collisionLeft = xSpeed < 0 && Oversimplified.CollisionAtPoint((this.x - this.xBound) + xSpeed, yToCheck);
            collisionRight = xSpeed > 0 && Oversimplified.CollisionAtPoint((this.x + this.xBound) + xSpeed, yToCheck);

            if (collisionLeft || collisionRight) break;
        }
        for (var hor = 0; hor < this.xBound * 2; hor += checkEveryXPixels) {
            var xToCheck = (this.x - this.xBound + hor);
            collisionUp = ySpeed < 0 && Oversimplified.CollisionAtPoint(xToCheck, (this.y - this.yBound) + ySpeed);
            collisionDown = ySpeed > 0 && Oversimplified.CollisionAtPoint(xToCheck, (this.y + this.yBound) + ySpeed);

            if (collisionUp || collisionDown) break;
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

/** Runs the GameObject's {@link Oversimplified.GameObject#End} method and removes it from memory. Destroyed GameObjects are irretrievable.
 * @instance
 * @function
 */
Oversimplified.GameObject.prototype.Destroy = function () {
    this.End();
    delete Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].objects[this.name];
}

/** Check if the point lies inside the bounds of ANY {@link Oversimplified.GameObject} in the current {@link Oversimplified.Room}.
 * @function
 * @param {number} x - The `x` position to check.
 * @param {number} y - The `y` position to check.
 * @returns {(Oversimplified.GameObject[]|false)} If the point falls within any GameObjects, an array containing those
 * GameObjects will be returned. If no GameObjects overlap that point, then `false` will be returned.
 */
Oversimplified.GameObjectsAtPoint = function (x, y) {
    var objectsAtPoint = [];
    for (var obj in Oversimplified.O) {
        var object = Oversimplified.O[obj];
        if (object.PointOverlaps(x, y)) {
            objectsAtPoint.push(object);
        }
    }
    
    if (objectsAtPoint.length > 0) {
        return objectsAtPoint;
    } else {
        return false;
    }
}

/** Check if the point lies inside the bounds of ANY {@link Oversimplified.GameObject} in the current {@link Oversimplified.Room} that
 * has its `solid` flag set to `true`.
 * @function
 * @param {number} x - The `x` position to check.
 * @param {number} y - The `y` position to check.
 * @returns {boolean} Whether a `solid` object overlaps with the specified point.
 */
Oversimplified.CollisionAtPoint = function (x, y) {
    var objectsAtPoint = Oversimplified.GameObjectsAtPoint(x, y);

    if (objectsAtPoint !== false) {
        for (var i = 0; i < objectsAtPoint.length; i++) {
            if (objectsAtPoint[i].solid == true) {
                return true;
            }
        }
    }

    return false;
}

// Animations Namespace
/** Contains all of the animations used in {@link Oversimplified.GameObjects}.
 *
 * Conveniently aliased with `{@link OS.A}`, for example
 *
 * ```
 * var ani_walk = {@link OS.A}.Add('player_walk', 32, 48);
 * ```
 * is the same as
 *
 * ```
 * var ani_walk = {@link Oversimplified.Animations}.Add('player_walk', 32, 48);
 * ```
 * @namespace
 * 
 */
Oversimplified.Animations = {};

/** A convenient alias for {@link Oversimplified.Animations}.
 *
 * _Anywhere_ you might type `Oversimplified.Animations`, you can substitute `OS.A` instead to save some typing.
 * @namespace
 * @alias OS.A
 * @see {@link Oversimplified.Animations}
 */
Oversimplified.A = Oversimplified.Animations;

/** Add a {@link Oversimplified.Animation|Animation} to the collection of Animations with the name `name`.
 *
 * This function is also available as `Oversimplified.Animations.New`, so you can use whichever you prefer.
 * @function
 * @param {string} name - The name that will be used to store and access the created animation.
 * @param {number} frameWidth - The width of a single animation frame on the sprite sheet.
 * @param {number} frameHeight - The height of a single animation frame on the sprite sheet.
 * @param {Object} options
 * @param {number} [options.columns=1] - The number of frames in the sprite sheet horizontally.
 * @param {number} [options.rows=1] - The number of frames in the sprite sheet vertically. Each row must have the same number of columns.
 * @param {number} [options.speed=1] - A number between 0 and 1 where 1 is the speed of the room and 0 is stopped. For example, using `0.5`
 * on a room with a step of `1/30` will make 2 {@link Oversimplified.Frame|Frames} pass for each animation frame, effectively making it animate
 * half as fast.
 * @param {number} [options.xOffset=0] - The horizontal pixel where the animation set starts on the image. This can be useful if your sprite sheet contains multiple animations.
 * @param {number} [options.yOffset=0] - The vertical pixel where the animation set starts on the image. This can be useful if your sprite sheet contains multiple animations.
 */
Oversimplified.Animations.Add = function (name, frameWidth, frameHeight, options) {
    if (typeof Oversimplified.Animations[name] === 'undefined') {
        Oversimplified.Animations[name] = new Oversimplified.Animation(name, frameWidth, frameHeight, options);
        return Oversimplified.Animations[name];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.error("An animation with the name \"" + name + "\" already exists!");
        return false;
    }
};

// Optional alias for Oversimplified.Animations.Add()
Oversimplified.Animations.New = Oversimplified.Animations.Add;

// Animation class (for use with sprite sheets)
//
// Prevents animation mess-ups by preventing speeds higher than one with Oversimplified.Math.clamp01.
/** Create an Animation specification for using on {@link Oversimplified.GameObject}
 * @class
 * @classdesc Stores information about how to animate a sprite sheet, given that the source image has frames of equal size and spacing.
 * The source image _can_ be a single frame.
 * 
 * Access using {@link Oversimplified.Animations.Add}.
 * @param {string} name - The name that will be used to store and access the created animation.
 * @param {number} frameWidth - The width of a single animation frame on the sprite sheet in pixels.
 * @param {number} frameHeight - The height of a single animation frame on the sprite sheet in pixels.
 * @param {Object} options
 * @param {number} [options.columns=1] - The number of frames in the sprite sheet horizontally.
 * @param {number} [options.rows=1] - The number of frames in the sprite sheet vertically. Each row must have the same number of columns.
 * @param {number} [options.speed=1] - A number between 0 and 1 where 1 is the speed of the room and 0 is stopped. For example, using `0.5`
 * on a room with a step of `1/30` will make 2 {@link Oversimplified.Frame|Frames} pass for each animation frame, effectively making it animate
 * half as fast.
 * @param {number} [options.xOffset=0] - The horizontal pixel where the animation set starts on the image. This can be useful if your sprite sheet contains multiple animations.
 * @param {number} [options.yOffset=0] - The vertical pixel where the animation set starts on the image. This can be useful if your sprite sheet contains multiple animations.
 */
Oversimplified.Animation = function (name, frameWidth, frameHeight, options) {
    options = typeof options !== 'undefined' ? options : {};

    /** The internal ID of this Animation.
     * @instance
     * @type {number}
     * @readonly
     */
    this.id = Oversimplified.nextID++;

    //Required Options
    /** The name given to the Animation at creation.
     * @instance
     * @type {string}
     */
    this.name = name;

    /** The width of a single frame of animation on the sprite sheet in pixels.
     * @instance
     * @type {number}
     */
    this.width = frameWidth;

    /** The height of a single frame of animation on the sprite sheet in pixels.
     * @instance
     * @type {number}
     */
    this.height = frameHeight;

    //Optional Options
    /** The number of frames in the sprite sheet horizontally.
     * @instance
     * @type {number}
     */
    this.columns = typeof options.columns !== 'undefined' ? options.columns : 1;

    /** The number of frames in the sprite sheet vertically. Each row must have the same number of columns.
     * @instance
     * @type {number}
     */
    this.rows = typeof options.rows !== 'undefined' ? options.rows : 1;

    /** A number between 0 and 1 where 1 is the speed of the room and 0 is stopped. For example, `0.5` in a Room with a step
     * of `1/30` will make 2 {@link Oversimplified.Frame|Frames} pass for each animation frame, effectively making it animate
     * half as fast.
     * @instance
     * @type {number}
     */
    this.speed = typeof options.speed !== 'undefined' ? Oversimplified.Math.clamp01(options.speed) : 1;

    /** The horizontal pixel where the animation set starts on the image. This can be useful if your sprite sheet contains multiple animations.
     * @instance
     * @type {number}
     */
    this.xOffset = typeof options.xOffset !== 'undefined' ? options.xOffset : 0;

    /** The vertical pixel where the animation set starts on the image. This can be useful if your sprite sheet contains multiple animations.
     * @instance
     * @type {number}
     */
    this.yOffset = typeof options.yOffset !== 'undefined' ? options.yOffset : 0;
}

/** Identifies this object as an Animation
 * @instance
 * @type {string}
 * @readonly
 * @default "Animation"
 */
Oversimplified.Animation.prototype.type = "Animation";



//  Effects namespace
/** A container for sound effects and music, called `Sounds` and `Tunes`, respectively.
 * @namespace
 */
Oversimplified.Effects = {
    /** Contains any sound effects created using {@link Oversimplified.Effects.AddSound}.
     * @namespace
     * @memberof Oversimplified.Effects
     */
    Sounds: {},
    /** Contains any music created using {@link Oversimplified.Effects.AddTune}.
     * 
     * This namespace is also available as `Oversimplified.Effects.Music`, so you can use whichever you prefer.
     * @namespace
     * @memberof Oversimplified.Effects
     */
    Tunes: {},
}

/** A convenient alias for {@link Oversimplified.Effects}.
 *
 * _Anywhere_ you might type `Oversimplified.Effects`, you can substitute `OS.E` instead to save some typing.
 * @namespace
 * @alias OS.E
 * @see {@link Oversimplified.Effects}
 */
Oversimplified.E = Oversimplified.Effects;

/** A convenient alias for {@link Oversimplified.Effects.Sounds}.
 *
 * _Anywhere_ you might type `Oversimplified.Effects.Sounds`, you can substitute `OS.E.S` instead to save some typing.
 * @namespace
 * @alias OS.E.S
 * @see {@link Oversimplified.Effects.Sounds}
 */
Oversimplified.Effects.S = Oversimplified.Effects.Sounds;

/** A convenient alias for {@link Oversimplified.Effects.Tunes}.
 *
 * _Anywhere_ you might type `Oversimplified.Effects.Tunes`, you can substitute `OS.E.T` instead to save some typing.
 * 
 * Likewise, you can also use `OS.E.M` as an alias that references the `Oversimplified.Effects.Music` alias instead
 * if you prefer that terminology. Either way, it all points back to `Oversimplified.Effects.Tunes`.
 * @namespace
 * @alias OS.E.T
 * @see {@link Oversimplified.Effects.Tunes}
 */
Oversimplified.Effects.T = Oversimplified.Effects.Music = Oversimplified.Effects.M = Oversimplified.Effects.Tunes;

/** Creates a new {@link Oversimplified.Sound} in the {@link Oversimplified.Effects.Sounds} namespace.
 * 
 * This function is also available as `Oversimplified.Effects.NewSound`, so you can use whichever you prefer.
 * @function
 * @param {string} soundName - A unique name for the sound effect that will be created.
 * @param {Object} soundSources - At least one source type needs to be provided or else no sound will play and the browser may throw errors.
 * @param {string} [soundSources.wav] - The path to a `.wav` sound file.
 * @param {string} [soundSources.mp3] - The path to a `.mp3` sound file.
 * @param {string} [soundSources.ogg] - The path to a `.ogg` sound file.
 */
Oversimplified.Effects.AddSound = function (soundName, soundSources) {
    if (typeof Oversimplified.Effects.Sounds[soundName] === 'undefined') {
        Oversimplified.Effects.Sounds[soundName] = new Oversimplified.Sound(soundName, soundSources);
        return Oversimplified.Effects.Sounds[soundName];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.error("A Sound with the name \"" + soundName + "\" already exists!");
        return false;
    }
}
Oversimplified.Effects.NewSound = Oversimplified.Effects.AddSound;

/** Creates a new {@link Oversimplified.Tune} in the {@link Oversimplified.Effects.Tunes} namespace.
 *
 * This function is also available as `Oversimplified.Effects.NewTune`, so you can use whichever you prefer.
 * 
 * Or if you prefer the terminology of `Oversimplified.Effects.Music`, you can instead use `Oversimplified.Effects.AddMusic`
 * or `Oversimplified.Effects.NewMusic`. It all points to the same function.
 * @function
 * @param {string} tuneName - A unique name for the Tune that will be created.
 * @param {Object} options - At least one source type needs to be provided or else no sound will play and the browser may throw errors.
 * @param {(string|boolean)} [options.wav=false] - The path to a `.wav` sound file.
 * @param {(string|boolean)} [options.mp3=false] - The path to a `.mp3` sound file.
 * @param {(string|boolean)} [options.ogg=false] - The path to a `.ogg` sound file.
 * @param {number} [options.start=0] - The number of seconds into the audio to start playing the the audio file. Useful for if your audio starts a number of seconds after 0.
 * @param {(number|boolean)} [options.duration=false] - The length of time in seconds to play the audio file before looping. This will only cause an early loop if the duration
 * specified here is shorter than the actual duration of the audio file.
 */
Oversimplified.Effects.AddTune = function (tuneName, tuneSources) {
    if (typeof Oversimplified.Effects.Tunes[tuneName] === 'undefined') {
        Oversimplified.Effects.Tunes[tuneName] = new Oversimplified.Sound(tuneName, tuneSources);
        return Oversimplified.Effects.Tunes[tuneName];
    } else {
        if (Oversimplified.DEBUG.showMessages) console.error("A Tune with the name \"" + tuneName + "\" already exists!");
        return false;
    }
}
Oversimplified.Effects.AddMusic = Oversimplified.Effects.NewTune = Oversimplified.Effects.NewMusic = Oversimplified.Effects.AddTune;

/** Checks every {@link Oversimplified.Tune} to see if it needs to loop.
 * @function
 * @restricted
 */
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
/** Create a new sound effect. A `.wav` file would be the ideal format for a sound effect with `.mp3` as a secondary source.
 * Unless you are specifically targeting one browser, it is best to provide the audio file in all 3 file formats so the browser can use the best one.
 * 
 * Adds an HTML5 Audio element to an element with an `id` of `audio`.
 * @class
 * @classdesc A sound effect that plays once each time {@link Oversimplified.Sound#Play} is called. All Sounds created reference an HTML5 audio element contained in
 * an element with an `id` of `audio`. If using the default `index.html` file included with OversimplifiedJS, you do not need to add this yourself.
 * @param {string} name - The name of the created Sound.
 * @param {Object} options - At least one source type needs to be provided or else no sound will play and the browser may throw errors.
 * @param {(string|boolean)} [options.wav=false] - The path to a `.wav` sound file.
 * @param {(string|boolean)} [options.mp3=false] - The path to a `.mp3` sound file.
 * @param {(string|boolean)} [options.ogg=false] - The path to a `.ogg` sound file.
 * @param {number} [options.start=0] - The number of seconds into the audio to start playing the the audio file. Useful for if your audio starts a number of seconds after 0.
 */
Oversimplified.Sound = function (name, options) {
    /** The internal ID of this Sound.
     * @instance
     * @type {number}
     * @readonly
     */
    this.id = Oversimplified.nextID++;

    options = typeof options !== 'undefined' ? options : {};

    /** The name given to the Sound at creation.
     * @instance
     * @type {string}
     */
    this.name = name;

    /** The file paths of each provided audio file source.
     * @instance
     * @type {Object}
     * @param {string} [wav=false] - The path to the `.wav` audio file for this Sound.
     * @param {string} [mp3=false] - The path to the `.mp3` audio file for this Sound.
     * @param {string} [ogg=false] - The path to the `.ogg` audio file for this Sound.
     */
    this.source = {
        mp3: (typeof options.mp3 !== 'undefined' && options.mp3.length > 0) ? options.mp3 : false,
        wav: (typeof options.wav !== 'undefined' && options.wav.length > 0) ? options.wav : false,
        ogg: (typeof options.ogg !== 'undefined' && options.ogg.length > 0) ? options.ogg : false
    };

    /** The second to start playing the audio file at.
     * @instance
     * @type {number}
     * @default 0
     */
    this.start = (typeof options.start !== 'undefined') ? options.start : 0;

    /** The reference to the HTMLAudioElement that is added to the HTML to embed the audio.
     * 
     * This property is also available as `Sound.element`, so you can use whichever you prefer.
     * @instance
     * @type {HTMLAudioElement}
     * @readonly
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement|HTMLAudioElement}
     */
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

/** Identifies that this object is a `Sound`
 * @type {string}
 * @readonly
 * @default "Sound"
 */
Oversimplified.Sound.prototype.type = "Sound";

/** Plays the audio file connected to this Sound at the volume specified in {@link Oversimplified.Settings}.soundVolume.
 * @instance
 * @function
 */
Oversimplified.Sound.prototype.Play = function () {
    this.audioElement.currentTime = this.start;
    this.audioElement.volume = Oversimplified.Settings.soundVolume;
    this.audioElement.play();
}

/** Stops the audio file connected to this Sound from playing.
 * @instance
 * @function
 */
Oversimplified.Sound.prototype.Stop = function () {
    this.audioElement.pause();
    this.audioElement.currentTime = this.start;
}

/** Returns whether the audio file connected to this Sound is playing.
 * @instance
 * @function
 * @returns {boolean}
 */
Oversimplified.Sound.prototype.IsPlaying = function () {
    return !this.audioElement.paused && !this.audioElement.ended && 0 < this.audioElement.currentTime;
}

/*  Tune Class
    
    Preferably source should be a .mp3 file and secondarySource should be a .ogg file.    
    If duration is specified, loop when duration is reached.
*/
/** Create a new piece of music to loop. A `.mp3` file would be the ideal format for a sound effect with `.ogg` as a secondary source.
 * Unless you are specifically targeting one browser, it is best to provide the audio file in all 3 file formats so the browser can use the best one.
 *
 * Adds an HTML5 Audio element to an element with an `id` of `audio`.
 * @class
 * @classdesc A piece of music that plays continuously when {@link Oversimplified.Tune#Play} is called. All Tunes created reference an HTML5 audio element contained in
 * an element with an `id` of `audio`. If using the default `index.html` file included with OversimplifiedJS, you do not need to add this yourself.
 * @param {string} name - The name of the created Tune.
 * @param {Object} options - At least one source type needs to be provided or else no sound will play and the browser may throw errors.
 * @param {(string|boolean)} [options.wav=false] - The path to a `.wav` sound file.
 * @param {(string|boolean)} [options.mp3=false] - The path to a `.mp3` sound file.
 * @param {(string|boolean)} [options.ogg=false] - The path to a `.ogg` sound file.
 * @param {number} [options.start=0] - The number of seconds into the audio to start playing the the audio file. Useful for if your audio starts a number of seconds after 0.
 * @param {(number|boolean)} [options.duration=false] - The length of time in seconds to play the audio file before looping. This will only cause an early loop if the duration
 * specified here is shorter than the actual duration of the audio file.
 */
Oversimplified.Tune = function (name, options) {
    /** The internal ID of this Sound.
     * @instance
     * @type {number}
     * @readonly
     */
    this.id = Oversimplified.nextID++;

    sources = typeof sources !== 'undefined' ? sources : {};

    /** The name given to the Sound at creation.
     * @instance
     * @type {string}
     */
    this.name = name;

    /** The file paths of each provided audio file source.
     * @instance
     * @type {Object}
     * @param {string} [wav=false] - The path to the `.wav` audio file for this Sound.
     * @param {string} [mp3=false] - The path to the `.mp3` audio file for this Sound.
     * @param {string} [ogg=false] - The path to the `.ogg` audio file for this Sound.
     */
    this.source = {
        mp3: (typeof options.mp3 !== 'undefined' && options.mp3.length > 0) ? options.mp3 : false,
        wav: (typeof options.wav !== 'undefined' && options.wav.length > 0) ? options.wav : false,
        ogg: (typeof options.ogg !== 'undefined' && options.ogg.length > 0) ? options.ogg : false
    };

    /** The second to start playing the audio file at.
     * @instance
     * @type {number}
     * @default 0
     */
    this.start = (typeof options.start !== 'undefined') ? options.start : 0;

    /** The length of time in seconds to play the audio file before looping.
     * @instance
     * @type {number}
     * @default false
     */
    this.duration = (typeof options.duration !== 'undefined') ? options.duration : false;

    /** The reference to the HTMLAudioElement that is added to the HTML to embed the audio.
     * 
     * This property is also available as `Tune.element`, so you can use whichever you prefer.
     * @instance
     * @type {HTMLAudioElement}
     * @readonly
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement|HTMLAudioElement}
     */
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

/** Identifies that this object is a `Tune`
 * @type {string}
 * @readonly
 * @default "Tune"
 */
Oversimplified.Tune.prototype.type = "Tune";

/** Plays the audio file connected to this Tune at the volume specified in {@link Oversimplified.Settings}.tuneVolume.
 * 
 * Please note that changing the volume directly in the `Oversimplified.Settings` after a Tune is already playing will not automatically adjust
 * its volume. Use {@link Oversimplified.Settings.SetVolume} to ensure that any playing Tunes get their volume adjusted while playing.
 * @instance
 * @function
 */
Oversimplified.Tune.prototype.Play = function () {
    this.audioElement.currentTime = this.start;
    this.audioElement.volume = Oversimplified.Settings.tuneVolume;
    this.audioElement.loop = true;
    this.audioElement.play();
}

/** Stops the audio file connected to this Tune from playing.
 * @instance
 * @function
 */
Oversimplified.Tune.prototype.Stop = function () {
    this.audioElement.pause();
    this.audioElement.currentTime = this.start;
}

/** Internal function that checks whether the audio should loop. If its `duration` is less than the actual duration, it will loop when it has played for that long.
 * @instance
 * @function
 * @restricted
 */
Oversimplified.Tune.prototype.CheckLoop = function () {
    if (this.duration < this.audioElement.duration) {
        if (this.audioElement.currentTime > this.duration) {
            this.audioElement.currentTime = this.start;
        }
    }
}

/** Returns whether the audio file connected to this Tune is playing.
 * @instance
 * @function
 * @returns {boolean}
 */
Oversimplified.Tune.prototype.IsPlaying = function () {
    return !this.audioElement.paused && !this.audioElement.ended && 0 < this.audioElement.currentTime;
}

/** Internal function used by {@link Oversimplified.PremadeObject} to copy an {@link Oversimplified.GameObject}.
 * 
 * It is recommended that you not use this to copy objects.
 * @function
 * @restricted
 * @param {Oversimplified.GameObject} object - The GameObject to copy.
 * @param {Object} objectOptions
 * @param {any} [options....] - Any additional parameter passed in the `options` will be added directly to the resulting GameObject,
 * overwriting if they are existing properties.
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


/** Save a specific value to the browser's `{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage|localStorage}`, if it exists.
 * Overwrites any data that was previously set at the same location.
 * @function
 * @param {string} location - The key used to store the data. This can be anything, but it can be helpful to use an identifier like "level1/goals/enemiesToDefeat".
 * @param {(string|number|boolean)} data - The data to store. Must be a basic value type, but you can use `{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify|JSON.stringify()}`
 * to turn any basic JavaScript Object (i.e. _not_ a GameObject or other class) into a `string`.
 * @returns {boolean} Returns `true` if the value is saved successfully or `false` if not saved. Set `{@link Oversimplified.DEBUG}.showMessages = true` to see console messages about what went wrong.
 * @see {@link Oversimplified.Load}
 * @see {@link Oversimplified.Erase}
 */
Oversimplified.Save = function (location, data) {
    // Set and overwrite data at specified location in browser's Local Storage
    if(typeof(Storage) !== "undefined") {
        window.localStorage.setItem(location, data);
        if (window.localStorage.getItem(location) == data) {
            if (Oversimplified.DEBUG.showMessages) console.log("Successfully saved " + data + " to localStorage[\"" + location + "\"].");
            return true;
        } else {
            if (Oversimplified.DEBUG.showMessages) console.error("Could not save " + data + " to localStorage[\"" + location + "\"].");
        }
    } else {
        if (Oversimplified.DEBUG.showMessages) console.error("This browser does not support saving to localStorage.");
    }
    return false;
}

/** Load a previously-saved value from the browser's `{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage|localStorage}`, if it exists.
 * @function
 * @param {string} location - The key where the data is was previously stored using {@link Oversimplified.Save}.
 * @returns {(string|number|boolean|undefined)} Returns the value of the stored data found at `location` or `undefined` if nothing is found at that location. Set `{@link Oversimplified.DEBUG}.showMessages = true` to see console messages about what went wrong.
 * 
 * Remember: If you previously used `{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify|JSON.stringify()}` to save the data, be sure to
 * use `{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse|JSON.parse()}` to turn it back into a JavaScript Object before trying to use the data!
 * @see {@link Oversimplified.Save}
 * @see {@link Oversimplified.Erase}
 */
Oversimplified.Load = function (location) {
    // Load data from specified location in browser's Local Storage
    if(typeof(Storage) !== "undefined") {
        if (window.localStorage.getItem(location)) {
            if (Oversimplified.DEBUG.showMessages) console.log("Successfully loaded from localStorage[\"" + location + "\"].");
            return window.localStorage.getItem(location);
        } else {
            if (Oversimplified.DEBUG.showMessages) console.error("No data saved in localStorage[\"" + location + "\"].");
        }
    } else {
        if (Oversimplified.DEBUG.showMessages) console.error("This browser does not support loading from localStorage.");
    }
    return undefined;
}

/** Delete a previously-saved value from the browser's `{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage|localStorage}`, if it exists.
 * @function
 * @param {string} location - The key where the data is was previously stored using {@link Oversimplified.Save}.
 * @returns {boolean} Returns `true` if the value is erased successfully or `false` if not erased. Note that `false` will be returned if the location specified does not exist in `localStorage`,
 * so if you have already deleted the value, it will return `false` if you try to delete it again. Set `{@link Oversimplified.DEBUG}.showMessages = true` to see console messages about what went wrong.
 * @see {@link Oversimplified.Save}
 * @see {@link Oversimplified.Load}
 */
Oversimplified.Erase = function (location) {
    // Remove data at specified location in browser's Local Storage
    if(typeof(Storage) !== "undefined") {
        if (window.localStorage.getItem(location)) {
            window.localStorage.removeItem(location);
            if (!window.localStorage.getItem(location)) {
                if (Oversimplified.DEBUG.showMessages) console.log("Successfully erased localStorage[\"" + location + "\"].");
                return true;
            } else {
                if (Oversimplified.DEBUG.showMessages) console.error("Could not erase localStorage[\"" + location + "\"].");
            }
        } else {
            if (Oversimplified.DEBUG.showMessages) console.warn("There is no data to remove from localStorage[\"" + location + "\"].");
        }
    } else {
        if (Oversimplified.DEBUG.showMessages) console.error("This browser does not support manipulating localStorage.");
    }
    return false;
}



// DEBUG namespace
/** A collection of tools to help you as you develop.
 * @namespace
 */
Oversimplified.DEBUG = {
    /** Whether or not to show console messages from various Oversimplified objects.
     * @type {boolean}
     * @default true
     */
    showMessages: true,
    
    /** Draw a magenta bounding box around the specified {@link Oversimplified.GameObject} representing the object's collision extents.
     * 
     * Run this in the GameObject's {@link Oversimplified.GameObject#DrawAbove|DrawAbove()} method to ensure it is drawn every frame.
     * @function
     * @param {Oversimplified.GameObject} object
     */
    DrawBoundingBox: function (object) {
        var fillStyle = Oversimplified.context.fillStyle;
        Oversimplified.context.fillStyle = "rgba(255, 0, 255, 0.5)";
        Oversimplified.context.fillRect(object.x - object.xBound - Oversimplified.camera.x, object.y - object.yBound - Oversimplified.camera.y, object.xBound * 2, object.yBound * 2);
        Oversimplified.context.fillStyle = fillStyle;
    },
    
    /** Return the number of {@link Oversimplified.GameObject} currently in the {@link Oversimplified.Room}.
     * @function
     * @param {string} [roomName] - The `name` of the {@link Oversimplified.Room} to check. If excluded, the {@link Oversimplified.Rooms.currentRoomName|current room} will be used instead.
     * @returns {number} The number of objects in the 
     */
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
    
    /** The number of objects currently being drawn on the canvas.
     * @type {number}
     * @readonly
     */
    objectsOnScreen: 0,
    
    /** List all current controls to the console.
     * @function
     */
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

/*
window.onload call
*/
window.onload = function () {Oversimplified.Initialize();};

/** Set up important engine pieces. This is automatically run during `{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event|window.onload}`, but if
 * there is another place in your code that sets `window.onload`, then Oversimplified.Initialize() will need to be manually called!
 * @function
 * @restricted
 */
Oversimplified.Initialize = function () {
    Oversimplified.SetupCanvas();
    
    Oversimplified.SetupControls();
    
    Oversimplified.AddScript("start.js", function(){
        start();
        Oversimplified.SetCanvasToCameraSize();
        Oversimplified.Frame();    //Only run the first frame after Start has been loaded.
    });
}

/** Set up the {@link Oversimplified.canvas} and {@link Oversimplified.context}. This is automatically run during `{@link Oversimplified.Initialize}` and should only be run once.
 * 
 * Requires that an HTML5 canvas element with an `id` of `game` exists in the HTML. If using the default `index.html` file included with OversimplifiedJS, you do not need to add this yourself.
 * @function
 * @restricted
 */
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

/** Set up the {@link Oversimplified.Controls}. This is automatically run during `{@link Oversimplified.Initialize}` and should only be run once.
 * @function
 * @restricted
 */
Oversimplified.SetupControls = function () {
    Oversimplified.SetupMouseListeners();
    Oversimplified.SetupKeyboardListeners();
}

/** Set up the {@link Oversimplified.mouse}. This is automatically run during `{@link Oversimplified.Initialize}` and should only be run once.
 * @function
 * @restricted
 */
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

/** Set up listeners for {@link Oversimplified.pressedKeys}, {@link Oversimplified.heldKeys}, and {@link Oversimplified.releasedKeys}.
 * This is automatically run during `{@link Oversimplified.Initialize}` and should only be run once.
 * 
 * Disables keyboard browser navigation with arrow keys, space, and tab.
 * @function
 * @restricted
 * @todo Change `which` and `keyCode` to `key` since they are both deprecated. Also update the use of {@link Oversimplified.Key} and {@link Oversimplified.Keycode} to just use values
 * directly from {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key} to save some space. This will set a hard browser version limit, however.
 */
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

/** Change the size of the {@link Oversimplified.canvas} to match the height and width of {@link Oversimplified.camera}. This is automatically run during `{@link Oversimplified.Initialize}`,
 * after the `start.js` script is run and each time {@link Oversimplified.SetCamera} is used.
 * @function
 * @restricted
 */
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

/** Defines the order of operations for everything that is run each frame. This function checks loading scripts, and when everything is loaded,
 * it runs {@link Oversimplified.Update}, then {@link Oversimplified.Draw}, then {@link Oversimplified.EndFrame} in that order before calling
 * itself again. It also keeps track of its own timing data to ensure that frames are run as close as possible to the desired step speed.
 * 
 * See the linked Tutorial for a full explanation of the frame and its flow.
 * @function
 * @restricted
 * @tutorial Understanding the Frame
 */
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

/** Runs all mechanical/action-based/calculation functions in order every time {@link Oversimplified.Frame} is run.
 * 
 * See {@tutorial Understanding the Frame} for the specific sequence of events that occurs each time this method is run.
 * @function
 * @restricted
 */
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

/** Runs all drawing functions in order every time {@link Oversimplified.Frame} is run.
 *
 * See {@tutorial Understanding the Frame} for the specific sequence of events that occurs each time this method is run.
 * @function
 * @restricted
 */
Oversimplified.Draw = function () {
    Oversimplified.context.clearRect(0, 0, Oversimplified.canvas.width, Oversimplified.canvas.height);
    Oversimplified.DEBUG.objectsOnScreen = 0;
    
    if (typeof Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName] !== 'undefined') {
        Oversimplified.Rooms[Oversimplified.Rooms.currentRoomName].Draw();
    } else {
        if (Oversimplified.DEBUG.showMessages) console.log("There is no current room. Please add one or make sure you are referencing the correct room with Oversimplified.Rooms.SetRoom().");
    }
}

/** Resets the status of mouse and keys and checks if any Tunes need to loop each {@link Oversimplified.Frame}.
 * @function
 * @restricted
 */
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
    
    Oversimplified.Effects.Tunes.CheckLoops();
}

/** Prevent scrolling page when scrolling inside canvas. This is used within `{@link Oversimplified.SetupMouseListeners}` and should not be run separately.
 * @function
 * @restricted
 */
Oversimplified.MouseWheelHandler = function (e) {
    e.preventDefault();
    
    Oversimplified.mouse.wheel = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));    //reverse Firefox's detail value and return either 1 for up or -1 for down
}

/** Check if the defined point (x, y) or object x is currently visible on the canvas.
 * @function
 * @param {number} x - The x value to check.
 * @param {number} y - The y value to check.
 * @returns {boolean}
 */
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

/** Dynamically add a source script to the page.
 * 
 * You can either specify a main function or just make the main function within the script the same as the script's name (minus `.js`).
 * @function
 * @param {string} pathToScript - The path to the JavaScript file to load and run.
 * @param {string} [mainFunction=filename] - The name of the function to run once the script has been loaded. Defaults to the name of the JavaScript file without `.js`.
 * @tutorial Adding Scripts
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

/** Callback function that prevents any added scripts from executing until all scripts are loaded.
 * @function
 * @restricted
 */
Oversimplified.WaitForScriptsToLoad = function (Function) {
    if (Oversimplified.DEBUG.showMessages && Oversimplified.loadingScripts.length > 0) console.log("Waiting for " + (Oversimplified.numberOfScriptsToLoad - Oversimplified.loadedScripts.length).toString() + " scripts to load");

    if (Oversimplified.loadingScripts.length > 0) {
        setTimeout(function(){Oversimplified.WaitForScriptsToLoad(Function)}, 0.1);
    } else {
        Function();
    }
}

/** Global function to detect Internet Explorer
 * @function
 * @returns {boolean}
 */
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
/** Where useful number-related functions are stored.
 * @namespace
 */
Oversimplified.Math = {};

/** Make sure the value does not fall outide a min-max range.
 * @function
 * @param {number} value - The number to check.
 * @param {number} min - The lowest number to return.
 * @param {number} max - The highest number to return.
 * @returns {number}
 * @example
 * var numberValue = 11;
 * numberValue = Oversimplified.Math.clamp(numberValue, 3, 10);
 * // numberValue === 10
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


/** Make sure the given value does not fall outide the 0-1 range.
 * @function
 * @param {number} value - The value to check.
 * @example
 * var numberValue = 1.325;
 * numberValue = Oversimplified.Math.clamp01(numberValue);
 * // numberValue === 1
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


/** Return the given value as a clamped angle between 0 and 359.
 * @function
 * @param {number} value - The number to check
 * @param {number} [min=0] - The lowest number to return. Will always be a positive number greater than or equal to 0.
 * @param {number} [max=0] - The highest number to return. Will always be a positive number less than 360.
 * @example
 * var numberValue = 380;
 * numberValue = Oversimplified.Math.clampAngle(numberValue, 0, 180);
 * // numberValue === 20
 * // OR
 * var numberValue2 = 365;
 * numberValue2 = Oversimplified.Math.clampAngle(numberValue2);
 * // numberValue2 === 5
 */
Oversimplified.Math.clampAngle = function (value, min, max) {
    min = typeof min !== 'undefined' ? min : 0;
    max = typeof max !== 'undefined' ? max : 359;
    // Make sure angle is between 0 and 360
    while (value >= 360) {
        value -= 360;
    }
    while (value < 0) {
        value += 360;
    }
    
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

    return value;
};


/** Convert a {@link https://en.wikipedia.org/wiki/Radian|radian} value to degrees.
 * @function
 * @param {number} radians - The value in radians to convert to degrees in an angle.
 * @example
 * var radianValue = 0.7853981633974483;
 * var degreeValue = Oversimplified.Math.radToDeg(radianValue);
 * // degreeValue should be reliably close to 45
 */
Oversimplified.Math.radToDeg = function (radians) {
    return radians / (Math.PI / 180);
};

/** Convert a degree value to {@link https://en.wikipedia.org/wiki/Radian|radians}.
 * @function
 * @param {number} radians - The value in radians to convert to degrees in an angle.
 * @example
 * var degreeValue = 45;
 * var radianValue = Oversimplified.Math.degToRad(degreeValue);
 * // radianValue should be reliably close to 0.7853981633974483
 */
Oversimplified.Math.degToRad = function (degrees) {
    return degrees * (Math.PI / 180);
};

/** Get the cosine of an angle given in degrees.
 * @function
 * @param {number} angle - The angle to get the cosine of in degrees.
 * @example
 * var cosine = Oversimplified.Math.getCos(angleInDegrees);
 */
Oversimplified.Math.getCos = function (angle) {
    return Math.cos(Oversimplified.Math.degToRad(angle));
};

/** Get the sine of an angle given in degrees.
 * @function
 * @param {number} angle - The angle to get the sine of in degrees.
 * @example
 * var sine = Oversimplified.Math.getSin(angleInDegrees);
 */
Oversimplified.Math.getSin = function (angle) {
    return Math.sin(Oversimplified.Math.degToRad(angle));
};

/** Return `true` or `false` based on a 50% chance.
 * @function
 * @returns {boolean}
 */
Oversimplified.Math.coinFlip = function () {
    if (Math.random() >= 0.5) {
        return true;
    } else {
        return false;
    }
};

/** Return a random number between min and max (inclusive).
 * @function
 * @param {number} min - The lowest possible number to return.
 * @param {number} max - The highest possible number to return.
 * @returns {number} The number returned will always have a decimal value. Use `Math.floor()`, `Math.ceil()`, or `Math.round()` to get whole numbers as needed.
 */
Oversimplified.Math.randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
};
