OversimplifiedJS makes itself modular by utilizing {@link Oversimplified.AddScript} to dynamically add JavaScript files to the page after the `start.js` script has run. No, this does not mesh with modern module-based JavaScript and EMCAScript2015+ `import` / `export` methodologies, but it's easy, it's fast, and it works just fine! Plus you don't have to worry about setting up a script transpiler that combines everything into one file (though you can do it anyway as long as you end up with a global function called `start()` in your resulting `start.js` file).

## Creating Scripts

Extra scripts can be added using the `OS.AddScript()` function. For an added script to work, you will need the following structure:    
File name: `NameOfFunction.js`    
```javascript
function NameOfFile () {

}
```    
I used this recursive naming to make a point: The function name and the file name (before the .js) must be the same!    
Once you do this, you can create your module in that file and add it to your game by placing this code `OS.AddScript("yourfile.js");` in your start.js file (or in any already-loaded script file).

If you want a different function to be the function that runs when you add the file, use the syntax `OS.AddScript("yourfile.js", function() { YourFunction(); });` and the enclosed function will be used instead!

## Loading Scripts

Whenever you use {@link Oversimplified.AddScript} to add a JavaScript file, it adds the file's name to a queue stored in {@link Oversimplified.loadingScripts} and creates a `<script>` tag on the html page that references it. Whenever a script finishes loading into the browser, it gets moved to {@link Oversimplified.loadedScripts} because for the entire time that there are file names in {@link Oversimplified.loadingScripts}, the {@link Oversimplified.Frame} will instead display a loading bar.

You can either disable the loading bar or edit its color and appearance by modifying the values in `{@link Oversimplified.Settings}.loadingBar`. Setting `Oversimplified.Settings.loadingBar = false` will disable it altogether, but if you keep the original object, you can modify its `fillColor`, `outlineColor`, and `outlineWidth` to fit your needs.

```
// start.js
function start() {
  OS.Settings.loadingBar.fillColor = '#00ff00';  // Set the loading bar to bright green
  OS.Settings.loadingBar.outlineColor = '#000000'; // Set outline color to black
  OS.Settings.loadingBar.outlineWidth = 1; // Make outline just 1 pixel wide

  // OR

  OS.Settings.loadingBar = false; // Disables loading bar completely

  OS.AddScript('SomeScript.js');
}
```

## Loaded Scripts

When all scripts have finished loading, it will start calling the script's primary function. This function must be unique from the other scripts that have been loaded because they are added to the global `window` space. By default, the primary function for a loaded script should be exactly the same as the file's name without `.js`, but you can specify a different method to use instead.

These primary functions will be called in a roughly random order that depends entirely upon how the browser loads the script, so be sure that the modules you use don't entirely depend on other modules. Instead, you can use modules to either modify existing things or add to the OversimplifiedJS code base. The module included under [`modules/Add_GameObject_MakeDraggable.js`](https://github.com/Alamantus/OversimplifiedJS/blob/master/modules/Add_GameObject_MakeDraggable.js) does this by modifying the {@link Oversimplified.GameObject} class to add a `MakeDraggable()` method that allows you to make GameObjects that react to being clicked and dragged.