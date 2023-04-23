import fs from 'fs';
import { MNISTDataType } from "./mnistDataType";
export class DataProvider {
    constructor() { }
    saveWeights(epoch, weights, biases) {
        const filename = `./../../models/weights-epoch-${epoch}.json`;
        const result = { weights: weights, biases: biases };
        fs.writeFileSync(filename, JSON.stringify(result));
        console.log(`Saved weights to ${filename}`);
    }
    addDataToMnist(data, label) {
        const dataString = `${label},${data.join(',')}`;
        fs.appendFileSync(MNISTDataType.train, dataString);
    }
    loadMNISTData(mnistDataType) {
        const rawData = fs.readFileSync(mnistDataType, "utf-8");
        const lines = rawData.split("\n");
        const input = [];
        const target = [];
        for (const line of lines) {
            const values = line.split(",").map(val => Number(val) / 255);
            const label = values.shift();
            if (label === undefined)
                continue;
            input.push(values);
            target.push(label * 255);
        }
        return { input: input, target: target };
    }
}
DataProvider.shared = new DataProvider();
//# sourceMappingURL=dataProvider.js.map