// This file contains the various selectable elements of this program.

// Constructor shape which all other shapes inherit.
// Position is an object which consists of x and y coordinates.
function Shape(position, color, lineWidth) {
  this.position = position;
  this.color = color;
  this.lineWidth = lineWidth;
}


// The inheriting objects will implement these functions.
// Each of the indvidual shapes need to know how to render itselves.
Shape.prototype.render = function() {};

// To change the positions of the element using the hand tool
// this function is called which they all inherit execept for the
// line that has its own function
Shape.prototype.move = function(position) {
  drawio.selectedElement.position = position;
};

// Each of the shapes makes its own implementation of how they are
// resized, it gets called when they are being created
Shape.prototype.resize = function(){};

function Rectangle(position, width, height, color, lineWidth, style) {
  // Call to Shape constructor. Is partly utilised.
  Shape.call(this, position, color, lineWidth);
  this.width = width;
  this.height = height;
  this.style = style;
  this.name = 'Rectangle';
}

//Assign the prototype
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

// Renders rectangle regardless of style.
Rectangle.prototype.render = function(){

  drawio.ctx.lineWidth = this.lineWidth;

  if(this.style == "fill") {
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  } else {
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
  }
};

// Is used when dragging before mouseup.
Rectangle.prototype.resize = function(x, y) {
  this.width = x - this.position.x;
  this.height = y - this.position.y;
};

// Hand tool is chosen to move elements
function Hand(position, element){
  this.element = element;
  Shape.call(this.element.position, position);
}

Hand.prototype = Object.create(Shape.prototype);
Hand.prototype.constructor = Hand;

// The object is rendered as is it is moved around.
Hand.prototype.render = function() {
  // The hand render the element itself it has each time
  this.element.render();
};

// The circle element is created using arc and some math.
function Circle(position, radius, color, lineWidth, style) {
  Shape.call(this, position, color, lineWidth);
  this.radius = radius;
  // Starts from 0 - PI*2 to create a whole circle
  this.start = 0;
  this.end = Math.PI*2;
  this.style = style;
  this.name = 'Circle';
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

// The circle is rendered regardless of style.
Circle.prototype.render = function() {
  drawio.ctx.lineWidth = this.lineWidth;
  drawio.ctx.beginPath();
  drawio.ctx.arc(this.position.x, this.position.y, this.radius, this.start, this.end);
  drawio.ctx.closePath();

  if(this.style == "fill") {
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.fill();
  } else {
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.stroke();
  }
};

// The circle is resized as the mouse is dragged before mouseup.
Circle.prototype.resize = function(x) {
  // We make the circle bigger from the x coordinates of the mouse
  // by moving the mouse pointer left and right
  this.radius = Math.abs(x - this.position.x);
};

// This is the line element which creates a straight line from
// point a to point b.
function Line(position, endposX, endposY, color, lineWidth) {
  Shape.call(this, position, color, lineWidth);
  this.endposX = endposX;
  this.endposY = endposY;
  this.name = "Line";
  // A boolean variable used to determine which end of the line
  // a user wants to change, where the line begins or where it ends
  this.front = false;
}


// Make Line prototype of Shape.
Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

// Draw line on canvas, with set values.
// Style does not matter for line.
Line.prototype.render = function() {
  drawio.ctx.strokeStyle = this.color;
  drawio.ctx.lineWidth = this.lineWidth;
  drawio.ctx.beginPath();
  drawio.ctx.moveTo(this.position.x, this.position.y);
  drawio.ctx.lineTo(this.endposX, this.endposY);
  drawio.ctx.stroke();
};


// The line is resized as it is dragged around before mouseup.
Line.prototype.resize = function(x, y) {
  this.endposX = x;
  this.endposY = y;
};

Line.prototype.move = function(position) {
  if(drawio.selectedElement.front === false) {
    // if mouse is clicking at the end of the line
    drawio.selectedElement.endposX = position.x;
    drawio.selectedElement.endposY = position.y;
  } else {
    // Otherwise he is moving at the beginning of line
    drawio.selectedElement.position = position;
  }
};