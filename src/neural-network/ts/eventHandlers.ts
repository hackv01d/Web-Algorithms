import { ImageConverter } from "./utils/imageConverter.js";
import { NeuralNetwork } from "./neuralNetwork.js";
import { canvasDrawing } from "./main.js";

export function recognizeButtonHandle(elCanvas: HTMLCanvasElement): void {
    const input: number[] = ImageConverter.shared.convert(elCanvas)
    const value: number = NeuralNetwork.shared.recognize(input)
    console.log(value)
}

export function clearButtonHandle(): void {
    canvasDrawing.clearCanvas()
}