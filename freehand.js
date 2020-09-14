// Partly based on tutorial found at http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

function FreeHand(clickX, clickY, clickMove, paint, color, lineWidth) {
  // Arrays to store click coordinates and whether the pointer was being
  // move or not.
  this.clickX = clickX;
  this.clickY = clickY;
  this.clickMove = clickMove;
  this.paint = paint;

  // Other general properties.
  this.color = color;
  this.name = 'FreeHand';
  this.lineWidth = lineWidth;
}

// This function loops through the actions that have been made and logged inside
// our arrays and redraws everything on any change or update.
FreeHand.prototype.render = function() {
  // Setting the pencil settings according to user preferences.
  // Line join can not be changed by user and is set
  // as default to 'round'.
  drawio.ctx.lineJoin = "round";
  drawio.ctx.strokeStyle = this.color;
  drawio.ctx.lineWidth = this.lineWidth;

  for(var i = 0; i < this.clickX.length; i++) {
    drawio.ctx.beginPath();
    if(this.clickMove[i] && i){
      drawio.ctx.moveTo(this.clickX[i - 1], this.clickY[i - 1]);
     }else {
       drawio.ctx.moveTo(this.clickX[i] - 1, this.clickY[i]);
     }
     drawio.ctx.lineTo(this.clickX[i], this.clickY[i]);
     drawio.ctx.closePath();
     drawio.ctx.stroke();
    }
  };

// Recording the movement.
FreeHand.prototype.addClick = function(x, y, movement) {
  this.clickX.push(x);
  this.clickY.push(y);
  this.clickMove.push(movement);
};
