export class Rect {
    constructor(image) {
        this.xMin = image.width;
        this.xMax = -1;
        this.yMin = image.height;
        this.yMax = -1;
    }
    computeWidth() {
        return this.xMax - this.xMin + 1;
    }
    computeHeight() {
        return this.yMax - this.yMin + 1;
    }
}
//# sourceMappingURL=rect.js.map