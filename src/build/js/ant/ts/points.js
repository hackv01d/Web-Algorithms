import { Canvas } from "./canvas.js";
export let points = [];
export let count = 0; // счётчик
let canvas = new Canvas('canvasAnt', 'container-canvas');
export function handlerPoints(mouseEvent) {
    let x = mouseEvent.offsetX, y = mouseEvent.offsetY;
    canvas.drawPoint({ x, y });
    points.push({ x, y, count });
    count++;
}
canvas.canvas.addEventListener('mousedown', function (event) {
    handlerPoints(event);
});
export function clearEvery() {
    canvas.clearField();
    points = [];
    count = 0;
}
document.getElementById('Clear').addEventListener('click', clearEvery);
//# sourceMappingURL=points.js.map