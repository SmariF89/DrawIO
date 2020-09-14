# DrawIO
A simple HTML/JavaScript Paint clone using HTML5 canvas.

This project was done as a general exercise in using HTML5 canvas, jQuery and implementing JavaScript objects - using prototypes to add properties and methods.

DrawIO implements basic features you would expect to see in a basic painting program. In DrawIO you can...
- Select a few colors to work with
- Adjust line width
- Draw with a pencil (freehand)
- Use line-tool
- Creates shapes like circles and rectangles, rendered either stroked or filled
- Move the shapes around with a move-tool
- Insert text which is rendered either stroked or filled
- Save your work in localStorage (it will reload your work next time the browser is opened)
- Undo and redo
- Clear canvas

There are some known issues though - mainly with the move-tool - which may be a fun pastime to take a look at sometime:
- The move-tool can not move lines drawn with the pencil.
- It is difficult to trigger the functionality of the move-tool sometimes, requiring you to hit some exact spot of the object you want to move.
- Shapes sometimes disappear when another shape or a text is moved within their proximity.
- When a shape is moved with the move-tool, it will render above other graphics - not retaining its layer.
