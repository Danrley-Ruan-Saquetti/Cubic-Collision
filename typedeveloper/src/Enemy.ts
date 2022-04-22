interface ITarget {
    x: number
    y: number
}

class Enemy implements Block {
    position: IPosition
    dimension: IDimension
    color: string
    target: ITarget

    constructor(position: IPosition, dimension: IDimension, color: string, target: ITarget) {
        this.position = position
        this.dimension = dimension
        this.color = color
        this.target = target
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height)
    }

    update() {
        if (this.position.x > this.target.x) this.position.x -= SPEED_ENEMY
        else if (this.position.x < this.target.x) this.position.x += SPEED_ENEMY
        if (this.position.y > this.target.y) this.position.y -= SPEED_ENEMY
        else if (this.position.y < this.target.y) this.position.y += SPEED_ENEMY
    }
}