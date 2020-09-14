function Text(x, y, data, font, color, style) {
	this.color = color;
	this.posX = x;
	this.posY = y;
	this.data = data;
	this.font = font;
	this.style = style;
	this.name = 'Text';
}

// This makes afterwards movement possible by the selection tool.
Text.prototype.move = function(position) {
	drawio.selectedElement.posX = position.x;
	drawio.selectedElement.posY = position.y;
};

// The text is rendered regardless of style.
Text.prototype.render = function() {
	// Backing up previous lineWidth
	var oldLineWidth = drawio.ctx.lineWidth;

	// Setting a convenient text line width
	drawio.ctx.lineWidth = 2;

	drawio.ctx.font = this.font;
	if(this.style == "fill") {
		drawio.ctx.fillStyle = this.color;
		drawio.ctx.fillText(this.data, this.posX, this.posY);
	} else {
		drawio.ctx.strokeStyle = this.color;
		drawio.ctx.strokeText(this.data, this.posX, this.posY);
	}

	// Restoring to previous setting
	drawio.ctx.lineWidth = oldLineWidth;
};
