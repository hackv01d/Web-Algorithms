export class CanvasDrawing {
    constructor(elCanvas) {
        this.isDrawing = false;
        this.elCanvas = elCanvas;
        const size = window.innerWidth * 0.3;
        this.elCanvas.width = size;
        this.elCanvas.height = size;
        this.context = elCanvas.getContext('2d');
        this.startDrawing = this.startDrawing.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
        this.draw = this.draw.bind(this);
    }
    start() {
        this.elCanvas.onmousedown = this.startDrawing;
        this.elCanvas.onmouseup = this.stopDrawing;
        this.elCanvas.onmouseout = this.stopDrawing;
        this.elCanvas.onmousemove = this.draw;
    }
    clearCanvas() {
        this.context.clearRect(0, 0, this.elCanvas.width, this.elCanvas.height);
    }
    stopDrawing() {
        this.isDrawing = false;
    }
    startDrawing(e) {
        this.isDrawing = true;
        this.context.beginPath();
        this.context.strokeStyle = "white";
        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        this.context.moveTo(e.pageX - this.elCanvas.offsetLeft, e.pageY - this.elCanvas.offsetTop);
    }
    draw(e) {
        if (!this.isDrawing)
            return;
        let x = e.pageX - this.elCanvas.offsetLeft;
        let y = e.pageY - this.elCanvas.offsetTop;
        this.context.lineTo(x, y);
        this.context.lineWidth = 10;
        this.context.stroke();
    }
}
//# sourceMappingURL=canvasDrawing.js.map