import { DataProvider } from "./dataProvider";
import { MNISTDataType } from "./mnistDataType";
class NeuralNetworkCore {
    constructor(numInputNodes = 784, numHiddenNodes = 512, numOutputNodes = 10) {
        this.inputLayer = Array(numInputNodes).fill(0);
        this.hiddenLayer = Array(numHiddenNodes).fill(0);
        this.outputLayer = Array(numOutputNodes).fill(0);
        this.biases = {
            hidden: Array(numHiddenNodes).fill(Math.random()),
            output: Array(numOutputNodes).fill(Math.random())
        };
        this.weights = {
            hidden: this.initializeWeights(numInputNodes, numHiddenNodes),
            output: this.initializeWeights(numHiddenNodes, numOutputNodes)
        };
    }
    predict(input) {
        const output = this.feedForward(input);
        return output.indexOf(Math.max(...output));
    }
    train(data, target, epochs, learningRate) {
        for (let epoch = 0; epoch < epochs; epoch++) {
            let epochLoss = 0;
            for (let i = 0; i < data.length; i++) {
                const input = data[i];
                const output = this.feedForward(input);
                const targetOutput = Array(this.outputLayer.length).fill(0);
                targetOutput[target[i]] = 1;
                const outputLayerGradients = this.computeOutputLayerGradients(targetOutput, output);
                const hiddenLayerGradients = this.computeHiddenLayerGradients(outputLayerGradients);
                this.updateWeights(hiddenLayerGradients, outputLayerGradients, learningRate);
                epochLoss += this.computeLoss(targetOutput, output);
            }
            console.log(`Epoch: ${epoch + 1}, Loss: ${epochLoss / data.length}`);
            DataProvider.shared.saveWeights(epoch + 1, this.weights, this.biases);
        }
    }
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    sigmoidDerivative(x) {
        const fx = this.sigmoid(x);
        return fx * (1 - fx);
    }
    initializeWeights(numInputNodes, numOutputNodes) {
        return Array.from({ length: numOutputNodes }, () => Array.from({ length: numInputNodes }, () => this.normalRandom(0.0, Math.pow(numInputNodes, -0.5))));
    }
    normalRandom(mean, standardDeviation) {
        const u = 1 - Math.random();
        const v = Math.random();
        const randStdNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
        return mean + standardDeviation * randStdNormal;
    }
    computeLoss(targetOutput, output) {
        let loss = 0;
        for (let i = 0; i < this.outputLayer.length; i++) {
            loss += Math.pow(targetOutput[i] - output[i], 2);
        }
        return loss;
    }
    computeOutputLayerGradients(targetOutput, output) {
        const outputLayerGradients = Array(this.outputLayer.length).fill(0);
        for (let i = 0; i < this.outputLayer.length; i++) {
            const derivative = this.sigmoidDerivative(output[i]);
            const error = (targetOutput[i] - output[i]);
            outputLayerGradients[i] = derivative * error;
        }
        return outputLayerGradients;
    }
    computeHiddenLayerGradients(outputLayerGradients) {
        const hiddenLayerGradients = Array(this.hiddenLayer.length).fill(0);
        for (let i = 0; i < this.hiddenLayer.length; i++) {
            let derivative = this.sigmoidDerivative(this.hiddenLayer[i]);
            let error = 0;
            for (let j = 0; j < this.outputLayer.length; j++) {
                error += outputLayerGradients[j] * this.weights.output[j][i];
            }
            hiddenLayerGradients[i] = derivative * error;
        }
        return hiddenLayerGradients;
    }
    feedForward(input) {
        this.inputLayer = input;
        for (let i = 0; i < this.hiddenLayer.length; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputLayer.length; j++) {
                sum += this.inputLayer[j] * this.weights.hidden[i][j];
            }
            sum += this.biases.hidden[i];
            this.hiddenLayer[i] = this.sigmoid(sum);
        }
        for (let i = 0; i < this.outputLayer.length; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenLayer.length; j++) {
                sum += this.hiddenLayer[j] * this.weights.output[i][j];
            }
            sum += this.biases.output[i];
            this.outputLayer[i] = this.sigmoid(sum);
        }
        return this.outputLayer;
    }
    updateWeights(hiddenLayerGradients, outputLayerGradients, learningRate) {
        for (let i = 0; i < this.outputLayer.length; i++) {
            for (let j = 0; j < this.hiddenLayer.length; j++) {
                const weightGradient = outputLayerGradients[i] * this.hiddenLayer[j];
                this.weights.output[i][j] += learningRate * weightGradient;
            }
            this.biases.output[i] += learningRate * outputLayerGradients[i];
        }
        for (let i = 0; i < this.hiddenLayer.length; i++) {
            for (let j = 0; j < this.inputLayer.length; j++) {
                const weightGradient = hiddenLayerGradients[i] * this.inputLayer[j];
                this.weights.hidden[i][j] += learningRate * weightGradient;
            }
            this.biases.hidden[i] += learningRate * hiddenLayerGradients[i];
        }
    }
}
function training(neuralNetwork, epochs, learningRate = 0.1) {
    const trainData = DataProvider.shared.loadMNISTData(MNISTDataType.train);
    neuralNetwork.train(trainData.input, trainData.target, epochs, learningRate);
}
function testing(neuralNetwork) {
    const testData = DataProvider.shared.loadMNISTData(MNISTDataType.test);
    for (let i = 0; i < testData.input.length; i++) {
        console.log(`Correct value: ${testData.target[i]}, Predicted: ${neuralNetwork.predict(testData.input[i])}`);
    }
}
//# sourceMappingURL=neuralNetworkCore.js.map