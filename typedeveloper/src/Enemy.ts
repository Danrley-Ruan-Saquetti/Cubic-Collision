class Enemy implements Block {
    position: IPosition
    dimension: IDimension
    color: string

    constructor(position: IPosition, dimension: IDimension, color: string) {
        this.position = position
        this.dimension = dimension
        this.color = color
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height)
    }

    update() {
        
    }
}