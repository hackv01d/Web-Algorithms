import { Point } from "./types/point.js";
import { SetupCellType } from "./enums/setupCellType.js";
import { EditCellMode } from "./enums/editCellMode.js";
import { Direction } from "./enums/direction.js";
import { SearchCellType } from "./enums/searchCellType.js";
import { animBackgroundCell } from "./animation.js";
import { removeClassFromAllCells } from "./utils/cellUtils.js";
import { disableButtons,
         enableButtons } from "./utils/buttonUtils.js";
import { graph,
         aStar,
         allOptionButtons } from "./main.js";

export class Map {
    private editMapMode?: EditCellMode
    private readonly size: number
    private readonly elementMap: HTMLTableElement

    constructor(elementMap: HTMLTableElement, size: number) {
        this.size = size
        this.elementMap = elementMap
        this.setup()
    }

    endShowingSearch(): void {
        enableButtons(allOptionButtons)
    }

    beginShowingSearch(): void {
        disableButtons(allOptionButtons)
        aStar.search()
    }

    reset(): void {
        this.clear()
        graph.clearMatrix()
    }

    updateEditMapMode(mode: EditCellMode): void {
        this.editMapMode = mode
    }

    removeWallFromMap(point: Point, type: SetupCellType = SetupCellType.clear): void {
        this.elementMap.rows[point.y].cells[point.x].className = type
    }

    async updateCellAppearance(point: Point, color: SearchCellType): Promise<void> {
        const cell = this.elementMap.rows[point.y].cells[point.x]
        await animBackgroundCell(cell, color)
    }

    generateMap(): void {
        for (let i = 0; i < this.size; i++) {
            for (let q = 0; q < this.size; q++) {
                const cell = this.elementMap.rows[i].cells[q]

                cell.className = SetupCellType.wall
                graph.addWall({ x: q, y: i })
            }
        }

        const point: Point = { x: this.getRandomNum(this.size), y: this.getRandomNum(this.size)}
        graph.removeWall(point)
        this.removeWallFromMap(point)

        const walls: Point[] = []
        if (point.y - 2 >= 0) walls.push({ x: point.x, y: point.y - 2 })
        if (point.y + 2 < this.size) walls.push({ x: point.x, y: point.y + 2 })
        if (point.x - 2 >= 0) walls.push({ x: point.x - 2, y: point.y })
        if (point.x + 2 < this.size) walls.push({ x: point.x + 2, y: point.y })

        while (walls.length > 0) {
            const index = this.getRandomNum(walls.length)

            const cell: Point = walls[index]
            const x: number = cell.x
            const y: number = cell.y

            if (this.isAvailableCell(cell)) {
                walls.splice(index, 1)
                continue;
            }

            this.removeWallFromMap(cell)
            graph.removeWall(cell)
            walls.splice(index, 1)

            let directions: Direction[] = [Direction.up, Direction.down, Direction.left, Direction.right]
            while (directions.length > 0) {
                const index = this.getRandomNum(directions.length)

                switch (directions[index]) {
                    case Direction.up:
                        if (y - 2 >= 0 && this.isAvailableCell({ x: x, y: y - 2 })) {
                            graph.removeWall({ x: x, y: y - 1 })
                            this.removeWallFromMap({ x: x, y: y - 1 })
                            directions.splice(0, directions.length)
                        }
                        break

                    case Direction.down:
                        if (y + 2 < this.size && this.isAvailableCell({ x: x, y: y + 2 })) {
                            graph.removeWall({ x: x, y: y + 1})
                            this.removeWallFromMap({ x: x, y: y + 1})
                            directions.splice(0, directions.length)
                        }
                        break

                    case Direction.left:
                        if (x - 2 >= 0 && this.isAvailableCell({ x: x - 2, y: y })) {
                            graph.removeWall({ x: x - 1, y: y})
                            this.removeWallFromMap({ x: x - 1, y: y})
                            directions.splice(0, directions.length)
                        }
                        break

                    case Direction.right:
                        if (x + 2 < this.size && this.isAvailableCell({ x: x + 2, y: y })) {
                            graph.removeWall({ x: x + 1, y: y})
                            this.removeWallFromMap({ x: x + 1, y: y})
                            directions.splice(0, directions.length)

                        }
                        break
                }
                directions.splice(index, 1)
            }

            if (y - 2 >= 0 && !this.isAvailableCell({ x: x, y: y - 2 })) {
                walls.push({ x: x, y: y - 2 })
            }

            if (x + 2 < this.size && !this.isAvailableCell({ x: x + 2, y: y })) {
                walls.push({ x: x + 2, y: y })
            }

            if (y + 2 < this.size && !this.isAvailableCell({ x: x, y: y + 2 })) {
                walls.push({ x: x, y: y + 2 })
            }

            if (x - 2 >= 0 && !this.isAvailableCell({ x: x - 2, y: y })) {
                walls.push({ x: x - 2, y: y })
            }
        }

        this.removeWallFromMap(graph.startVertex.point, SetupCellType.start)
        this.removeWallFromMap(graph.goalVertex.point, SetupCellType.goal)

        graph.removeWallFromStart()
        graph.removeWallFromGoal()
    }

    private isAvailableCell(point: Point): boolean {
        return graph.isAvailableAt(point)
    }

    private getRandomNum(limit: number) : number {
        return Math.floor(Math.random() * limit)
    }

    private isUnavailableCellForEdit(type: SetupCellType, className: string): boolean {
        switch (type) {
            case SetupCellType.start:
                return (className === SetupCellType.goal || className === SetupCellType.wall)
            case SetupCellType.goal:
                return (className === SetupCellType.start || className === SetupCellType.wall)
            case SetupCellType.wall:
                return (className === SetupCellType.start || className === SetupCellType.goal)
            case SetupCellType.clear:
                return false
        }
    }

    private clear(): void {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.elementMap.rows[i].cells[j]

                if (j === graph.startVertex.point.x && i === graph.startVertex.point.y) {
                    cell.className = SetupCellType.start
                } else if (j === graph.goalVertex.point.x && i === graph.goalVertex.point.y) {
                    cell.className = SetupCellType.goal
                } else {
                    cell.className = SetupCellType.clear
                }
            }
        }
    }

    private setup(): void {
        this.elementMap.innerHTML = ""
        for (let i = 0; i < this.size; i++) {
            const row = document.createElement('tr')
            this.elementMap.appendChild(row);

            for (let q = 0; q < this.size; q++) {
                const cell = document.createElement('td')

                cell.setAttribute('id', `${i}-${q}`)
                cell.addEventListener('click', () => this.update(cell))

                if (i == graph.startVertex.point.y && q == graph.startVertex.point.x) {
                    cell.className = SetupCellType.start
                } else if (i == graph.goalVertex.point.y && q == graph.goalVertex.point.x) {
                    cell.className = SetupCellType.goal
                } else {
                    cell.className = SetupCellType.clear
                }

                row.appendChild(cell);
            }
        }
    }

    private update(cell: HTMLTableCellElement): void {
        let className = cell.className
        const location: Point = { x: Number(cell.id.split('-')[1]),
                                  y: Number(cell.id.split('-')[0]) }

        switch (this.editMapMode) {
            case EditCellMode.start:
                if (this.isUnavailableCellForEdit(SetupCellType.start, className)) return

                graph.updateStart(location)
                removeClassFromAllCells(SetupCellType.start, this.elementMap)

                cell.className = SetupCellType.start
                break;

            case EditCellMode.goal:
                if (this.isUnavailableCellForEdit(SetupCellType.goal, className)) return

                graph.updateGoal(location)
                removeClassFromAllCells(SetupCellType.goal, this.elementMap)

                cell.className = SetupCellType.goal
                break;

            case EditCellMode.wall:
                if (this.isUnavailableCellForEdit(SetupCellType.wall, className)) return

                graph.toggleWall(location)
                className === SetupCellType.wall
                    ? cell.className = SetupCellType.clear
                    : cell.className = SetupCellType.wall
                break
        }
    }
}