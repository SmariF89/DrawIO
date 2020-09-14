window.drawio = {
  shapes: [], // Array containing all shapes in the canvas.
  backupShapes: [], // Array containing all the shapes that were undone.
  lastPickedShape: 'freehand', // Shape selected before currently selected shape.
  selectedShape: 'freehand', // Currently selected shape.
  wasCleared: false, // If the whole canvas was cleared.
  canvas: document.getElementById('my-canvas'), // Reference to the canvas so we do not need to hardcode the canvas info
  ctx: document.getElementById('my-canvas').getContext('2d'), // ctx or the context is sort of like the pen of the canvas we use to draw on it
  selectedColor: '#000000', 
  selectedFont: 'Arial, sans-serif',
  selectedStyle: 'stroke',
  selectedElement: null,

  availableColours: {
    YELLOW: '#ffff00',
    RED: '#ff4000',
    GREEN: '#40ff00',
    BLUE: '#0000ff',
    BLACK: '#000000',
    WHITE: '#ffffff',
    PURPLE: '#8000ff'
  },

  availableElements: {
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    FREEHAND: 'freehand',
    LINE: 'line',
    TEXT: 'text',
    CLEAR: 'clear',
    REDO: 'redo',
    UNDO: 'undo',
    SAVE: 'save',
    MOVE: 'move'
    }
};

// When document is parsed and ready. Function will start.
$(function() {

  // Various settings applied at the beginning.
  drawio.ctx.lineWidth = 3;
  // No scrolling allowed.
  window.addEventListener('scroll', function noscroll() {window.scrollTo( 0, 0 );});
  document.getElementById(drawio.selectedStyle + "Rad").setAttribute("style", "color: #e8a727;");

  function refresh() {
    drawio.ctx.clearRect(0,0, drawio.canvas.width, drawio.canvas.height);
    drawCanvas();
  }

  // Get last session, if last session was saved it was stored in local storage.
  var lastSession = JSON.parse(window.localStorage.getItem('itemSession'));
  if(lastSession) {
    if(lastSession.shapes.length > 0 ) {

      // Set crutial properties of last session to properties in current session.
      drawio.lastPickedShape = lastSession.lastPickedShape;
      drawio.selectedShape = lastSession.lastPickedShape;
      drawio.selectedColor = lastSession.selectedColor;

      // Set shape arrays.
      setShapeArray(lastSession.shapes);
      setBackupShapeArray(lastSession.backupShapes);

      // Freehand is now deselected.
      document.getElementById("freehandID").classList.remove('selected');

      // Last picked element is now selected.
      document.getElementById(drawio.lastPickedShape + "ID").classList.add('selected');

      // Draw canvas with elements that were saved in last session.
      drawCanvas();
    }
  }

  function setShapeArray(shapeArr) {
    // Set shapes to the shapes in last session.
    for (var i = 0; i < shapeArr.length; i++) {
      var shape = shapeArr[i];
      if(shape.name == 'Line'){
        drawio.shapes.push(new Line({x: shape.position.x, y: shape.position.y}, shape.endposX, shape.endposY, shape.color, shape.lineWidth));
      }
      else if(shape.name == 'Rectangle') {
        drawio.shapes.push(new Rectangle({x: shape.position.x, y: shape.position.y}, shape.width, shape.height, shape.color, shape.lineWidth, shape.style));
      }
      else if(shape.name == 'Circle') {
        drawio.shapes.push(new Circle({x: shape.position.x, y: shape.position.y}, shape.radius, shape.color, shape.lineWidth, shape.style));
      }
      else if(shape.name == 'FreeHand') {
        drawio.shapes.push(new FreeHand(shape.clickX, shape.clickY, shape.clickMove, shape.paint, shape.color, shape.lineWidth));
      }
      else if(shape.name == 'Text') {
        drawio.shapes.push(new Text(shape.posX, shape.posY, shape.data, shape.font, shape.color));
      }
    }
  }

  function setBackupShapeArray(shapeArr) {
    // Set backupShapes(bShape) to the backupShapes in last session.
    for (var i = 0; i < shapeArr.length; i++) {
      var shape = shapeArr[i];
      if(shape.name == 'Line'){
        drawio.backupShapes.push(new Line({x: shape.position.x, y: shape.position.y}, shape.endposX, shape.endposY, shape.color, shape.lineWidth));
      }
      else if(shape.name == 'Rectangle') {
        drawio.backupShapes.push(new Rectangle({x: shape.position.x, y: shape.position.y}, shape.width, shape.height, shape.color, shape.lineWidth, shape.style));
      }
      else if(shape.name == 'Circle') {
        drawio.backupShapes.push(new Circle({x: shape.position.x, y: shape.position.y}, shape.radius, shape.color, shape.lineWidth, shape.style));
      }
      else if(shape.name == 'FreeHand') {
        drawio.backupShapes.push(new FreeHand(shape.clickX, shape.clickY, shape.clickMove, shape.paint, shape.color, shape.lineWidth));
      }
      else if(shape.name == 'Text') {
        drawio.backupShapes.push(new Text(shape.posX, shape.posY, shape.data, shape.font, shape.color));
      }
    }
  }

  // Make sure to render all objects currently on canvas.
  function drawCanvas() {
    for (var i = 0; i < drawio.shapes.length; i++) {
      drawio.shapes[i].render();
    }

    if(drawio.selectedElement) {
      drawio.selectedElement.render();
    }
  };

  // Adjust linewidth.
  $("#lwMin").on("click", function() {
    drawio.ctx.lineWidth--;
  });

  $("#lwPlu").on("click", function() {
    drawio.ctx.lineWidth++;
  });

  // Style selection.
  $(".styleSelect").on("click", function() {
    $('.styleSelect').removeClass('selected');
    $(this).addClass('selected');
    drawio.selectedStyle = $(this).data('style');

    if(drawio.selectedStyle == "stroke") {
      document.getElementById("strokeRad").setAttribute("style", "color: #e8a727;");
      document.getElementById("fillRad").setAttribute("style", "color: black;");
    } else {
      document.getElementById("fillRad").setAttribute("style", "color: #e8a727;");
      document.getElementById("strokeRad").setAttribute("style", "color: black;");
    }
  });

  // If ctrl-z(undo) and ctrl-y(redo) are pressed.
  function KeyPress(evt) {
      var evtobj = window.event? event : evt
      if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
        if(drawio.backupShapes.length > 0) {
          if(drawio.wasCleared) {
            drawio.shapes = drawio.backupShapes;
            drawCanvas();
            drawio.wasCleared = false;
          }
        }
        else{ 
          drawio.backupShapes.push(drawio.shapes.pop());
        }
      }else if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
        if(drawio.backupShapes.length > 0) {
            drawio.shapes.push(drawio.backupShapes.pop());
        }
      }

      refresh();
  };

  document.onkeydown = KeyPress;

  // An event handler for click event.
  $('.icon').on('click', function(evt) {

      // Make sure two elements are not selected at the same time.
      $('.icon').removeClass('selected');
      // Make sure the clicked element is selected.
      $(this).addClass('selected');

      // Fetch data.
      drawio.selectedShape = $(this).data('shape');

      // Check if selected elements are CLEAR, UNDO, REDO or SAVE.
      if(drawio.selectedShape == drawio.availableElements.CLEAR) {
        // Clear canvas.
        drawio.ctx.clearRect(0,0, drawio.canvas.width, drawio.canvas.height);
        $(this).removeClass('selected');

        // Set the backup array with all the elements in the canvas.
        drawio.backupShapes = drawio.shapes;
        // Empty the shapes array.
        drawio.shapes = [];

        // Set last picked element as selected.
        drawio.selectedShape = drawio.lastPickedShape;
        document.getElementById(drawio.lastPickedShape + "ID").classList.add('selected');

        // Set wasCleared to true, to get the whole canvas up in redo
        drawio.wasCleared = true;
      }
      else if(drawio.selectedShape == drawio.availableElements.UNDO) {
        $(this).removeClass('selected'); 
        
        
        if(drawio.wasCleared) {
          if(drawio.backupShapes.length > 0) {
            drawio.shapes = drawio.backupShapes;
            drawCanvas();
            drawio.wasCleared = false;
          }
        }else{
          if(drawio.shapes.length > 0) {
            drawio.backupShapes.push(drawio.shapes.pop());
            refresh();
          }
        }
        drawio.selectedShape = drawio.lastPickedShape;
        document.getElementById(drawio.lastPickedShape + "ID").classList.add('selected');
      }
      else if(drawio.selectedShape == drawio.availableElements.REDO) {
        $(this).removeClass('selected');

        console.log(drawio.backupShapes.length);
        if(drawio.backupShapes.length > 0) {

          drawio.shapes.push(drawio.backupShapes.pop());
          refresh();
        }

        drawio.selectedShape = drawio.lastPickedShape;
        document.getElementById(drawio.lastPickedShape + "ID").classList.add('selected');
      }
      else if(drawio.selectedShape == drawio.availableElements.SAVE) {
        $(this).removeClass('selected');
        // Stringfy informations in current session in local storage.
        var currentSession = JSON.stringify(drawio);
        window.localStorage.setItem('itemSession', currentSession);
        drawio.selectedShape = drawio.lastPickedShape;
        document.getElementById(drawio.lastPickedShape + "ID").classList.add('selected');
      }
      else if(drawio.selectedShape != drawio.availableElements.MOVE) {
        drawio.lastPickedShape = drawio.selectedShape;
      }
  });

  // Color selection.
  $(".colour_icon").on("click", function() {
    $(".colour_icon").removeClass("selected");
    $(this).addClass('selected');
    drawio.selectedColor = $(this).data("color");
  });

  // Text modal and input.
  $('#my-canvas').on('click', function(evt) {
    if(drawio.selectedShape == drawio.availableElements.TEXT){

      // Spawn the modal
      drawio.canvas.setAttribute("data-toggle", "modal");
      drawio.canvas.setAttribute("data-target", "#textInputModal");

      // Wait half a second for modal to be ready before putting focus to textarea.
      setTimeout(function() {
        document.getElementById("inputForm").focus();
      }, 500);

      mouseX = evt.pageX - drawio.canvas.offsetLeft;
      mouseY = evt.pageY - drawio.canvas.offsetTop;

      drawio.selectedElement = new Text(mouseX, mouseY, "",  "30px " + drawio.selectedFont, drawio.selectedColor, drawio.selectedStyle);
    }
  });

  $(".fontSelect").on("click", function(evt) {
    $('.fontSelect').removeClass('selected');
    $(this).addClass('selected');
    drawio.selectedFont = $(this).data('font');
    drawio.selectedElement.font = "30px " + drawio.selectedFont;
    document.getElementById("inputForm").setAttribute("style", "font-family: " + drawio.selectedFont);
  });

  $("#textCancelBtn").on("click", function(evt) {
    var inputForm = document.getElementById("inputForm");
    inputForm.value = "";
    inputForm.blur();
  });

  $('#confirmText').on('click', function(evt) {
    drawio.selectedElement.data = $("#inputForm").val();

    // Empty input form
    $("#inputForm").val("");

    // Put to array
    drawio.shapes.push(drawio.selectedElement);

    // Deselect element
    drawio.selectedElement = null;

    // Remove modal
    drawio.canvas.removeAttribute("data-toggle");
    drawio.canvas.removeAttribute("data-target");
    refresh();
  });

  // When the mouse is pressed down.
  $('#my-canvas').on('mousedown', function(evt){
    drawio.backupShapes = [];
    drawio.wasCleared = false;
    
    // Check what element is selected.
    switch (drawio.selectedShape) {
      
      // If it is a rectangle
      case drawio.availableElements.RECTANGLE:
        // we have width and height as 0 initially because we want it to be nothing originally
        // we pass the mouse position with it
        drawio.selectedElement = new Rectangle({x: evt.offsetX, y:evt.offsetY}, 0, 0, drawio.selectedColor, drawio.ctx.lineWidth, drawio.selectedStyle);
        break;

      case drawio.availableElements.FREEHAND:
        mouseX = evt.pageX - drawio.canvas.offsetLeft;
        mouseY = evt.pageY - drawio.canvas.offsetTop;
        var xArr = new Array(mouseX);
        var yArr = new Array(mouseY);

        drawio.selectedElement = new FreeHand([], [], [], false, drawio.selectedColor, drawio.ctx.lineWidth);

        drawio.selectedElement.paint = true;
        drawio.selectedElement.addClick(mouseX, mouseY);
        break;

      case drawio.availableElements.CIRCLE:
        // We have the radius 0 in the beginning
        // we want it to go from nothing
        drawio.selectedElement = new Circle({x: evt.offsetX, y:evt.offsetY}, 0, drawio.selectedColor, drawio.ctx.lineWidth, drawio.selectedStyle);
        break;

      // This element, the hand tool makes it possible to move objects
      case drawio.availableElements.MOVE:
        // We loop through the shapes array
        // we need to check if the mouse clicked inside some shape
        // if it did we want to be able to move that object
        for (var i = 0; i < drawio.shapes.length; i++) {
          var current = drawio.shapes[i];
          
          // If we have an circle object
          if(current.radius) {
            // If the mouse that clicked is located inside the circle
            // the formula takes basicly square root of  the position of the mouse and calculates it with respect to the position of
            // the coordinates of the circle we want to move.
            if (Math.sqrt((evt.offsetX - current.position.x)*(evt.offsetX - current.position.x) + 
               (evt.offsetY - current.position.y)*(evt.offsetY - current.position.y)) < current.radius) {
              drawio.selectedElement = current;
              drawio.shapes.splice(i,1);
              drawio.selectedElement.move({x: evt.offsetX, y:evt.offsetY});
              }
          }
          else if(current.width) {
            // Checks if the mouse that clicked is inside the rectangle.
            if (evt.offsetX > current.position.x &&
              evt.offsetY > current.position.y &&
              evt.offsetX < current.position.x + current.width &&
              evt.offsetY < current.position.y + current.height) {
                  drawio.selectedElement = current;
                  drawio.shapes.splice(i,1);
                  drawio.selectedElement.move({x: evt.offsetX, y:evt.offsetY});
            }
          }
          else if(current.endposX) { // LINE
              // If the user clicks at the end of the line,
              // the variable front is set to false and sent to the line.move() function in shapes.
              if(evt.offsetX > current.endposX-15 && evt.offsetX <= current.endposX &&
                 evt.offsetY > current.endposY-15 && evt.offsetY <= current.endposY) {
                drawio.selectedElement = current;
                drawio.selectedElement.front = false;
                drawio.shapes.splice(i,1);
              }
              // If the user clicks at the beginning of the line, we want to move that part
              // the variable front is then set to true and sent to the Line.move() function in shapes
              else if(evt.offsetX > current.position.x-15 && evt.offsetX <= current.position.x + 15 &&
                      evt.offsetY > current.position.y-15 && evt.offsetY <= current.position.y + 25) {
                    drawio.selectedElement = current;
                    drawio.selectedElement.front = true;
                    drawio.shapes.splice(i,1);
              }
          }
          // If we have a text we want to move
          else if (current.data) {
            // We have positionX and positionY that are proprerties of the text class
            // that points to the front of the first character
            // from that point we need to calculate the length of the whole text
            // that way user can move text wherever he clicks around the text
            // and does not need to click at the very beginning of the string
            var lengd = drawio.ctx.measureText(current.data).width;
            if(evt.offsetX > current.posX-15 && evt.offsetX < eval(current.posX + lengd)+15 &&
              evt.offsetY > current.posY-15 && evt.offsetY < eval(current.posY + lengd)+15)
            {
              drawio.selectedElement = current;
              drawio.shapes.splice(i,1);
            }
          }
        }
        break;

        case drawio.availableElements.LINE:
          drawio.selectedElement = new Line({x: evt.offsetX, y:evt.offsetY}, evt.offsetX, evt.offsetY, drawio.selectedColor, drawio.ctx.lineWidth);
          break;
      }
  });

  // When the mouse is beeing moved.
  $('#my-canvas').on('mousemove', function(evt) {
    // I only want to move things if I actually have an element
    if(drawio.selectedElement) {
      // We call clearrect to erase so you can see changes while they happen
      drawio.ctx.clearRect(0,0, drawio.canvas.width, drawio.canvas.height);

      if(drawio.selectedShape == drawio.availableElements.FREEHAND) {
        if(drawio.selectedElement.paint){
          drawio.selectedElement.addClick(evt.pageX - drawio.canvas.offsetLeft,
                                          evt.pageY - drawio.canvas.offsetTop, true);
          drawio.selectedElement.render();
        }
      }
      else if(drawio.selectedShape == 'rectangle') {
        drawio.selectedElement.resize(evt.offsetX, evt.offsetY);
      }
      else if (drawio.selectedShape == 'circle') {
        drawio.selectedElement.resize(evt.offsetX);
      }
      else if(drawio.selectedShape == 'move') {
        drawio.selectedElement.move({x:evt.offsetX, y:evt.offsetY});
      }
      else if(drawio.selectedShape == 'line') {
        drawio.selectedElement.resize(evt.offsetX, evt.offsetY);
      }
      drawCanvas();
    }
  });

  $('#my-canvas').on('mouseup', function() {
    if(drawio.selectedElement){
      if(drawio.selectedShape != drawio.availableElements.TEXT) {
        drawio.shapes.push(drawio.selectedElement);
      }
      else if(drawio.selectedShape == drawio.availableElements.FREEHAND) {
        if(drawio.selectedElement.paint) {
          drawio.selectedElement.paint = false;
        }
      }
      drawio.selectedElement = null;
    }

    drawCanvas();
  });

  $('#my-canvas').mouseleave(function(evt) {
    if(drawio.selectedElement) {
      if(drawio.selectedShape == drawio.availableElements.FREEHAND) {
        drawio.selectedElement.paint = false;
      }
      else if(drawio.selectedShape != drawio.availableElements.TEXT) {
        drawio.shapes.push(drawio.selectedElement);
        drawio.selectedElement = null;
      }

      drawCanvas();
    }
  });
});
