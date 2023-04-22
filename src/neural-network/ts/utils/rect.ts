export class Rect {
    xMin: number
    xMax: number
    yMin: number
    yMax: number

    constructor(image: ImageData) {
        this.xMin = image.width;
        this.xMax = -1;
        this.yMin = image.height;
        this.yMax = -1;
    }

    computeWidth(): number {
        return this.xMax - this.xMin + 1;
    }

    computeHeight(): number {
        return this.yMax - this.yMin + 1;
    }
}