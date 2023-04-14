export class CanvasDrawing {
    private readonly elCanvas: HTMLCanvasElement
    private readonly context: CanvasRenderingContext2D
    private isDrawing: Boolean

    constructor(elCanvas: HTMLCanvasElement) {
        this.isDrawing = false
        this.elCanvas = elCanvas
        this.context = elCanvas.getContext('2d') as CanvasRenderingContext2D

        this.startDrawing = this.startDrawing.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
        this.draw = this.draw.bind(this);
    }

    start(): void {
        this.elCanvas.onmousedown = this.startDrawing;
        this.elCanvas.onmouseup = this.stopDrawing;
        this.elCanvas.onmouseout = this.stopDrawing;
        this.elCanvas.onmousemove = this.draw;
    }

    startDrawing(e: MouseEvent): void {
        this.isDrawing = true;

        this.context.beginPath();
        this.context.strokeStyle = "white"
        this.context.lineJoin = 'round'
        this.context.lineCap = 'round'

        this.context.moveTo(e.pageX - this.elCanvas.offsetLeft, e.pageY - this.elCanvas.offsetTop);
    }

    draw(e: MouseEvent): void {
        if (!this.isDrawing) return

        let x: number = e.pageX - this.elCanvas.offsetLeft;
        let y: number = e.pageY - this.elCanvas.offsetTop;

        this.context.lineTo(x, y);
        this.context.lineWidth = 5
        this.context.stroke();
    }

    stopDrawing(): void {
        this.isDrawing = false;
    }

     clearCanvas(): void {
        this.context.clearRect(0, 0, this.elCanvas.width, this.elCanvas.height);
    }
}