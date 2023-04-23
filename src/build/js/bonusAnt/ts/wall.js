export default class Wall {
    constructor(coordinateX, coordinateY, currentWidth, currentHeight) {
        this.position = { x: coordinateX, y: coordinateY };
        this.width = currentWidth;
        this.height = currentHeight;
    }
    draw(context) {
        context.beginPath();
        context.fillStyle = "#8B4513";
        context.rect(this.position.x, this.position.y, this.width, this.height);
        context.fill();
        context.closePath();
    }
}
//# sourceMappingURL=wall.js.map