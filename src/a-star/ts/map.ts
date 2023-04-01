import { graph } from "./main.js";
import { CellType } from "./enums/cellType.js";
import { EditMode } from "./enums/editMode.js";
import { Position } from "./types/position.js";
import { mapCellHandle } from "./eventHandlers.js";
import { removeAllClassesCell } from "./utils/cellUtils.js";

export class Map {
    private editMapMode?: EditMode
    private readonly size: number
    private readonly elementMap: HTMLTableElement

    constructor(elementMap: HTMLTableElement, size: number) {
        this.size = size
        this.elementMap = elementMap
    }

    updateEditMapMode(mode: EditMode): void {
        this.editMapMode = mode
    }

    setup(): void {
        for (let i = 0; i < this.size; i++) {
            const row = document.createElement('tr')
            this.elementMap.appendChild(row);

            for (let q = 0; q < this.size; q++) {
                const cell = document.createElement('td')

                cell.setAttribute('id', `${i}-${q}`)
                cell.classList.add('map-cell')
                cell.addEventListener('click', (event: MouseEvent) => {
                    mapCellHandle(event)
                })

                if (i == graph.startVertex.position.y && q == graph.startVertex.position.x) {
                    cell.classList.add('start-cell')
                } else if (i == graph.goalVertex.position.y && q == graph.goalVertex.position.x) {
                    cell.classList.add('goal-cell')
                }

                row.appendChild(cell);
            }
        }
    }

    update(cell: HTMLTableCellElement): void {
        const classList = cell.classList

        const location: Position = { x: Number(cell.id.split('-')[1]),
                                     y: Number(cell.id.split('-')[0]) }

        switch (this.editMapMode) {
            case EditMode.start:
                if (this.isUnavailableCellFor(CellType.start, classList)) return

                graph.updateStart(location)
                removeAllClassesCell(CellType.start, this.elementMap)

                classList.add('start-cell')
                break;

            case EditMode.goal:
                if (this.isUnavailableCellFor(CellType.goal, classList)) return

                graph.updateGoal(location)
                removeAllClassesCell(CellType.goal, this.elementMap)

                classList.add('goal-cell')
                break;

            case EditMode.wall:
                if (this.isUnavailableCellFor(CellType.wall, classList)) return

                graph.addWall(location)
                classList.contains(CellType.wall)
                    ? classList.remove(CellType.wall)
                    : classList.add(CellType.wall)
                break
        }
    }

    private isUnavailableCellFor(type: CellType, classList: DOMTokenList): boolean {
        switch (type) {
            case CellType.start:
                return (classList.contains(CellType.goal) || classList.contains(CellType.wall))
            case CellType.goal:
                return (classList.contains(CellType.start) || classList.contains(CellType.wall))
            case CellType.wall:
                return (classList.contains(CellType.start) || classList.contains(CellType.goal))
        }
    }
}