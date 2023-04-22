import { Point } from "../types/point.js";
import { NullableVertex } from "../types/nullableVertex.js";
export class Vertex {
    parent?: Vertex
    fScore: number
    gScore: number
    heuristicScore: number
    point: Point
    readonly neighbors: NullableVertex[]

    constructor(x: number, y: number) {
        this.point = { x: x, y: y }
        this.neighbors = []
        this.fScore = 0
        this.gScore = 0
        this.heuristicScore = 0
    }

    updateCost(): void {
        this.fScore = this.gScore + this.heuristicScore
    }
}