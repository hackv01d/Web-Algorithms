import { map } from "./main.js";
import { Point } from "./types/point.js";
import { SearchCellType } from "./enums/searchCellType.js";

type NullableVertex = (Vertex | null)

class Vertex {
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

export class Graph {
    private _startVertex: Vertex
    private _goalVertex: Vertex

    private readonly size: number;
    private readonly matrix: NullableVertex[][];

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

    isAvailableAt(point: Point): boolean {
        return this.matrix[point.y][point.x] !== null
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

    updateStart(point: Point): void {
        if (!this.isAvailableAt(point)) return;
        this._startVertex.point = point
    }

    updateGoal(point: Point): void {
        if (!this.isAvailableAt(point)) return;
        this._goalVertex.point = point
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

export class AStar {
    private readonly graph: Graph

    constructor(graph: Graph) {
        this.graph = graph
    }

     async search(): Promise<void> {
         this.graph.build()

         const [start, goal] = this.initialConfig()
         const openSet: Vertex[] = [start]
         const closedSet: Vertex[] = []

         while (openSet.length !== 0) {
            openSet.sort((a, b) => a.fScore - b.fScore)

            const curVertex = openSet[0]
            const point = curVertex.point

            if (closedSet.includes(curVertex)) continue
            await map.updateCellAppearance(point, SearchCellType.chosenCell)

            if (curVertex === goal) {
                await this.reconstructPath(curVertex)
                break;
            }

            closedSet.push(curVertex)
            openSet.splice(openSet.indexOf(curVertex), 1)
            await map.updateCellAppearance(point, SearchCellType.exploredCell)

            for (const neighbor of curVertex.neighbors) {
                if (neighbor === null || closedSet.includes(neighbor)) continue;

                const point = neighbor.point
                const tempScore = curVertex.gScore + 1

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor)
                    await map.updateCellAppearance(point, SearchCellType.regardedCell)
                } else if (tempScore >= neighbor.gScore) continue;

                neighbor.gScore = tempScore
                neighbor.heuristicScore = this.heuristic(neighbor, goal)
                neighbor.updateCost()
                neighbor.parent = curVertex
            }
        }
         map.endShowingSearch()
    }

    private heuristic(vertex: Vertex, goal: Vertex): number {
        const dx = Math.abs(vertex.point.x - goal.point.x)
        const dy = Math.abs(vertex.point.y - goal.point.y)
        return dx + dy
    }

    private initialConfig(): [Vertex, Vertex] {
        const start = this.graph.startVertex
        const goal = this.graph.goalVertex

        start.gScore = 0
        start.heuristicScore = this.heuristic(start, goal)
        start.updateCost()

        return [start, goal]
    }

    private async reconstructPath(goal: Vertex): Promise<void> {
        const path: Vertex[] = []
        let current: Vertex | undefined = goal

        while (current !== undefined) {
            path.unshift(current)
            current = current.parent
        }

        for (const vertex of path) {
            await map.updateCellAppearance(vertex.point, SearchCellType.pathCell)
        }
    }
}
