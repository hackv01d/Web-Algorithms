import { Point } from "./types/point.js";


export class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    container: HTMLElement;
    
    constructor(canvasId: string, containerId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
        this.container = document.getElementById(containerId) as HTMLElement;
    }

    clearField(): void {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    drawPoint(point: {x: number, y: number}): void {
        this.context.beginPath();
        this.context.arc(point.x + 2, point.y + 3, 8, 0, 2 * Math.PI);
        this.context.fillStyle = "orange";
        this.context.fill();
    }

    drawLine(array: number[], arrayPoints: Point[]): void {
        for (let i = 0; i < array.length; i++) {
            this.context.lineTo(arrayPoints[array[i]].x, arrayPoints[array[i]].y);
        }
    }

    drawPath(pointFirst: { x: number; y: number}, pointSecond: {x: number; y: number}):void {
        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.strokeStyle = "black";
        this.context.moveTo(pointFirst.x + 3, pointFirst.y + 4);
        this.context.lineTo(pointSecond.x + 3, pointSecond.y + 4);
        this.context.stroke();
    }

    retakePoints(array: Array<any>): void {
        for (let i: number = 0; i < array.length; i++) {
            this.drawPoint(array[i]);
        }
    }
}