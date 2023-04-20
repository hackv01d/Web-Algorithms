import { Map } from "./map.js";
import { Graph } from "./implementation/graph.js";
import { AStar } from "./implementation/astar.js";
import { updateOptBtnOnClick } from "./utils/buttonUtils.js";
import {
    selectStartButtonHandle,
    selectGoalButtonHandle,
    addWallButtonHandle,
    runButtonHandle,
    generateMapButtonHandle,
    resetMapButtonHandle,
    rangeSizeHandle,
    rangeSpeedHandle } from "./eventHandlers.js";

const elMap = document.querySelector('.matrix') as HTMLTableElement

const resetMapButton = document.querySelector('.reset-map-btn') as HTMLButtonElement
const generateMapButton = document.querySelector('.generate-map-btn') as HTMLButtonElement

const selectStartButton = document.querySelector('.select-start-btn') as HTMLButtonElement
const selectGoalButton = document.querySelector('.select-goal-btn') as HTMLButtonElement

const runButton = document.querySelector('.run-btn') as HTMLButtonElement
const addWallButton = document.querySelector('.add-wall-btn') as HTMLButtonElement
export const allOptionButtons = Array.from<HTMLButtonElement>(document.querySelectorAll('.setup-btn'))

const rangeSize = document.querySelector('#size') as HTMLInputElement
const rangeSpeed = document.querySelector('#speed') as HTMLInputElement
const labelSpeed = document.querySelector('#speed-label') as HTMLLabelElement

const sizeMap: number = rangeSize.valueAsNumber
const speedAnim: number = rangeSpeed.valueAsNumber

export const graph: Graph = new Graph(sizeMap)
export const aStar: AStar = new AStar(graph)
export const map: Map = new Map(elMap, sizeMap, speedAnim)

selectStartButton.addEventListener('click', selectStartButtonHandle)
selectGoalButton.addEventListener('click', selectGoalButtonHandle)

resetMapButton.addEventListener('click', resetMapButtonHandle)
generateMapButton.addEventListener('click', generateMapButtonHandle)
runButton.addEventListener('click', () => runButtonHandle())

rangeSize.addEventListener('input', rangeSizeHandle)
rangeSpeed.addEventListener('input', (event) => {
    rangeSpeedHandle(event, labelSpeed)
})

addWallButton.addEventListener('click', addWallButtonHandle)
allOptionButtons.forEach(el => {
    el.addEventListener('click', (event: MouseEvent) => {
        updateOptBtnOnClick(event, allOptionButtons)
    })
})