A `Frame` in OversimplifiedJS refers to the "frame" in the term "frames per second" that is specified using `{@link Oversimplified.Settings}.defaultStep`. The {@link Oversimplified.Frame} controls when certain things are run and does its best to ensure that it only runs things at the step speed you've specified by running as fast as possible and only running its sequence when the time is right.

This page will explain the entire sequence of events that happens each frame and how it all ties together with other OversimplifiedJS elements.

## Sequence of Events

Every `{@link Oversimplified.Settings}.defaultStep` seconds, {@link Oversimplified.Frame} will first check for any loading scripts, displaying a loading bar if it has not been disabled (see {@tutorial Adding Scripts} for full details), and when all scripts are loaded, it will update various internal timing variables and run these 3 internal methods in order:

1. {@link Oversimplified.Update}
1. {@link Oversimplified.Draw}
1. {@link Oversimplified.EndFrame}

It is important to understand that the order is very specific and will _always_ run in the specified order. This applies to everything that follows as well: every `Update` sequence will run in the order specified and will not deviate except in the case of a {@link Oversimplified.Room}'s {@link Oversimplified.GameObject}s (stored in {@link Oversimplified.Room#objects}).

### Update

The {@link Oversimplified.Update} method breaks down into its own sequence of events. (This will demonstrate each step along the way without specifying which methods mentioned are internal and should therefore not be modified—please check the methods to ensure you are modifying the correct Frame function for each element. Most of them involve the word "Do".)

1. Check the status of every {@link Oversimplified.Control} and {@link Oversimplified.Axis} created using {@link Oversimplified.Controls.Add}.
1. Run {@link Oversimplified.Rooms.AllBeforeDo} if one has been set up.
1. Run {@link Oversimplified.Rooms.AllDo} if one has been set up.
1. Run the {@link Oversimplified.Rooms.Current|current Room}'s {@link Oversimplified.Room#Update|Update()} method.
    1. Run the Room's {@link Oversimplified.Room#Start|Start()} if it hasn't run since this Room became the current one.
        1. Run the Room's {@link Oversimplified.Room#DoFirst|DoFirst()} if one has been set up.
        1. Run each of the Room's {@link Oversimplified.Room#objects|GameObjects}'s {@link Oversimplified.GameObject#Start|Start()} methods _in the order the GameObjects were added to the Room_. In that order, do the following for each GameObject:
            1. Run the GameObject's {@link Oversimplified.GameObject#DoFirst|DoFirst()} if one has been set up.
    1. Run the Room's {@link Oversimplified.Room#BeforeDo|BeforeDo()} if one has been set up.
    1. Run the Room's {@link Oversimplified.Room#Do|Do()} if one has been set up.
    1. Run each of the Room's {@link Oversimplified.Room#objects|GameObjects}'s {@link Oversimplified.GameObject#Update|Update()} methods _in the order the GameObjects were added to the Room_. In that order, do the following for each GameObject:
        1. Update the GameObject's {@link Oversimplified.GameObject#screenX|screenX}, {@link Oversimplified.GameObject#screenY|screenY}, {@link Oversimplified.GameObject#xPrevious|xPrevious}, and {@link Oversimplified.GameObject#yPrevious|yPrevious} variables.
        1. Run the GameObject's {@link Oversimplified.GameObject#Start|Start()} method, but only if it has not been run before. This allows GameObjects created _after_ the start of the Room to have a setup phase or other thing it can do before it does anything else.
            1. Run the GameObject's {@link Oversimplified.GameObject#DoFirst|DoFirst()} if one has been set up.
        1. Run the GameObject's {@link Oversimplified.GameObject#BeforeDo|BeforeDo()} if one has been set up.
        1. Run the GameObject's {@link Oversimplified.GameObject#Do|Do()} if one has been set up.
        1. Run the GameObject's {@link Oversimplified.GameObject#AfterDo|AfterDo()} if one has been set up.
        1. Update the GameObject's `{@link Oversimplified.GameObject#sprite|sprite}.rotation` to ensure it stays within 0 and 359.
    1. Run the Room's {@link Oversimplified.Room#AfterDo|AfterDo()} if one has been set up.
1. Run {@link Oversimplified.Rooms.AllDo} if one has been set up.
1. If the {@link Oversimplified.camera} has been set to follow a GameObject using {@link Oversimplified.camera.Follow}, move the camera's position to keep that GameObject on screen.
1. Ensure the camera does not leave the bounds of the current Room.

### Draw

After all of the functional operations have been performed, the Frame moves on to {@link Oversimplified.Draw}, which again breaks down into a similar sequence of events. (As with above, this will demonstrate each step along the way without specifying which methods mentioned are internal and should therefore not be modified—please check the methods to ensure you are modifying the correct Frame function for each element.)

1. Clear the canvas to prevent previously-drawn things from appearing.
1. Run the {@link Oversimplified.Rooms.Current|current Room}'s {@link Oversimplified.Room#Draw|Draw()} method.
    1. Draw the Room's `{@link Oversimplified.Room#background|background}.color` to cover the whole canvas, if a color is specified.
    1. Draw the Room's {@link Oversimplified.Room#bg|background image} if it has been loaded. (By default, the background image is an empty image.)
    1. Run the Room's {@link Oversimplified.Room#DrawBelow|DrawBelow()} if one has been set up. Anything drawn here will appear below the following drawings.
    1. Determine the draw order for the Room's {@link Oversimplified.Room#objects|GameObjects} based on their {@link Oversimplified.GameObject#depth|depth}. GameObjects with a lower `depth` will draw first and appear below objects with a higher `depth`. If two GameObjects have the same `depth`, they will be drawn in the order they were created with the one created last appearing _above_ the one created first.
    1. Run each of the Room's {@link Oversimplified.Room#objects|GameObjects}'s {@link Oversimplified.GameObject#Draw|Draw()} methods in the draw order determined before. In that order, do the following for each GameObject:
        1. Run the GameObject's {@link Oversimplified.GameObject#DrawBelow|DrawBelow()} if one has been set up.
        1. If the GameObject {@link Oversimplified.IsOnCamera|is visible} on the camera 1, determine the GameObject's current frame of {@link Oversimplified.Animation}. (If no Animation is specified, a default Animation is created for the GameObject that consists of the whole `image` instead of animating.)
        1. Draw that piece of the GameObject's {@link Oversimplified.GameObject.image|image} on the canvas at the angle set when using {@link Oversimplified.GameObject#SetImageRotation} or {@link Oversimplified.GameObject#RotateImage}.
        1. Run the GameObject's {@link Oversimplified.GameObject#DrawAbove|DrawAbove()} if one has been set up.
    1. Draw the Room's {@link Oversimplified.Room#foreground|foreground image} if one has been set up and loaded.
    1. Run the Room's {@link Oversimplified.Room#DrawAbove|DrawAbove()} if one has been set up. Anything drawn here will appear above the previous drawings—good for HUDs and other user interfaces.

### EndFrame

At the very end of each Frame, {@link Oversimplified.EndFrame} runs and resets the status of each mouse button and key to ensure that the `Up` and `Down` values are only `true` for the Frame that they are pressed.

## Repeat

After the sequence of events above has completed, OversimplifiedJS uses `{@link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame|requestAnimationFrame}` to loop and run {@link Oversimplified.Frame} again at the next possible moment in the browser. But even though it runs as quickly as possible, it still only runs the sequence when it is time to do a Frame as specified in the current Room's `step`.