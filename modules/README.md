Modules
==========

Modules can be added using the `AddScript()` function. For an added script to work, you will need the following structure:    
File name: `name-of-function.js`    
```javascript
function name-of-file () {

}
```    
I used this recursive naming to make a point: The function name and the file name (before the .js) must be the same!    
Once you do this, you can create your module in that file and add it to your game by placing this code `AddScript("yourfile.js");` in your start.js file (or in any already-loaded script file).    
If you want a different function to be the function that runs when you add the file, use the syntax `AddScript("yourfile.js", function() { YourFunction(); });` and the enclosed function will be used instead!