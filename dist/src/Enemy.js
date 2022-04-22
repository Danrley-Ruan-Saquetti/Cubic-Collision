"use strict";
class Enemy {
    constructor(position, dimension, color, target) {
        this.position = position;
        this.dimension = dimension;
        this.color = color;
        this.target = target;
    }
    draw() {
        ctx.fillStyle = "#000";
        ctx.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x + 1, this.position.y + 1, this.dimension.width - 1, this.dimension.height - 1);
    }
    update() {
        const angulo = Math.atan2(this.target.y - (this.position.y + (this.dimension.height / 2)), this.target.x - (this.position.x + (this.dimension.width / 2)));
        const speed = { x: Math.cos(angulo) * SPEED_ENEMY(), y: Math.sin(angulo) * SPEED_ENEMY() };
        this.position.x += speed.x;
        this.position.y += speed.y;
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
