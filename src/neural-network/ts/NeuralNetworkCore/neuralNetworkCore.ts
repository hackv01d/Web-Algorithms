import { Biases } from "../types/biases";
import { MNISTData } from "../types/mnistData";
import { Weights } from "../types/weights";
import { DataProvider } from "./dataProvider";
import { MNISTDataType } from "./mnistDataType";

class NeuralNetworkCore {
    private inputLayer: number[]
    private readonly hiddenLayer: number[]
    private readonly outputLayer: number[]

    private readonly weights: Weights
    private readonly biases: Biases

    constructor(numInputNodes: number, numHiddenNodes: number, numOutputNodes: number) {
        this.inputLayer = Array(numInputNodes).fill(0);
        this.hiddenLayer = Array(numHiddenNodes).fill(0);
        this.outputLayer = Array(numOutputNodes).fill(0);

        this.biases = {
            hidden: Array(numHiddenNodes).fill(Math.random()),
            output: Array(numOutputNodes).fill(Math.random())
        }

        this.weights = {
            hidden: this.initializeWeights(numInputNodes, numHiddenNodes),
            output: this.initializeWeights(numHiddenNodes, numOutputNodes)
        }
    }

    predict(input: number[]): number {
        const output: number[] = this.feedForward(input);
        return output.indexOf(Math.max(...output))
    }

    train(data: number[][], target: number[], epochs: number, learningRate: number): void {
        for (let epoch = 0; epoch < epochs; epoch++) {
            let epochLoss: number = 0

            for (let i = 0; i < data.length; i++) {
                const input: number[] = data[i]
                const output: number[] = this.feedForward(input)

                const targetOutput: number[] = Array(this.outputLayer.length).fill(0)
                targetOutput[target[i]] = 1

                const outputLayerGradients: number[] = this.computeOutputLayerGradients(targetOutput, output)
                const hiddenLayerGradients: number[] = this.computeHiddenLayerGradients(outputLayerGradients)

                this.updateWeights(hiddenLayerGradients, outputLayerGradients, learningRate)
                epochLoss += this.computeLoss(targetOutput, output)
            }

            console.log(`Epoch: ${epoch + 1}, Loss: ${epochLoss / data.length}`)
            DataProvider.shared.saveWeights(epoch + 1, this.weights, this.biases)
        }
    }

    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x))
    }

    private sigmoidDerivative(x: number): number {
        const fx: number = this.sigmoid(x)
        return fx * (1 - fx)
    }

    private initializeWeights(input_neuron_count: number, output_neuron_count: number): number[][] {
        return Array.from({length: output_neuron_count}, () =>
            Array.from({length: input_neuron_count}, () =>
                this.normalRandom(0.0, Math.pow(input_neuron_count, -0.5))
            )
        )
    }

    private normalRandom(mean: number, standardDeviation: number): number {
        const u: number = 1 - Math.random()
        const v: number = Math.random()
        const randStdNormal: number = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v)
        return mean + standardDeviation * randStdNormal
    }

    private computeLoss(targetOutput: number[], output: number[]): number {
        let loss: number = 0;
        for (let i = 0; i < this.outputLayer.length; i++) {
            loss += Math.pow(targetOutput[i] - output[i], 2)
        }
        return loss
    }

    private computeOutputLayerGradients(targetOutput: number[], output: number[]): number[] {
        const outputLayerGradients: number[] = Array(this.outputLayer.length).fill(0)

        for (let i = 0; i < this.outputLayer.length; i++) {
            const derivative: number = this.sigmoidDerivative(output[i])
            const error: number = (targetOutput[i] - output[i])
            outputLayerGradients[i] = derivative * error
        }

        return outputLayerGradients
    }

    private computeHiddenLayerGradients(outputLayerGradients: number[]): number[] {
        const hiddenLayerGradients = Array(this.hiddenLayer.length).fill(0)

        for (let i = 0; i < this.hiddenLayer.length; i++) {
            let derivative: number = this.sigmoidDerivative(this.hiddenLayer[i])
            let error: number = 0

            for (let j = 0; j < this.outputLayer.length; j++) {
                error += outputLayerGradients[j] * this.weights.output[j][i]
            }

            hiddenLayerGradients[i] = derivative * error
        }

        return hiddenLayerGradients;
    }

    private feedForward(input: number[]): number[] {
        this.inputLayer = input;

        for (let i = 0; i < this.hiddenLayer.length; i++) {
            let sum: number = 0;
            for (let j = 0; j < this.inputLayer.length; j++) {
                sum += this.inputLayer[j] * this.weights.hidden[i][j]
            }
            sum += this.biases.hidden[i]
            this.hiddenLayer[i] = this.sigmoid(sum);
        }

        for (let i = 0; i < this.outputLayer.length; i++) {
            let sum: number = 0;
            for (let j = 0; j < this.hiddenLayer.length; j++) {
                sum += this.hiddenLayer[j] * this.weights.output[i][j]
            }
            sum += this.biases.output[i]
            this.outputLayer[i] = this.sigmoid(sum);
        }

        return this.outputLayer
    }

    private updateWeights(hiddenLayerGradients: number[], outputLayerGradients: number[], learningRate: number): void {
        for (let i = 0; i < this.outputLayer.length; i++) {

            for (let j = 0; j < this.hiddenLayer.length; j++) {
                const weightGradient: number = outputLayerGradients[i] * this.hiddenLayer[j]
                this.weights.output[i][j] += learningRate * weightGradient
            }

            this.biases.output[i] += learningRate * outputLayerGradients[i]
        }

        for (let i = 0; i < this.hiddenLayer.length; i++) {

            for (let j = 0; j < this.inputLayer.length; j++) {
                const weightGradient: number = hiddenLayerGradients[i] * this.inputLayer[j]
                this.weights.hidden[i][j] += learningRate * weightGradient
            }

            this.biases.hidden[i] += learningRate * hiddenLayerGradients[i]
        }
    }
}

function training(neuralNetwork: NeuralNetworkCore): void {
    const trainData: MNISTData = DataProvider.shared.loadMNISTData(MNISTDataType.train)
    neuralNetwork.train(trainData.input, trainData.target, 30, 0.1)
}

function testing(neuralNetwork: NeuralNetworkCore): void {
    const testData: MNISTData = DataProvider.shared.loadMNISTData(MNISTDataType.test)
    for (let i = 0; i < testData.input.length; i++) {
        console.log(`Correct value: ${testData.target[i]}, Predicted: ${neuralNetwork.predict(testData.input[i])}`)
    }
}


