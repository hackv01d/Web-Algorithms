export class Vertex {
    constructor(x, y) {
        this.point = { x: x, y: y };
        this.neighbors = [];
        this.fScore = 0;
        this.gScore = 0;
        this.heuristicScore = 0;
    }
    updateCost() {
        this.fScore = this.gScore + this.heuristicScore;
    }
}
//# sourceMappingURL=vertex.js.map