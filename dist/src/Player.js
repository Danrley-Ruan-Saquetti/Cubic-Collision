"use strict";
class Player {
    constructor(position, dimension, color, speed, lastKeys, points, lives) {
        this.position = position;
        this.dimension = dimension;
        this.color = color;
        this.speed = speed;
        this.lastKeys = lastKeys;
        this.points = points;
        this.lives = lives;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
    }
    update() {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        if (this.position.x < 0) {
            this.position.x = 0;
        }
        else if (this.position.x + this.dimension.width > WINDOW_DIMENSION.width()) {
            this.position.x = WINDOW_DIMENSION.width() - this.dimension.width;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        else if (this.position.y + this.dimension.height > WINDOW_DIMENSION.height()) {
            this.position.y = WINDOW_DIMENSION.height() - this.dimension.height;
        }
    }
}
