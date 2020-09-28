Modules
==========

Modules can be added using the `OS.AddScript()` function. For an added script to work, you will need the following structure:    
File name: `NameOfFunction.js`    
```javascript
function NameOfFile () {

}
```    
I used this recursive naming to make a point: The function name and the file name (before the .js) must be the same!    
Once you do this, you can create your module in that file and add it to your game by placing this code `OS.AddScript("yourfile.js");` in your start.js file (or in any already-loaded script file).    
If you want a different function to be the function that runs when you add the file, use the syntax `OS.AddScript("yourfile.js", function() { YourFunction(); });` and the enclosed function will be used instead!