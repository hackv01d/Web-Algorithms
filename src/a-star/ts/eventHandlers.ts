import { map } from "./main.js";
import { EditCellMode } from "./enums/editCellMode.js";
import { updateSpeedLabel } from "./utils/labelUtil.js";

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

export function rangeSizeHandle(e: Event): void {
    const target = e.target as HTMLInputElement
    map.updateSize(target.valueAsNumber)
}

export function rangeSpeedHandle(e: Event, label: HTMLLabelElement): void {
    const target = e.target as HTMLInputElement

    updateSpeedLabel(target, label)
    map.updateSpeedAnim(target.valueAsNumber)
}
