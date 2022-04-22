"use strict";
class Coin {
    constructor(position, dimension, color) {
        this.position = position;
        this.dimension = dimension;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
    }
}
