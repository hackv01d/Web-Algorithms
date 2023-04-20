export class CanvasDrawing {
    private isDrawing: Boolean
    private readonly elCanvas: HTMLCanvasElement
    private readonly context: CanvasRenderingContext2D

    constructor(elCanvas: HTMLCanvasElement) {
        this.isDrawing = false
        this.elCanvas = elCanvas
        const size: number = window.innerWidth * 0.3
        this.elCanvas.width = size
        this.elCanvas.height = size
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

    clearCanvas(): void {
        this.context.clearRect(0, 0, this.elCanvas.width, this.elCanvas.height);
    }

    private stopDrawing(): void {
        this.isDrawing = false;
    }

    private startDrawing(e: MouseEvent): void {
        this.isDrawing = true;

        this.context.beginPath();
        this.context.strokeStyle = "white"
        this.context.lineJoin = 'round'
        this.context.lineCap = 'round'

        this.context.moveTo(e.pageX - this.elCanvas.offsetLeft, e.pageY - this.elCanvas.offsetTop);
    }

    private draw(e: MouseEvent): void {
        if (!this.isDrawing) return

        let x: number = e.pageX - this.elCanvas.offsetLeft;
        let y: number = e.pageY - this.elCanvas.offsetTop;

        this.context.lineTo(x, y);
        this.context.lineWidth = 10
        this.context.stroke();
    }
}