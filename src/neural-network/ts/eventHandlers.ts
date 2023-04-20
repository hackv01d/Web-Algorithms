import { ImageConverter } from "./utils/imageConverter.js";
import { NeuralNetwork } from "./neuralNetwork.js";
import { canvasDrawing } from "./main.js";

export function recognizeButtonHandle(elCanvas: HTMLCanvasElement, elDigits: HTMLDivElement[]): void {
    const input: number[] = ImageConverter.shared.convert(elCanvas)
    const recognizeDigits: number[] = NeuralNetwork.shared.recognize(input)

    elDigits.forEach(digit => digit.className = 'digit')
    elDigits[recognizeDigits[0]].className = 'recognized-digit-first'
    elDigits[recognizeDigits[1]].className = 'recognized-digit-second'
    elDigits[recognizeDigits[2]].className = 'recognized-digit-third'
}

export function clearButtonHandle(elDigits: HTMLDivElement[]): void {
    canvasDrawing.clearCanvas()
    elDigits.forEach(digit => digit.className = 'digit')
}