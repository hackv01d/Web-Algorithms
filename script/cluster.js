export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getCoords() {
        return { x: this.x, y: this.y };
    }
    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }
    distanceTo(point) {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
