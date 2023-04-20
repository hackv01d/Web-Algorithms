import { map } from "../main.js";
import { Graph } from "./graph.js";
import { Vertex } from "./vertex.js";
import { SearchCellType } from "../enums/searchCellType.js";

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
        let isPathFound: boolean = false

        while (openSet.length !== 0) {
            openSet.sort((a, b) => a.fScore - b.fScore)

            const curVertex = openSet[0]
            const point = curVertex.point

            if (closedSet.includes(curVertex)) continue
            await map.updateCellAppearance(point, SearchCellType.chosenCell)

            if (curVertex === goal) {
                await this.reconstructPath(curVertex)
                isPathFound = true
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
        if (!isPathFound) alert("Не удалось найти путь")
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