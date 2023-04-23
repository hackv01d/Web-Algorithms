import { map } from "./main.js";
import { EditCellMode } from "./enums/editCellMode.js";
import { updateSpeedLabel } from "./utils/labelUtil.js";
export function runButtonHandle() {
    map.beginShowingSearch();
}
export function generateMapButtonHandle() {
    map.generateMap();
}
export function addWallButtonHandle() {
    map.updateEditMapMode(EditCellMode.wall);
}
export function selectGoalButtonHandle() {
    map.updateEditMapMode(EditCellMode.goal);
}
export function selectStartButtonHandle() {
    map.updateEditMapMode(EditCellMode.start);
}
export function resetMapButtonHandle() {
    map.reset();
}
export function rangeSizeHandle(e) {
    const target = e.target;
    map.updateSize(target.valueAsNumber);
}
export function rangeSpeedHandle(e, label) {
    const target = e.target;
    updateSpeedLabel(target, label);
    map.updateSpeedAnim(target.valueAsNumber);
}
//# sourceMappingURL=eventHandlers.js.map