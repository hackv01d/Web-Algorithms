import { ResultType } from "../types/resultType.js";

export class DataLoader {

    static shared: DataLoader = new DataLoader()

    private constructor() {}

    async loadWeights(): Promise<ResultType> {
        const response: Response = await fetch('./models/weights.json')
        return await response.json() as ResultType
    }
}