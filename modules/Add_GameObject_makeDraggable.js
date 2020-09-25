/** Add `MakeDraggable()` as a prototype method on the GameObject class to enable interactive clicking and dragging.
 * @function
 * @example
 * // Add the script
 * OS.AddScript('./modules/Add_GameObject_MakeDraggable.js');
 * // Create a GameObject in the current room
 * var obj_someObject = OS.Create('someGameObject', { x: 0, y: 0, imageSrc: 'path/to/image' });
 * // Do whatever setup you need first (particularly `BeforeDo()` if you are using it), then call `MakeDraggable()`
 * obj_someObject.MakeDraggable();
 */
function Add_GameObject_MakeDraggable() {
  // To make the GameObject draggable, call GameObject.MakeDraggable() at the end of its setup
  // (or at least after declaring its BeforeDo() method)
  OS.GameObject.prototype.MakeDraggable = function(onGrab, onDrop, onMove) {
    if (OS.DEBUG.showMessages) console.log('making ' + this.name + ' draggable.');
    onGrab = typeof onGrab === 'function' ? onGrab : function() {};
    onDrop = typeof onDrop === 'function' ? onDrop : function() {};
    onMove = typeof onMove === 'function' ? onMove : function() {};
    
    this.draggable = true;
    this.dragging = false;
    this.startPosition = null;
    this.dragOffset = null;

    this.BeforeDo = (function (BeforeDo) {
      return function () {
        if (!this.dragging && !OS.mouse.isDragging && this.Clicked(OS.mouse.left)) {
          this.dragging = true;
          OS.mouse.isDragging = true;
          this.startPosition = { x: this.x, y: this.y };
          this.dragOffset = { x: this.x - OS.mouse.x, y: this.y - OS.mouse.y };

          onGrab({
            startPosition: this.startPosition,
            dragOffset: this.startPosition,
            grabX: OS.mouse.x,
            grabY: OS.mouse.y,
          });
        }

        if (this.dragging) {
          if (!OS.mouse.left) {
            this.dragging = false;
            delete OS.mouse.isDragging;

            onDrop({
              startPosition: this.startPosition,
              dragOffset: this.dragOffset,
              dropX: OS.mouse.x,
              dropY: OS.mouse.y,
            });

            this.startPosition = null;
            this.dragOffset = null;
          } else {
            this.x = OS.mouse.x + this.dragOffset.x;
            this.y = OS.mouse.y + this.dragOffset.y;

            onMove({
              startPosition: this.startPosition,
              dragOffset: this.dragOffset,
              grabX: OS.mouse.x,
              grabY: OS.mouse.y,
            });
          }
        }

        if (typeof BeforeDo === 'Function') BeforeDo();
      }
    })(this.BeforeDo);
  }
}
