abstract class Block {
    position: IPosition
    dimension: IDimension
    color: string

    constructor(position: IPosition, dimension: IDimension, color: string) {
        this.position = position
        this.dimension = dimension
        this.color = color
    }

    draw(): void {}
    update(): void {}
}