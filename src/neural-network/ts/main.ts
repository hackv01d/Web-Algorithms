import { CanvasDrawing } from "./canvasDrawing.js";
import { recognizeButtonHandle, clearButtonHandle } from "./eventHandlers.js";

const canvas = document.querySelector('#canvas') as HTMLCanvasElement
const elDigits = Array.from<HTMLDivElement>(document.querySelectorAll('.digits-field div'))
const recognizeButton = document.querySelector('.rsg-btn') as HTMLButtonElement
const clearButton = document.querySelector('.clear-btn') as HTMLButtonElement

export const canvasDrawing: CanvasDrawing = new CanvasDrawing(canvas)
canvasDrawing.start()

clearButton.addEventListener('click', () => clearButtonHandle(elDigits))
recognizeButton.addEventListener('click', () => recognizeButtonHandle(canvas, elDigits))

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.3
    canvas.height = window.innerWidth * 0.3
})
