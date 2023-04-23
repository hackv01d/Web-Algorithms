import { Canvas } from "./canvas.js";
import { prepareData } from "./algorithm/initial.js";
export let arrayPoints = [];
export let percentMutation = 0.25;
export let populationSize = 400; // 400 1000
export let countGeneration = 400; // 400 30000
export let work = false;
export let solve = new Canvas('canvasGenetic', 'container-canvas');
function changeSize() {
    solve.canvas.width = window.innerWidth * 0.6;
    solve.canvas.height = window.innerHeight * 0.6;
    solve.width = window.innerWidth * 0.6;
    solve.height = window.innerHeight * 0.6;
}
function handlerPoint(place) {
    let x = place.offsetX;
    let y = place.offsetY;
    arrayPoints.push({ x, y });
    solve.drawPoint({ x, y });
}
solve.canvas.addEventListener('mousedown', function (event) {
    handlerPoint(event);
});
window.addEventListener('resize', function () {
    changeSize();
    clearEvery();
}, false);
window.onload = changeSize.bind(solve.canvas);
function isValidPopulationSize(value) {
    if (value >= 1 && value <= 1000) {
        populationSize = value;
    }
}
function isValidCountGeneration(value) {
    if (value >= 1 && value <= 30000) {
        countGeneration = value;
    }
}
function isValidPercentMutation(value) {
    if (value >= 1 && value <= 100) {
        percentMutation = value / 100;
    }
}
function launchGeneticAlgorithm() {
    if (arrayPoints.length === 0) {
        return;
    }
    if (work) {
        solve.clearField();
        solve.retakePoints(arrayPoints);
    }
    else {
        work = true;
    }
    prepareData();
}
function clearEvery() {
    work = false;
    arrayPoints = [];
    solve.clearField();
}
document.getElementById('Build').addEventListener('click', launchGeneticAlgorithm);
document.getElementById('Clear').addEventListener('click', clearEvery);
const generationSizeDiapason = document.getElementById("generationSizeDiapason");
generationSizeDiapason.addEventListener("input", () => {
    isValidCountGeneration(generationSizeDiapason.valueAsNumber);
});
const populationSizeDiapason = document.getElementById("populationSizeDiapason");
populationSizeDiapason.addEventListener("input", () => {
    isValidPopulationSize(populationSizeDiapason.valueAsNumber);
});
const mutationPercentDiapason = document.getElementById("mutationPercentDiapason");
mutationPercentDiapason.addEventListener("input", () => {
    isValidPercentMutation(mutationPercentDiapason.valueAsNumber);
});
//# sourceMappingURL=main.js.map