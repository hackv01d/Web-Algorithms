import { Point } from "./types/point.js";
import { Canvas } from "./canvas.js";
import { prepareData } from "./algorithm/initial.js";


export let arrayPoints: Point[] = [];
export let percentMutation: number = 0.25;
export let populationSize: number = 400; // 400 1000
export let countGeneration: number = 400; // 400 30000
export let work: boolean = false;
export let solve = new Canvas('canvasGenetic', 'container-canvas');


function changeSize(): void {
    solve.canvas.width = solve.container.offsetWidth;
    solve.canvas.height = solve.container.offsetHeight;
    solve.width = solve.context.canvas.width;
    solve.height = solve.context.canvas.height;
}


function handlerPoint(place: MouseEvent) {
    let x: number = place.offsetX;
    let y: number = place.offsetY;
    arrayPoints.push({ x, y });
    solve.drawPoint({ x, y });
}


solve.canvas.addEventListener('mousedown', function (event: MouseEvent) {
    handlerPoint(event);
});

window.addEventListener('resize', function () {
    changeSize();
    clearEvery();
}, false);

window.onload = changeSize.bind(solve.canvas);


function isValidPopulationSize(value: number) {
    if (value >= 1 && value <= 1000) {
        populationSize = value;
    }
}


function isValidCountGeneration(value: number) {
    if (value >= 1 && value <= 30000) {
        countGeneration = value;
    }
}


function isValidPercentMutation(value: number) {
    if (value >= 1 && value <= 100) {
        percentMutation = value / 100;
    }
}


function changeValue(id: string) {
    let element = document.getElementById(`${id}Diapason`) as HTMLInputElement;
    let countElement = document.getElementById(`${id}Count`);
    countElement.textContent = countElement.textContent.replace(/\d+/, `${element.value}`);
    switch (id) {
        case 'populationSize':
            isValidPopulationSize(parseInt(element.value, 10));
            break;
        case 'generationSize':
            isValidCountGeneration(parseInt(element.value, 10));
            break;
        case 'mutationPercent':
            isValidPercentMutation(parseInt(element.value, 10));
            break;
    }
}


function launchGeneticAlgorithm() {
    if (arrayPoints.length === 0) {
        return;
    }
    if (work) {
        solve.clearField();
        solve.retakePoints(arrayPoints);
    } else {
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


const generationSizeInput = document.getElementById('generationSizeDiapason') as HTMLInputElement;
generationSizeInput.addEventListener('input', () => {
    changeValue('generationSize');
});


const populationSizeInput = document.getElementById('populationSizeDiapason') as HTMLInputElement;
populationSizeInput.addEventListener('input', () => {
    changeValue('populationSize');
});


const mutationPercentInput = document.getElementById('mutationPercentDiapason') as HTMLInputElement;
mutationPercentInput.addEventListener('input', () => {
    changeValue('mutationPercent');
});
