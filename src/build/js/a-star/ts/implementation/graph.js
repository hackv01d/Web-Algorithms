import { Vertex } from "./vertex.js";
export class Graph {
    constructor(size) {
        this.size = size;
        this._startVertex = new Vertex(0, 0);
        this._goalVertex = new Vertex(size - 1, size - 1);
        this.matrix = new Array(size);
        for (let q = 0; q < size; q++) {
            this.matrix[q] = Array(size);
        }
    }
    get startVertex() {
        return this._startVertex;
    }
    get goalVertex() {
        return this._goalVertex;
    }
    addWall(point) {
        this.matrix[point.y][point.x] = null;
    }
    removeWallFromStart() {
        this.removeWall(this.startVertex.point);
    }
    removeWallFromGoal() {
        this.removeWall(this.goalVertex.point);
    }
    removeWall(point) {
        this.matrix[point.y][point.x] = new Vertex(point.x, point.y);
    }
    clearMatrix() {
        this.matrix.forEach(arr => arr.map(() => arr.splice(0, arr.length)));
    }
    updateSize(newSize) {
        this.size = newSize;
        this.updateMatrix();
    }
    setDefaultStartAndGoal() {
        this.updateStart({ x: 0, y: 0 });
        this.updateGoal({ x: this.size - 1, y: this.size - 1 });
    }
    isAvailableAt(point) {
        return this.matrix[point.y][point.x] !== null;
    }
    updateStart(point) {
        if (!this.isAvailableAt(point))
            return;
        this._startVertex.point = point;
    }
    updateGoal(point) {
        if (!this.isAvailableAt(point))
            return;
        this._goalVertex.point = point;
    }
    updateMatrix() {
        this.matrix = new Array(this.size);
        for (let q = 0; q < this.size; q++) {
            this.matrix[q] = Array(this.size);
        }
    }
    toggleWall(point) {
        this.matrix[point.y][point.x] === null
            ? this.matrix[point.y][point.x] = new Vertex(point.x, point.y)
            : this.matrix[point.y][point.x] = null;
    }
    build() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.matrix[i][j] === null)
                    continue;
                this.matrix[i][j] = new Vertex(j, i);
            }
        }
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const vertex = (this.matrix)[i][j];
                if (vertex === null)
                    continue;
                if (j > 0)
                    vertex.neighbors.push(this.matrix[i][j - 1]);
                if (i > 0)
                    vertex.neighbors.push(this.matrix[i - 1][j]);
                if (j < this.size - 1)
                    vertex.neighbors.push(this.matrix[i][j + 1]);
                if (i < this.size - 1 && this.matrix[i + 1])
                    vertex.neighbors.push(this.matrix[i + 1][j]);
                this.matrix[i][j] = vertex;
            }
        }
        this._startVertex = this.matrix[this._startVertex.point.y][this._startVertex.point.x];
        this._goalVertex = this.matrix[this._goalVertex.point.y][this._goalVertex.point.x];
    }
}
//# sourceMappingURL=graph.js.map