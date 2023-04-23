import { map } from "../main.js";
import { SearchCellType } from "../enums/searchCellType.js";
export class AStar {
    constructor(graph) {
        this.graph = graph;
    }
    async search() {
        this.graph.build();
        const [start, goal] = this.initialConfig();
        const openSet = [start];
        const closedSet = [];
        let isPathFound = false;
        while (openSet.length !== 0) {
            openSet.sort((a, b) => a.fScore - b.fScore);
            const curVertex = openSet[0];
            const point = curVertex.point;
            if (closedSet.includes(curVertex))
                continue;
            await map.updateCellAppearance(point, SearchCellType.chosenCell);
            if (curVertex === goal) {
                await this.reconstructPath(curVertex);
                isPathFound = true;
                break;
            }
            closedSet.push(curVertex);
            openSet.splice(openSet.indexOf(curVertex), 1);
            await map.updateCellAppearance(point, SearchCellType.exploredCell);
            for (const neighbor of curVertex.neighbors) {
                if (neighbor === null || closedSet.includes(neighbor))
                    continue;
                const point = neighbor.point;
                const tempScore = curVertex.gScore + 1;
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                    await map.updateCellAppearance(point, SearchCellType.regardedCell);
                }
                else if (tempScore >= neighbor.gScore)
                    continue;
                neighbor.gScore = tempScore;
                neighbor.heuristicScore = this.heuristic(neighbor, goal);
                neighbor.updateCost();
                neighbor.parent = curVertex;
            }
        }
        map.endShowingSearch();
        if (!isPathFound)
            alert("Не удалось найти путь");
    }
    heuristic(vertex, goal) {
        const dx = Math.abs(vertex.point.x - goal.point.x);
        const dy = Math.abs(vertex.point.y - goal.point.y);
        return dx + dy;
    }
    initialConfig() {
        const start = this.graph.startVertex;
        const goal = this.graph.goalVertex;
        start.gScore = 0;
        start.heuristicScore = this.heuristic(start, goal);
        start.updateCost();
        return [start, goal];
    }
    async reconstructPath(goal) {
        const path = [];
        let current = goal;
        while (current !== undefined) {
            path.unshift(current);
            current = current.parent;
        }
        for (const vertex of path) {
            await map.updateCellAppearance(vertex.point, SearchCellType.pathCell);
        }
    }
}
//# sourceMappingURL=astar.js.map