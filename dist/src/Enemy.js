"use strict";
class Enemy {
    constructor(position, dimension, color, target) {
        this.position = position;
        this.dimension = dimension;
        this.color = color;
        this.target = target;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
    }
    update() {
        if (this.position.x > this.target.x)
            this.position.x--;
        else if (this.position.x < this.target.x)
            this.position.x++;
        if (this.position.y > this.target.y)
            this.position.y--;
        else if (this.position.y < this.target.y)
            this.position.y++;
    }
}
