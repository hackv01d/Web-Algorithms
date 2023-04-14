import { Biases } from "./types/biases.js";
import { Weights } from "./types/weights.js";
import { ResultType } from "./types/resultType.js";
import { DataLoader } from "./utils/dataLoader.js";

export class NeuralNetwork {

    static shared: NeuralNetwork = new NeuralNetwork()

    weights: Weights = {hidden: [], output: []}
    biases: Biases = {hidden: [], output: []}

    private constructor() {
        this.getWeights()
    }

    recognize(input: number[]): number {
        const output: number[] = this.feedForward(input)
        return output.indexOf(Math.max(...output));
    }

    private async getWeights(): Promise<void> {
        const result: ResultType = await DataLoader.shared.loadWeights()
        this.weights = result.weights
        this.biases = result.biases
    }

    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private feedForward(input: number[]): number[] {
        const inputLayer = input;
        const hiddenLayer: number[] = Array(512)
        for (let i = 0; i < hiddenLayer.length; i++) {
            let sum = 0;
            for (let j = 0; j < inputLayer.length; j++) {
                sum += inputLayer[j] * this.weights.hidden[i][j]
            }
            sum += this.biases.hidden[i]
            hiddenLayer[i] = this.sigmoid(sum);
        }
        const outputLayer: number[] = Array(10)
        for (let i = 0; i < outputLayer.length; i++) {
            let sum = 0;
            for (let j = 0; j < hiddenLayer.length; j++) {
                sum += hiddenLayer[j] * this.weights.output[i][j]
            }
            sum += this.biases.output[i]
            outputLayer[i] = this.sigmoid(sum);
        }

        return outputLayer;
    }
}