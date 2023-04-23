export class DataLoader {
    constructor() { }
    async loadWeights() {
        const response = await fetch('./models/weights.json');
        return await response.json();
    }
}
DataLoader.shared = new DataLoader();
//# sourceMappingURL=dataLoader.js.map