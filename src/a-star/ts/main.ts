import { Map } from "./map.js";
import { Graph } from "./a-star.js";
import { AStar } from "./a-star.js";
import { updateOptBtnOnClick } from "./animation.js";
import { selectStartButtonHandle,
         selectGoalButtonHandle,
         addWallButtonHandle,
         runButtonHandle } from "./eventHandlers.js";

const elMap = document.querySelector('.matrix') as HTMLTableElement
const allOptionButtons = Array.from<HTMLButtonElement>(document.querySelectorAll('.setup-btn'))

const resetMapButton = document.querySelector('.reset-map-btn') as HTMLButtonElement
const generateMapButton = document.querySelector('.generate-map-btn') as HTMLButtonElement

const selectStartButton = document.querySelector('.select-start-btn') as HTMLButtonElement
const selectGoalButton = document.querySelector('.select-goal-btn') as HTMLButtonElement

const addWallButton = document.querySelector('.add-wall-btn') as HTMLButtonElement
const runButton = document.querySelector('.run-btn') as HTMLButtonElement

export const sizeMap = 12
export const map = new Map(elMap, sizeMap)
export const graph = new Graph(sizeMap)
export const aStar = new AStar(graph)

map.setup()

runButton.addEventListener('click', () => runButtonHandle(elMap))
selectStartButton.addEventListener('click', selectStartButtonHandle)
selectGoalButton.addEventListener('click', selectGoalButtonHandle)
addWallButton.addEventListener('click', addWallButtonHandle)

allOptionButtons.forEach(el => {
    el.addEventListener('click', (event: MouseEvent) => {
        updateOptBtnOnClick(event, allOptionButtons)
    })
})