"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const WINDOW_DIMENSION = {
    width: () => {
        return innerWidth;
    },
    height: () => {
        return innerHeight;
    }
};
const CANVAS_DIMENSION = {
    width: () => {
        return canvas.clientWidth;
    },
    height: () => {
        return canvas.clientHeight;
    }
};
resizeCanvas();
let player;
let enemies;
let animateFrame;
function setup() {
    initial();
}
function initial() {
    enemies = [];
    player = new Player({ x: 0, y: 0 }, { width: 0, height: 0 }, "");
    enemies = [new Enemy({ x: 0, y: 0 }, { width: 0, height: 0 }, "")];
    animate();
}
function resizeCanvas() {
    canvas.width = WINDOW_DIMENSION.width();
    canvas.height = WINDOW_DIMENSION.height();
}
function draw() {
    ctx.clearRect(0, 0, CANVAS_DIMENSION.width(), CANVAS_DIMENSION.height());
    enemies.forEach((enemy) => {
        enemy.draw();
    });
    player.draw();
}
function update() {
    player.update();
    enemies.forEach((enemy) => {
        enemy.update();
    });
}
function animate() {
    if (CANVAS_DIMENSION.width() != WINDOW_DIMENSION.width() || CANVAS_DIMENSION.height() != WINDOW_DIMENSION.height())
        resizeCanvas();
    update();
    draw();
    animateFrame = requestAnimationFrame(animate);
}
window.onload = setup;
