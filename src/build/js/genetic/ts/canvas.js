export class Canvas {
    constructor(canvasId, containerId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth * 0.6;
        this.canvas.height = window.innerHeight * 0.6;
        this.width = window.innerWidth * 0.6;
        this.height = window.innerHeight * 0.6;
        this.container = document.getElementById(containerId);
    }
    clearField() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
    drawPoint(point) {
        this.context.beginPath();
        this.context.arc(point.x + 2, point.y + 3, 8, 0, 2 * Math.PI);
        this.context.fillStyle = "orange";
        this.context.fill();
    }
    drawLine(array, arrayPoints) {
        for (let i = 0; i < array.length; i++) {
            this.context.lineTo(arrayPoints[array[i]].x, arrayPoints[array[i]].y);
        }
    }
    drawWay(array, arrayPoints) {
        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.strokeStyle = "black";
        this.context.moveTo(arrayPoints[array[0]].x, arrayPoints[array[0]].y);
        this.drawLine(array, arrayPoints);
        this.context.lineTo(arrayPoints[array[0]].x, arrayPoints[array[0]].y);
        this.context.stroke();
    }
    retakePoints(array) {
        for (let i = 0; i < array.length; i++) {
            this.drawPoint(array[i]);
        }
    }
}
//# sourceMappingURL=canvas.js.map