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
            position = { x: Math.random() * CANVAS_DIMENSION.width(), y: Math.random() * CANVAS_DIMENSION.height() }
        } while (DETECT_COLLISION(player.position.x, player.position.y, player.dimension.width, player.dimension.height, position.x, position.y, dimensionBlock.width, dimensionBlock.height));

        return new Enemy(position, dimensionBlock, color, player.position)
    }
}
const DETECT_COLLISION = (xP: number, yP: number, wP: number, hP: number, xE: number, yE: number, wE: number, hE: number) => {
    return ((xP >= xE && xP <= xE + wE && yP >= yE && yP <= yE + hE) ||
        (xP + wP >= xE && xP + wP <= xE + wE && yP >= yE && yP <= yE + hE) ||
        (xP + wP >= xE && xP + wP <= xE + wE && yP + hP >= yE && yP + hP <= yE + hE) ||
        (xP <= xE + wE && xP >= xE && yP + hP >= yE && yP + hP <= yE + hE))
}

resizeCanvas()

const DIMENSION_BLOCK = () => {
    return CANVAS_DIMENSION.width() * .03
}

const SPEED_PLAYER = 4
const SPEED_ENEMY = SPEED_PLAYER / 2

let player: Player
let enemies: Enemy[]

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

    animate()
}

function resizeCanvas() {
    canvas.width = WINDOW_DIMENSION.width()
    canvas.height = WINDOW_DIMENSION.height()
}

function resizeParameters() {
    const oldWidth = CANVAS_DIMENSION.width()
    const oldHeight = CANVAS_DIMENSION.height()

    resizeCanvas()

    let dimensionBlock = { width: DIMENSION_BLOCK(), height: DIMENSION_BLOCK() }

    player.dimension = dimensionBlock

    enemies.forEach((enemy) => {
        enemy.dimension = dimensionBlock
    })
}

function draw() {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, CANVAS_DIMENSION.width(), CANVAS_DIMENSION.height())

    enemies.forEach((enemy) => {
        enemy.draw()
    })
    player.draw()
}

function update() {
    player.speed.x = 0
    player.speed.y = 0

    if (keys.UP && player.lastKeys.horizontal == "UP") { player.speed.y = -SPEED_PLAYER }
    else if (keys.DOWN && player.lastKeys.horizontal == "DOWN") { player.speed.y = SPEED_PLAYER }
    if (keys.RIGHT && player.lastKeys.vertical == "RIGHT") { player.speed.x = SPEED_PLAYER }
    else if (keys.LEFT && player.lastKeys.vertical == "LEFT") { player.speed.x = -SPEED_PLAYER }

    player.update()
    enemies.forEach((enemy, iE) => {
        enemy.update()

        if (DETECT_COLLISION(player.position.x, player.position.y, player.dimension.width, player.dimension.height, enemy.position.x, enemy.position.y, enemy.dimension.width, enemy.dimension.height)) {
            enemies.splice(iE, 1)
        }
    })
}

function animate() {
    if (CANVAS_DIMENSION.width() != WINDOW_DIMENSION.width() || CANVAS_DIMENSION.height() != WINDOW_DIMENSION.height()) resizeParameters()

    update()
    draw()

    animateFrame = requestAnimationFrame(animate)
}

window.onload = setup
