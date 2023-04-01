import { animCell } from "./animation.js";
import { Position } from "./types/position.js";
import { ElementColors } from "./enums/elementColors.js";

type NullableVertex = (Vertex | null)

class Vertex {
    parent?: Vertex
    fScore: number
    gScore: number
    heuristicScore: number
    readonly position: Position
    readonly neighbors: NullableVertex[]

    constructor(x: number, y: number) {
        this.position = { x: x, y: y }
        this.neighbors = []
        this.fScore = 0
        this.gScore = 0
        this.heuristicScore = 0
    }

    updateCost() {
        this.fScore = this.gScore + this.heuristicScore
    }
}

export class Graph {

    private _startVertex: Vertex
    private _goalVertex: Vertex

    private startPosition: Position
    private goalPosition: Position

    private readonly size: number;
    private readonly matrix: NullableVertex[][];

    constructor(size: number) {
        this.size = size

        this.startPosition = { x: 0, y: 0}
        this.goalPosition = { x: size - 1, y: size - 1}

        this._startVertex = new Vertex(this.startPosition.y, this.startPosition.x)
        this._goalVertex = new Vertex(this.goalPosition.y, this.goalPosition.x)

        this.matrix = Array(size);
        for (let q = 0; q < size; q++) {
            this.matrix[q] = Array(size);
        }
    }

    get startVertex(): Vertex {
        return this._startVertex
    }

    get goalVertex(): Vertex {
        return this._goalVertex
    }

    isAvailableMatrixValAt(position: Position): boolean {
        return this.matrix[position.y][position.x] !== null
    }

    updateStart(position: Position): void {
        if (!this.isAvailableMatrixValAt(position)) return;
        this.startPosition = position
    }

    updateGoal(position: Position): void {
        if (!this.isAvailableMatrixValAt(position)) return;
        this.goalPosition = position
    }

    addWall(position: Position): void {
        this.matrix[position.y][position.x] === null
            ? this.matrix[position.y].splice(position.x, 1)
            : this.matrix[position.y][position.x] = null
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

        this._startVertex = this.matrix[this.startPosition.y][this.startPosition.x] as Vertex
        this._goalVertex = this.matrix[this.goalPosition.y][this.goalPosition.x] as Vertex
    }
}

export class AStar {
    private readonly graph: Graph

    constructor(graph: Graph) {
        this.graph = graph
    }

    async search(map: HTMLTableElement): Promise<void> {

        const start = this.graph.startVertex
        const goal = this.graph.goalVertex

        start.gScore = 0;
        start.heuristicScore = this.heuristic(start, goal)
        start.updateCost()

        const openSet: Vertex[] = [start]
        const closedSet: Vertex[] = []

        while (openSet.length != 0) {
            openSet.sort((a, b) => a.fScore - b.fScore)

            const curVertex = openSet[0]
            const position = curVertex.position
            if (closedSet.includes(curVertex)) continue
            await animCell(map.rows[position.y].cells[position.x], ElementColors.chosenCell)

            if (curVertex == goal) {
                const path = []
                let current: Vertex | undefined = curVertex

                while (current != undefined) {
                    path.unshift(current)
                    current = current.parent
                }

                for (const vertex of path) {
                    await animCell(map.rows[vertex.position.y].cells[vertex.position.x], ElementColors.pathCell)
                }
                return
            }

            openSet.splice(openSet.indexOf(curVertex), 1)
            closedSet.push(curVertex)
            await animCell(map.rows[position.y].cells[position.x], ElementColors.exploredCell)

            for (const neighbor of curVertex.neighbors) {
                if (neighbor === null) continue;
                const position = neighbor.position
                if (closedSet.includes(neighbor)) {
                    continue;
                }

                const tempScore = curVertex.gScore + 1

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor)
                    await animCell(map.rows[position.y].cells[position.x], ElementColors.regardedCell)
                } else if (tempScore >= neighbor.gScore) continue;

                neighbor.gScore = tempScore
                neighbor.heuristicScore = this.heuristic(neighbor, goal)
                neighbor.updateCost()
                neighbor.parent = curVertex
            }
        }
    }

    private heuristic(vertex: Vertex, goal: Vertex): number {
        const dx = Math.abs(vertex.position.x - goal.position.x)
        const dy = Math.abs(vertex.position.y - goal.position.y)
        return dx + dy
    }
}
