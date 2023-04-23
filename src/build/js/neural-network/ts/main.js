import { CanvasDrawing } from "./canvasDrawing.js";
import { recognizeButtonHandle, clearButtonHandle } from "./eventHandlers.js";
const canvas = document.querySelector('#canvas');
const elDigits = Array.from(document.querySelectorAll('.digits-field div'));
const recognizeButton = document.querySelector('.rsg-btn');
const clearButton = document.querySelector('.clear-btn');
export const canvasDrawing = new CanvasDrawing(canvas);
canvasDrawing.start();
clearButton.addEventListener('click', () => clearButtonHandle(elDigits));
recognizeButton.addEventListener('click', () => recognizeButtonHandle(canvas, elDigits));
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.3;
    canvas.height = window.innerWidth * 0.3;
});
//# sourceMappingURL=main.js.map