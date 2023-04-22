import { Biases } from "./types/biases.js";
import { Weights } from "./types/weights.js";
import { ResultType } from "./types/resultType.js";
import { DataLoader } from "./utils/dataLoader.js";

export class NeuralNetwork {

    static shared: NeuralNetwork = new NeuralNetwork()

    private weights: Weights = {hidden: [], output: []}
    private biases: Biases = {hidden: [], output: []}
    private readonly numInputNodes: number = 10
    private readonly numHiddenNodes: number = 512

    private constructor() {
        this.getWeights()
    }

    recognize(input: number[]): number[] {
        const output: number[] = this.feedForward(input)
        const sorted: number[] = output.slice().sort((a: number, b: number) => b - a)

        return [output.indexOf(sorted[0]), output.indexOf(sorted[1]), output.indexOf(sorted[2])];
    }

    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private feedForward(input: number[]): number[] {
        const inputLayer = input;

        const hiddenLayer: number[] = Array(this.numHiddenNodes)
        for (let i = 0; i < hiddenLayer.length; i++) {
            let sum = 0;
            for (let j = 0; j < inputLayer.length; j++) {
                sum += inputLayer[j] * this.weights.hidden[i][j]
            }

            sum += this.biases.hidden[i]
            hiddenLayer[i] = this.sigmoid(sum);
        }

        const outputLayer: number[] = Array(this.numInputNodes)
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

    private async getWeights(): Promise<void> {
        const result: ResultType = await DataLoader.shared.loadWeights()
        this.weights = result.weights
        this.biases = result.biases
    }
}