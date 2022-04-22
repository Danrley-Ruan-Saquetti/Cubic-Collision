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

resizeCanvas()

const DIMENSION_BLOCK = 30

const SPEED_PLAYER = 4

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

    let dimensionBlock = { width: DIMENSION_BLOCK, height: DIMENSION_BLOCK }
    let positionPlayer = { x: (CANVAS_DIMENSION.width() - dimensionBlock.width) / 2, y: (CANVAS_DIMENSION.height() - dimensionBlock.height) / 2 }
    let speedPlayer = { x: 0, y: 0 }
    let colorPlayer = "#ff0000"
    let lastKeys = { horizontal: "", vertical: "" }

    player = new Player(positionPlayer, dimensionBlock, colorPlayer, speedPlayer, lastKeys)
    enemies = [new Enemy({ x: 0, y: 0 }, dimensionBlock, "#fff", player.position)]

    animate()
}

function resizeCanvas() {
    canvas.width = WINDOW_DIMENSION.width()
    canvas.height = WINDOW_DIMENSION.height()
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
    enemies.forEach((enemy) => {
        enemy.update()
    })
}

function animate() {
    if (CANVAS_DIMENSION.width() != WINDOW_DIMENSION.width() || CANVAS_DIMENSION.height() != WINDOW_DIMENSION.height()) resizeCanvas()

    update()
    draw()

    animateFrame = requestAnimationFrame(animate)
}

window.onload = setup
