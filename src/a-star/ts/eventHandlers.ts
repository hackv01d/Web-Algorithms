import { map } from "./main.js";
import { EditCellMode } from "./enums/editCellMode.js";

export function runButtonHandle(): void {
    map.beginShowingSearch()
}

export function generateMapButtonHandle(): void {
    map.generateMap()
}

export function addWallButtonHandle(): void {
    map.updateEditMapMode(EditCellMode.wall)
}

export function selectGoalButtonHandle(): void {
    map.updateEditMapMode(EditCellMode.goal)
}

export function selectStartButtonHandle(): void {
    map.updateEditMapMode(EditCellMode.start)
}

export function resetMapButtonHandle(): void {
    map.reset()
}
