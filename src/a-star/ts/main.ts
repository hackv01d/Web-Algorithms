import { Map } from "./map.js";
import { Graph } from "./a-star.js";
import { AStar } from "./a-star.js";
import { updateOptBtnOnClick } from "./utils/buttonUtils.js";
import {
    selectStartButtonHandle,
    selectGoalButtonHandle,
    addWallButtonHandle,
    runButtonHandle,
    generateMapButtonHandle,
    resetMapButtonHandle } from "./eventHandlers.js";

const elMap = document.querySelector('.matrix') as HTMLTableElement

const resetMapButton = document.querySelector('.reset-map-btn') as HTMLButtonElement
const generateMapButton = document.querySelector('.generate-map-btn') as HTMLButtonElement

const selectStartButton = document.querySelector('.select-start-btn') as HTMLButtonElement
const selectGoalButton = document.querySelector('.select-goal-btn') as HTMLButtonElement

const runButton = document.querySelector('.run-btn') as HTMLButtonElement
const addWallButton = document.querySelector('.add-wall-btn') as HTMLButtonElement
export const allOptionButtons = Array.from<HTMLButtonElement>(document.querySelectorAll('.setup-btn'))

export const sizeMap = 18
export const graph = new Graph(sizeMap)
export const aStar = new AStar(graph)
export const map = new Map(elMap, sizeMap)

resetMapButton.addEventListener('click', resetMapButtonHandle)
generateMapButton.addEventListener('click', generateMapButtonHandle)
runButton.addEventListener('click', () => runButtonHandle())

selectStartButton.addEventListener('click', selectStartButtonHandle)
selectGoalButton.addEventListener('click', selectGoalButtonHandle)

addWallButton.addEventListener('click', addWallButtonHandle)
allOptionButtons.forEach(el => {
    el.addEventListener('click', (event: MouseEvent) => {
        updateOptBtnOnClick(event, allOptionButtons)
    })
})