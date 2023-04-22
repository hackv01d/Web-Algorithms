import { Vertex } from "./vertex.js";
import { Point } from "../types/point.js";
import { NullableVertex } from "../types/nullableVertex.js";

export class Graph {
    private _startVertex: Vertex
    private _goalVertex: Vertex

    private size: number;
    private matrix: NullableVertex[][];

    constructor(size: number) {
        this.size = size

        this._startVertex = new Vertex(0, 0)
        this._goalVertex = new Vertex(size - 1, size - 1)

        this.matrix = new Array(size)
        for (let q = 0; q < size; q++) {
            this.matrix[q] = Array(size)
        }
    }

    get startVertex(): Vertex {
        return this._startVertex
    }

    get goalVertex(): Vertex {
        return this._goalVertex
    }

    addWall(point: Point): void {
        this.matrix[point.y][point.x] = null
    }

    removeWallFromStart(): void {
        this.removeWall(this.startVertex.point)
    }

    removeWallFromGoal(): void {
        this.removeWall(this.goalVertex.point)
    }

    removeWall(point: Point): void {
        this.matrix[point.y][point.x] = new Vertex(point.x, point.y)
    }

    clearMatrix(): void {
        this.matrix.forEach(arr => arr.map(() => arr.splice(0, arr.length)))
    }

    updateSize(newSize: number): void {
        this.size = newSize
        this.updateMatrix()
    }

    setDefaultStartAndGoal(): void {
        this.updateStart({x: 0, y: 0})
        this.updateGoal({x: this.size - 1, y: this.size - 1})
    }

    isAvailableAt(point: Point): boolean {
        return this.matrix[point.y][point.x] !== null
    }

    updateStart(point: Point): void {
        if (!this.isAvailableAt(point)) return;
        this._startVertex.point = point
    }

    updateGoal(point: Point): void {
        if (!this.isAvailableAt(point)) return;
        this._goalVertex.point = point
    }

    updateMatrix(): void {
        this.matrix = new Array(this.size)
        for (let q = 0; q < this.size; q++) {
            this.matrix[q] = Array(this.size)
        }
    }

    toggleWall(point: Point): void {
        this.matrix[point.y][point.x] === null
            ? this.matrix[point.y][point.x] = new Vertex(point.x, point.y)
            : this.matrix[point.y][point.x] = null
    }

    build(): void {
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if (this.matrix[i][j] === null) continue;
                this.matrix[i][j] = new Vertex(j, i)
            }
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const vertex = (this.matrix)[i][j]
                if (vertex === null) continue;

                if (j > 0) vertex.neighbors.push(this.matrix[i][j - 1])
                if (i > 0) vertex.neighbors.push(this.matrix[i - 1][j])
                if (j < this.size - 1) vertex.neighbors.push(this.matrix[i][j + 1])
                if (i < this.size - 1 && this.matrix[i + 1]) vertex.neighbors.push(this.matrix[i + 1][j])

                this.matrix[i][j] = vertex
            }
        }

        this._startVertex = this.matrix[this._startVertex.point.y][this._startVertex.point.x] as Vertex
        this._goalVertex = this.matrix[this._goalVertex.point.y][this._goalVertex.point.x] as Vertex
    }
}