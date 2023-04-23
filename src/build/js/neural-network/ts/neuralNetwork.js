import { DataLoader } from "./utils/dataLoader.js";
export class NeuralNetwork {
    constructor() {
        this.weights = { hidden: [], output: [] };
        this.biases = { hidden: [], output: [] };
        this.numInputNodes = 10;
        this.numHiddenNodes = 512;
        this.getWeights();
    }
    recognize(input) {
        const output = this.feedForward(input);
        const sorted = output.slice().sort((a, b) => b - a);
        return [output.indexOf(sorted[0]), output.indexOf(sorted[1]), output.indexOf(sorted[2])];
    }
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    feedForward(input) {
        const inputLayer = input;
        const hiddenLayer = Array(this.numHiddenNodes);
        for (let i = 0; i < hiddenLayer.length; i++) {
            let sum = 0;
            for (let j = 0; j < inputLayer.length; j++) {
                sum += inputLayer[j] * this.weights.hidden[i][j];
            }
            sum += this.biases.hidden[i];
            hiddenLayer[i] = this.sigmoid(sum);
        }
        const outputLayer = Array(this.numInputNodes);
        for (let i = 0; i < outputLayer.length; i++) {
            let sum = 0;
            for (let j = 0; j < hiddenLayer.length; j++) {
                sum += hiddenLayer[j] * this.weights.output[i][j];
            }
            sum += this.biases.output[i];
            outputLayer[i] = this.sigmoid(sum);
        }
        return outputLayer;
    }
    async getWeights() {
        const result = await DataLoader.shared.loadWeights();
        this.weights = result.weights;
        this.biases = result.biases;
    }
}
NeuralNetwork.shared = new NeuralNetwork();
//# sourceMappingURL=neuralNetwork.js.map