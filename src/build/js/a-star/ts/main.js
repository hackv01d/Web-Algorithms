import { Map } from "./map.js";
import { Graph } from "./implementation/graph.js";
import { AStar } from "./implementation/astar.js";
import { updateOptBtnOnClick } from "./utils/buttonUtils.js";
import { selectStartButtonHandle, selectGoalButtonHandle, addWallButtonHandle, runButtonHandle, generateMapButtonHandle, resetMapButtonHandle, rangeSizeHandle, rangeSpeedHandle } from "./eventHandlers.js";
const elMap = document.querySelector('.matrix');
const resetMapButton = document.querySelector('.reset-map-btn');
const generateMapButton = document.querySelector('.generate-map-btn');
const selectStartButton = document.querySelector('.select-start-btn');
const selectGoalButton = document.querySelector('.select-goal-btn');
const runButton = document.querySelector('.run-btn');
const addWallButton = document.querySelector('.add-wall-btn');
export const allOptionButtons = Array.from(document.querySelectorAll('.setup-btn'));
const rangeSize = document.querySelector('#size');
const rangeSpeed = document.querySelector('#speed');
const labelSpeed = document.querySelector('#speed-label');
const sizeMap = rangeSize.valueAsNumber;
const speedAnim = rangeSpeed.valueAsNumber;
export const graph = new Graph(sizeMap);
export const aStar = new AStar(graph);
export const map = new Map(elMap, sizeMap, speedAnim);
selectStartButton.addEventListener('click', selectStartButtonHandle);
selectGoalButton.addEventListener('click', selectGoalButtonHandle);
resetMapButton.addEventListener('click', resetMapButtonHandle);
generateMapButton.addEventListener('click', generateMapButtonHandle);
runButton.addEventListener('click', () => runButtonHandle());
rangeSize.addEventListener('input', rangeSizeHandle);
rangeSpeed.addEventListener('input', (event) => {
    rangeSpeedHandle(event, labelSpeed);
});
addWallButton.addEventListener('click', addWallButtonHandle);
allOptionButtons.forEach(el => {
    el.addEventListener('click', (event) => {
        updateOptBtnOnClick(event, allOptionButtons);
    });
});
//# sourceMappingURL=main.js.map