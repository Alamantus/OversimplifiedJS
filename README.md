OversimplifiedJS
=============
A lightweight, modular 2-D game engine for HTML5 canvas &amp; JavaScript designed to be a little bit too simple (for better or worse).  
(Current Version: 1.0)

[Get Started!](https://Alamantus.github.io/OversimplifiedJS/tutorial-Getting%20Started.md) or [See Documentation](https://Alamantus.github.io/OversimplifiedJS)

Things You Should Know
-------------

* OversimplifiedJS exists to make your game development process simpler by giving easy access to basic game development objects, so you'll definitely still need to know your way around JavaScript and be comfortable with text editors if you want to make a game with it.
* OversimplifiedJS has not been stress tested with lots of objects that all have complicated `Do()` functions! Be careful and report bugs to the issue tracker (or fix them yourself and send a pull request! That would be wonderful!).
* Basic browser mouse and keyboard scrolling controls are disabled on the canvas. You can right click and scroll outside of the canvas, but these default actions are disabled when hovering over the canvas (though there is a setting to allow right clicking)! Likewise, the arrow keys and space bar will not scroll the page, period. Keep this in mind when choosing your camera size.
* Don't make rooms that are smaller than your camera! I haven't tested this, but I think it'll just make things display weird...
* Objects you create in rooms retain their properties after changing rooms! If you want objects to reset after changing rooms and returning, you'll need to manually set every property back to the value you want. To make things easier for you, you can use your `OS.Room.DoLast()` function to do this when your room changes, but you'll need to specify each object's properties manually. Make sure you always Destroy unused objects or else they'll stick around in the Room for the whole game session. Destroy is used with  `OS.GameObject.Destroy()`.
* You'll want to need to have each separate direction as a separate animation set on your sprite sheet(s) in order to indicate direction. This is because inverting images in any direction (using scale) is outrageously inefficient on HTML5 canvas and is not friendly to video games.

Policy for Contribution
-------------

If you want to contribute to OversimplifiedJS's code to add/improve functionality or to include a module or something, then I absolutely welcome you to! All I ask is that you keep one question in mind: Is it simple? The way I built OversimplifiedJS focuses on giving users options and simplicity: if you want to create an object in the current room, just call `var object = OS.Create(//some prefab, {x: 10, y: 4})` and it's there and ready to be used; if you want an object to do something, the code is `object.Do = function() {//thing to do here}` _(and I would have gone without the "`= function()`" bit if JavaScript would have allowed me to)_. The point is that the code should be readable, understandable, and relatively easy to use. If your code can be described as such, then it will be welcomed with open arms!

License
-------------
MIT—You can pretty much just use this engine for whatever you want. If you use it, please let me know! I'd love to see what you can make with it. If you modify it or fork it or anything like that, also let me know so I can stay in the loop with what's happening to my code.

Thanks!  
-[Robbie Antenesse](https://robbie.antenesse.net)
