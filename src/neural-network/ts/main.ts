import { CanvasDrawing } from "./canvasDrawing.js";
import { recognizeButtonHandle, clearButtonHandle } from "./eventHandlers.js";

const canvas = document.querySelector('#canvas') as HTMLCanvasElement
const recognizeButton = document.querySelector('.rsg-btn') as HTMLButtonElement
const clearButton = document.querySelector('.clear-btn') as HTMLButtonElement

export const canvasDrawing: CanvasDrawing = new CanvasDrawing(canvas)
canvasDrawing.start()

recognizeButton.addEventListener('click', () => recognizeButtonHandle(canvas))
clearButton.addEventListener('click', clearButtonHandle)
