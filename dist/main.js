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
const SPAWN = {
    player: () => {
        let dimensionBlock = { width: DIMENSION_BLOCK(), height: DIMENSION_BLOCK() };
        let position = { x: (CANVAS_DIMENSION.width() - dimensionBlock.width) / 2, y: (CANVAS_DIMENSION.height() - dimensionBlock.height) / 2 };
        let speed = { x: 0, y: 0 };
        let color = "#ff0000";
        let lastKeys = { horizontal: "", vertical: "" };
        let points = 0;
        let lives = 10;
        return new Player(position, dimensionBlock, color, speed, lastKeys, points, lives);
    },
    enemy: () => {
        let dimensionBlock = { width: DIMENSION_BLOCK(), height: DIMENSION_BLOCK() };
        let color = "#fff";
        let position;
        do {
            position = { x: Math.random() * (CANVAS_DIMENSION.width() - dimensionBlock.width), y: Math.random() * (CANVAS_DIMENSION.height() - dimensionBlock.height) };
        } while (DETECT_COLLISION(player.position.x, player.position.y, player.dimension.width, player.dimension.height, position.x, position.y, dimensionBlock.width, dimensionBlock.height));
        return new Enemy(position, dimensionBlock, color, player.position);
    },
    coin: () => {
        let dimensionBlock = { width: DIMENSION_BLOCK() * COIN_DIMENSION_PERC, height: DIMENSION_BLOCK() * COIN_DIMENSION_PERC };
        let color = "#ffff00";
        let position;
        do {
            position = { x: Math.random() * (CANVAS_DIMENSION.width() - dimensionBlock.width), y: Math.random() * (CANVAS_DIMENSION.height() - dimensionBlock.height) };
        } while (DETECT_COLLISION(player.position.x, player.position.y, player.dimension.width, player.dimension.height, position.x, position.y, dimensionBlock.width, dimensionBlock.height));
        return new Enemy(position, dimensionBlock, color, player.position);
    }
};
const DETECT_COLLISION = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    return ((x1 >= x2 && x1 <= x2 + w2 && y1 >= y2 && y1 <= y2 + h2) ||
        (x1 + w1 >= x2 && x1 + w1 <= x2 + w2 && y1 >= y2 && y1 <= y2 + h2) ||
        (x1 + w1 >= x2 && x1 + w1 <= x2 + w2 && y1 + h1 >= y2 && y1 + h1 <= y2 + h2) ||
        (x1 <= x2 + w2 && x1 >= x2 && y1 + h1 >= y2 && y1 + h1 <= y2 + h2));
};
const DIMENSION_BLOCK = () => {
    return (CANVAS_DIMENSION.width() * SPEED_PLAYER_PERC + CANVAS_DIMENSION.height() * SPEED_PLAYER_PERC) / 2;
};
const SPEED_PLAYER = () => { return DIMENSION_BLOCK() * 0.15; };
const SPEED_ENEMY = () => { return SPEED_PLAYER() / 2; };
const SPEED_PLAYER_PERC = .04;
const COIN_DIMENSION_PERC = .5;
const COLLISION_PLAYER_COIN = 15;
const COLLISION_ENEMY_ENEMY = 5;
const COLLISION_PLAYER_ENEMY = 1;
resizeCanvas();
let player;
let enemies;
let coin;
let keys;
let animateFrame;
function setup() {
    addEventListener("keydown", (ev) => {
        switch (ev.key) {
            case "w":
                keys.UP = true;
                player.lastKeys.horizontal = "UP";
                break;
            case "s":
                keys.DOWN = true;
                player.lastKeys.horizontal = "DOWN";
                break;
            case "d":
                keys.RIGHT = true;
                player.lastKeys.vertical = "RIGHT";
                break;
            case "a":
                keys.LEFT = true;
                player.lastKeys.vertical = "LEFT";
                break;
        }
    });
    addEventListener("keyup", (ev) => {
        switch (ev.key) {
            case "w":
                keys.UP = false;
                break;
            case "s":
                keys.DOWN = false;
                break;
            case "d":
                keys.RIGHT = false;
                break;
            case "a":
                keys.LEFT = false;
                break;
        }
    });
    initial();
}
function initial() {
    keys = {
        UP: false,
        DOWN: false,
        RIGHT: false,
        LEFT: false,
    };
    enemies = [];
    player = SPAWN.player();
    for (let i = 0; i < 4; i++) {
        enemies.push(SPAWN.enemy());
    }
    coin = SPAWN.coin();
    animate();
}
function resizeCanvas() {
    canvas.width = WINDOW_DIMENSION.width();
    canvas.height = WINDOW_DIMENSION.height();
}
function resizeParameters() {
    const oldWidth = CANVAS_DIMENSION.width();
    const oldHeight = CANVAS_DIMENSION.height();
    const newPos = (pos) => {
        return { x: (pos.x * CANVAS_DIMENSION.width()) / oldWidth, y: (pos.y * CANVAS_DIMENSION.height()) / oldHeight };
    };
    resizeCanvas();
    let dimensionBlock = { width: DIMENSION_BLOCK(), height: DIMENSION_BLOCK() };
    player.dimension = dimensionBlock;
    player.position = newPos(player.position);
    enemies.forEach((enemy) => {
        enemy.dimension = dimensionBlock;
        enemy.position = newPos(enemy.position);
    });
}
function collisionPlayer_Enemy(e) {
    enemies.splice(e, 1);
    enemies.push(SPAWN.enemy());
    player.lives -= COLLISION_PLAYER_ENEMY;
}
function collisionEnemy_Enemy(e1, e2) {
    enemies.splice(e2, 1);
    enemies.splice(e1, 1);
    enemies.push(SPAWN.enemy());
    enemies.push(SPAWN.enemy());
    player.points += COLLISION_ENEMY_ENEMY;
}
function collisionPlayer_Coin() {
    coin = SPAWN.coin();
    player.points += COLLISION_PLAYER_COIN;
}
function update() {
    player.speed.x = 0;
    player.speed.y = 0;
    if (keys.UP && player.lastKeys.horizontal == "UP") {
        player.speed.y = -SPEED_PLAYER();
    }
    else if (keys.DOWN && player.lastKeys.horizontal == "DOWN") {
        player.speed.y = SPEED_PLAYER();
    }
    if (keys.RIGHT && player.lastKeys.vertical == "RIGHT") {
        player.speed.x = SPEED_PLAYER();
    }
    else if (keys.LEFT && player.lastKeys.vertical == "LEFT") {
        player.speed.x = -SPEED_PLAYER();
    }
    player.update();
    if (DETECT_COLLISION(coin.position.x, coin.position.y, coin.dimension.width, coin.dimension.height, player.position.x, player.position.y, player.dimension.width, player.dimension.height)) {
        collisionPlayer_Coin();
    }
    for (let i = 0; i < enemies.length; i++) {
        const e1 = enemies[i];
        e1.update();
        if (DETECT_COLLISION(player.position.x, player.position.y, player.dimension.width, player.dimension.height, e1.position.x, e1.position.y, e1.dimension.width, e1.dimension.height)) {
            //collisionPlayer_Enemy(i);
        }
        else if (i < enemies.length - 1) {
            for (let j = i + 1; j < enemies.length; j++) {
                const e2 = enemies[j];
                if (DETECT_COLLISION(e1.position.x, e1.position.y, e1.dimension.width, e1.dimension.height, e2.position.x, e2.position.y, e2.dimension.width, e2.dimension.height)) {
                    collisionEnemy_Enemy(i, j);
                }
            }
        }
    }
}
function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_DIMENSION.width(), CANVAS_DIMENSION.height());
    coin.draw();
    enemies.forEach((enemy) => {
        //enemy.draw();
    });
    player.draw();
}
function animate() {
    if (CANVAS_DIMENSION.width() != WINDOW_DIMENSION.width() || CANVAS_DIMENSION.height() != WINDOW_DIMENSION.height())
        resizeParameters();
    update();
    draw();
    if (player.lives > 0)
        animateFrame = requestAnimationFrame(animate);
}
window.onload = setup;
