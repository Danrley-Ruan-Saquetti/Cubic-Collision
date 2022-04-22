const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

const WINDOW_DIMENSION = {
    width: () => {
        return innerWidth
    },
    height: () => {
        return innerHeight
    }
}
const CANVAS_DIMENSION = {
    width: () => {
        return canvas.clientWidth
    },
    height: () => {
        return canvas.clientHeight
    }
}
const SPAWN = {
    player: () => {
        let dimensionBlock = { width: DIMENSION_BLOCK(), height: DIMENSION_BLOCK() }
        let position = { x: (CANVAS_DIMENSION.width() - dimensionBlock.width) / 2, y: (CANVAS_DIMENSION.height() - dimensionBlock.height) / 2 }
        let speed = { x: 0, y: 0 }
        let color = "#ff0000"
        let lastKeys = { horizontal: "", vertical: "" }

        return new Player(position, dimensionBlock, color, speed, lastKeys)
    },
    enemy: () => {
        let dimensionBlock = { width: DIMENSION_BLOCK(), height: DIMENSION_BLOCK() }
        let color = "#fff"
        let position

        do {
            position = { x: Math.random() * (CANVAS_DIMENSION.width() - dimensionBlock.width), y: Math.random() * (CANVAS_DIMENSION.height() - dimensionBlock.height) }
        } while (DETECT_COLLISION(player.position.x, player.position.y, player.dimension.width, player.dimension.height, position.x, position.y, dimensionBlock.width, dimensionBlock.height));

        return new Enemy(position, dimensionBlock, color, player.position)
    },
    coin: () => {
        let dimensionBlock = { width: DIMENSION_BLOCK() * COIN_DIMENSION_PERC, height: DIMENSION_BLOCK() * COIN_DIMENSION_PERC }
        let color = "#ffff00"
        let position

        do {
            position = { x: Math.random() * (CANVAS_DIMENSION.width() - dimensionBlock.width), y: Math.random() * (CANVAS_DIMENSION.height() - dimensionBlock.height) }
        } while (DETECT_COLLISION(player.position.x, player.position.y, player.dimension.width, player.dimension.height, position.x, position.y, dimensionBlock.width, dimensionBlock.height));

        return new Enemy(position, dimensionBlock, color, player.position)
    }
}
const DETECT_COLLISION = (x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) => {
    return ((x1 >= x2 && x1 <= x2 + w2 && y1 >= y2 && y1 <= y2 + h2) ||
        (x1 + w1 >= x2 && x1 + w1 <= x2 + w2 && y1 >= y2 && y1 <= y2 + h2) ||
        (x1 + w1 >= x2 && x1 + w1 <= x2 + w2 && y1 + h1 >= y2 && y1 + h1 <= y2 + h2) ||
        (x1 <= x2 + w2 && x1 >= x2 && y1 + h1 >= y2 && y1 + h1 <= y2 + h2))
}
const DIMENSION_BLOCK = () => {
    return (CANVAS_DIMENSION.width() * SPEED_PLAYER_PERC + CANVAS_DIMENSION.height() * SPEED_PLAYER_PERC) / 2
}
const SPEED_PLAYER = () => { return DIMENSION_BLOCK() * 0.15 }
const SPEED_ENEMY = () => { return SPEED_PLAYER() / 2 }

const SPEED_PLAYER_PERC = .04
const COIN_DIMENSION_PERC = .5

resizeCanvas()

let player: Player
let enemies: Enemy[]
let coin: Coin

let keys: {
    UP: boolean
    DOWN: boolean
    RIGHT: boolean
    LEFT: boolean
}
let animateFrame: number

function setup() {
    addEventListener("keydown", (ev) => {
        switch (ev.key) {
            case "w": //UP
                keys.UP = true
                player.lastKeys.horizontal = "UP"
                break;
            case "s": //DOWN
                keys.DOWN = true
                player.lastKeys.horizontal = "DOWN"
                break;
            case "d": //RIGHT
                keys.RIGHT = true
                player.lastKeys.vertical = "RIGHT"
                break;
            case "a": //LEFT
                keys.LEFT = true
                player.lastKeys.vertical = "LEFT"
                break;
        }
    })
    addEventListener("keyup", (ev) => {
        switch (ev.key) {
            case "w": //UP
                keys.UP = false
                break;
            case "s": //DOWN
                keys.DOWN = false
                break;
            case "d": //RIGHT
                keys.RIGHT = false
                break;
            case "a": //LEFT
                keys.LEFT = false
                break;
        }
    })

    initial()
}

function initial() {
    keys = {
        UP: false,
        DOWN: false,
        RIGHT: false,
        LEFT: false,
    }
    enemies = []

    player = SPAWN.player()
    for (let i = 0; i < 4; i++) {
        enemies.push(SPAWN.enemy())
    }

    coin = SPAWN.coin()

    animate()
}

function resizeCanvas() {
    canvas.width = WINDOW_DIMENSION.width()
    canvas.height = WINDOW_DIMENSION.height()
}

function resizeParameters() {
    const oldWidth = CANVAS_DIMENSION.width()
    const oldHeight = CANVAS_DIMENSION.height()

    const newPos = (pos: { x: number; y: number }) => {
        return { x: (pos.x * CANVAS_DIMENSION.width()) / oldWidth, y: (pos.y * CANVAS_DIMENSION.height()) / oldHeight }
    }

    resizeCanvas()

    let dimensionBlock = { width: DIMENSION_BLOCK(), height: DIMENSION_BLOCK() }

    player.dimension = dimensionBlock
    player.position = newPos(player.position)

    enemies.forEach((enemy) => {
        enemy.dimension = dimensionBlock
        enemy.position = newPos(enemy.position)
    })
}

function collisionPlayer_Enemy(e: number) {
    enemies.splice(e, 1)
    enemies.push(SPAWN.enemy())
}

function collisionEnemy_Enemy(e1: number, e2: number) {
    enemies.splice(e2, 1)
    enemies.splice(e1, 1)
    enemies.push(SPAWN.enemy())
    enemies.push(SPAWN.enemy())
}

function update() {
    player.speed.x = 0
    player.speed.y = 0

    if (keys.UP && player.lastKeys.horizontal == "UP") { player.speed.y = -SPEED_PLAYER() }
    else if (keys.DOWN && player.lastKeys.horizontal == "DOWN") { player.speed.y = SPEED_PLAYER() }
    if (keys.RIGHT && player.lastKeys.vertical == "RIGHT") { player.speed.x = SPEED_PLAYER() }
    else if (keys.LEFT && player.lastKeys.vertical == "LEFT") { player.speed.x = -SPEED_PLAYER() }

    player.update()

    if (DETECT_COLLISION(coin.position.x, coin.position.y, coin.dimension.width, coin.dimension.height, player.position.x, player.position.y, player.dimension.width, player.dimension.height)) {
        coin = SPAWN.coin()
    }

    for (let i = 0; i < enemies.length; i++) {
        const e1 = enemies[i];
        e1.update()

        if (DETECT_COLLISION(player.position.x, player.position.y, player.dimension.width, player.dimension.height, e1.position.x, e1.position.y, e1.dimension.width, e1.dimension.height)) {
            collisionPlayer_Enemy(i)
        } else if (i < enemies.length - 1) {
            for (let j = i + 1; j < enemies.length; j++) {
                const e2 = enemies[j];
                if (DETECT_COLLISION(e1.position.x, e1.position.y, e1.dimension.width, e1.dimension.height, e2.position.x, e2.position.y, e2.dimension.width, e2.dimension.height)) {
                    collisionEnemy_Enemy(i, j)
                }
            }
        }
    }
}

function draw() {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, CANVAS_DIMENSION.width(), CANVAS_DIMENSION.height())

    coin.draw()
    enemies.forEach((enemy) => {
        enemy.draw()
    })
    player.draw()
}

function animate() {
    if (CANVAS_DIMENSION.width() != WINDOW_DIMENSION.width() || CANVAS_DIMENSION.height() != WINDOW_DIMENSION.height()) resizeParameters()

    update()
    draw()

    animateFrame = requestAnimationFrame(animate)
}

window.onload = setup
