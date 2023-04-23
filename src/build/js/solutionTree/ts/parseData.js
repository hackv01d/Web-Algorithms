export class parseData {
    constructor(containerInput, containerOutput, separator) {
        this.containerInput = containerInput;
        this.containerOutput = containerOutput;
        this.separator = separator;
    }
    getInputDataMatrix() {
        const rows = this.containerInput.value.split('\n');
        let matrix = [];
        for (const row of rows) {
            const parsedRow = this.parseRow(row);
            matrix.push(parsedRow);
        }
        return matrix;
    }
    getOutputDataRow() {
        const row = this.containerOutput.value;
        return this.parseRow(row);
    }
    parseRow(row) {
        let result = [];
        const parts = row.split(this.separator);
        if ((row.match(/"/g) || []).length !== 0) {
            for (let i = 0; i < parts.length; i++) {
                let currentPart = parts[i];
                let quoteCount = (currentPart.match(/"/g) || []).length;
                while (quoteCount % 2 !== 0 && i < parts.length - 1) {
                    i++;
                    currentPart += parts[i];
                    quoteCount = (currentPart.match(/"/g) || []).length;
                }
                const match = /^\d+(\.\d+)?/.exec(currentPart);
                if (match && match[0] === currentPart) {
                    result.push(Number(match[0]));
                }
                else {
                    result.push(currentPart);
                }
            }
        }
        else {
            for (let i = 0; i < parts.length; i++) {
                let currentPart = parts[i];
                const match = /^\d+(\.\d+)?/.exec(currentPart);
                if (match && match[0] === currentPart) {
                    result.push(Number(match[0]));
                }
                else {
                    result.push(currentPart);
                }
            }
        }
        ;
        return result;
    }
}
//# sourceMappingURL=parseData.js.map