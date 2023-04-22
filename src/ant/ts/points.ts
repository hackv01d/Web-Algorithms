import { Point } from "./types/point.js";
import { Canvas } from "./canvas.js";


export let points: Point[] = [];
export let count: number = 0; // счётчик
let canvas = new Canvas('canvasAnt', 'container-canvas');


export function handlerPoints(mouseEvent: MouseEvent) {
    let x = mouseEvent.offsetX, y = mouseEvent.offsetY;
    canvas.drawPoint({ x, y });
    points.push({ x, y, count });
    count++;
}

canvas.canvas.addEventListener('mousedown', function (event: MouseEvent) {
    handlerPoints(event);
});



export function clearEvery(): void {
    canvas.clearField();
    points = [];
    count = 0;
}

document.getElementById('Clear')!.addEventListener('click', clearEvery);
