import fs from 'fs'
import { Biases } from "../types/biases";
import { Weights } from "../types/weights";
import { MNISTData } from "../types/mnistData";
import { MNISTDataType } from "./mnistDataType";

export class DataProvider {

    static shared: DataProvider = new DataProvider()

    private constructor() {}

    saveWeights(epoch: number, weights: Weights, biases: Biases): void {
        const filename: string = `./../../models/weights-epoch-${epoch}.json`
        const result = { weights: weights, biases: biases }
        fs.writeFileSync(filename, JSON.stringify(result))
        console.log(`Saved weights to ${filename}`)
    }

    addDataToMnist(data: number[], label: number): void {
        const dataString: string = `${label},${data.join(',')}`
        fs.appendFileSync(MNISTDataType.train, dataString)
    }

    loadMNISTData(mnistDataType: MNISTDataType): MNISTData {
        const rawData: string = fs.readFileSync(mnistDataType, "utf-8")
        const lines: string[] = rawData.split("\n")

        const input: number[][] = []
        const target: number[] = []

        for (const line of lines) {
            const values: number[] =  line.split(",").map(val => Number(val) / 255)
            const label: (number | undefined) = values.shift()

            if (label === undefined) continue

            input.push(values)
            target.push(label * 255)
        }

        return { input: input, target: target }
    }
}