import { ImageConverter } from "./utils/imageConverter.js";
import { NeuralNetwork } from "./neuralNetwork.js";
import { canvasDrawing } from "./main.js";
export function recognizeButtonHandle(elCanvas, elDigits) {
    const input = ImageConverter.shared.convert(elCanvas);
    const recognizeDigits = NeuralNetwork.shared.recognize(input);
    elDigits.forEach(digit => digit.className = 'digit');
    elDigits[recognizeDigits[0]].classList.add('recognized-digit-first');
    elDigits[recognizeDigits[1]].classList.add('recognized-digit-second');
    elDigits[recognizeDigits[2]].classList.add('recognized-digit-third');
}
export function clearButtonHandle(elDigits) {
    canvasDrawing.clearCanvas();
    elDigits.forEach(digit => digit.className = 'digit');
}
//# sourceMappingURL=eventHandlers.js.map