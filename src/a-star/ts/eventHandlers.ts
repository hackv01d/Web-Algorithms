import { map } from "./main.js";
import { graph } from "./main.js";
import { aStar }  from "./main.js";
import { EditMode } from "./enums/editMode.js";

export function addWallButtonHandle(): void {
    map.updateEditMapMode(EditMode.wall)
}

export function selectGoalButtonHandle(): void {
    map.updateEditMapMode(EditMode.goal)
}

export function selectStartButtonHandle(): void {
    map.updateEditMapMode(EditMode.start)
}

export function mapCellHandle(event: MouseEvent): void {
    const cell = event.target as HTMLTableCellElement
    map.update(cell)
}

export function runButtonHandle(map: HTMLTableElement): void {
    graph.build()
    aStar.search(map)
}
