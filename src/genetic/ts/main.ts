interface Point {
    x: number,
    y: number
}

let minWayPoints: number[] = [];
let minWayNumber: number = Infinity;
let distancesGens: number[][] = [];
let generation: number[][] = [];
let percentMutation: number = 0.25;
let populationSize: number = 400; // 400 1000
let countGeneration: number = 400; // 400 30000
let work: boolean = false;
let arrayPoints: {x: number, y: number}[] = [];
let arrayGens: Point[] = [];
let chromosome: number[];
 
let canvas = document.getElementById('canvasGenetic') as HTMLCanvasElement;
let context = canvas.getContext('2d')!;
let width = context.canvas.width;
let height = context.canvas.height;
let container = document.getElementById('container-canvas')!;


function clearField(): void {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}
 
 
function changeSize(): void {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    width = context.canvas.width;
    height = context.canvas.height;
}
 
 
function drawPoint(point: {x: number, y: number}): void {
    context.beginPath();
    context.arc(point.x + 2, point.y + 3, 8, 0, 2 * Math.PI);
    context.fillStyle = "orange";
    context.fill();
}


function drawLine(array: number[]): void {
    for (let i = 0; i < array.length; i++) {
        context.lineTo(arrayPoints[array[i]].x, arrayPoints[array[i]].y);
    }
}
 
 
function drawWay(array: number[]): void {
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.moveTo(arrayPoints[array[0]].x, arrayPoints[array[0]].y);
    drawLine(array);
    context.lineTo(arrayPoints[array[0]].x, arrayPoints[array[0]].y);
    context.stroke();
}


function fillDistance(): void {
    distancesGens = [];
    for (let i = 0; i < arrayGens.length; i++) {
        let temp: number[] = [];
        for (let j = 0; j < arrayGens.length; j++) {
            temp.push(calculateDistance(arrayGens[i], arrayGens[j]));
        }
        distancesGens.push(temp);
    }
}


// перестановка родителей в случайном порядке
function randomChangePlace(oldPlacement: Array<any>): Array<any> {
    let newPlacement = Array.from(oldPlacement);
    for (let index = newPlacement.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const temp = newPlacement[index];
        newPlacement[index] = newPlacement[randomIndex];
        newPlacement[randomIndex] = temp;
    }
    return newPlacement;
}


// первый половину отдает первому ребенку, второй отдает вторую половину уникальную
function rebirth(): void {
    generation = randomChangePlace(generation);
    let divide = Math.ceil(generation[0].length / 2);
    for (let i = 0; i < generation.length; i += 2) {
        const [firstParent, secondParent] = generation.splice(-2);
        const firstChild = firstParent.slice(0, divide + 1);
        const secondChild = secondParent.slice(0, divide + 1);
        firstParent.forEach((gene: any) => {
            if (!secondChild.includes(gene)) secondChild.push(gene);
        });
        secondParent.forEach((gene: any) => {
            if (!firstChild.includes(gene)) firstChild.push(gene);
        });
        [firstChild, secondChild].forEach(getDistance);
        generation.push(firstChild, secondChild);
    }
}


// вычисление дистанции конкретного пути
function getDistance(array: number[]): number {
    return array.reduce((acc, cur, idx) => {
        if (idx > 0) {
            acc += distancesGens[array[idx - 1]][cur];
        }
        return acc;
    }, distancesGens[array[array.length - 1]][array[0]]);
}


function fillFirstGeneration() {
    generation = [];
    generation.push(chromosome);
    for (let i = 0; i < populationSize - 1; i++) {
        generation.push(randomChangePlace(chromosome));
    }
}


function retakePoints(array: Array<any>): void {
    for (let i: number = 0; i < array.length; i++) {
        drawPoint(array[i]);
    }
}


function swap(array: Array<number>, firstIndex: number, secondIndex: number): void {
    let temp: number = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
}


function inverseMutation(array: Array<number>, firstIndex: number, secondIndex: number): void {
    let i: number = firstIndex;
    let j: number = secondIndex;
    while (i <= j) {
        let temp: number = array[i];
        array[i] = array[j];
        array[j] = temp;
        i++;
        j--;
    }
}


// проходим половину массива генов, начиная от начала и до выбранного индекса и 
// меняем местами соответствующие гены с их зеркальными относительно выбранного индекса парами.
function fixedInverseMutation(array: Array<number>, firstIndex: number): void {
    for (let i: number = 0; i < Math.floor(array.length / 2); i++) {
        if (i < firstIndex) {
            let temp: number = array[i];
            array[i] = array[firstIndex - i];
            array[firstIndex - i] = temp;
        } 
        else {
            break;
        }
    }
}


// мутация: две случайные позиции в хромосоме и меняются местами все элементы между ними включительно. 
function mixingMutation(array: Array<number>, firstIndex: number, secondIndex: number): void {
    let index: number = secondIndex;
    let random: number;
    while (index !== firstIndex) {
        random = firstIndex + Math.floor(Math.random() * (index - firstIndex));
        index--;
        let temp: number = array[index];
        array[index] = array[random];
        array[random] = temp;
    }
}


function buildMutations(): void {
    for (const element of generation) {
        if (Math.random() <= percentMutation) {
            let firstIndex = -1, secondIndex = -1;
            while ((secondIndex === firstIndex)) {
                firstIndex = Math.floor(Math.random() * element.length)
                secondIndex = Math.floor(Math.random() * element.length)
            }
            if (firstIndex > secondIndex) {
                let temp = secondIndex;
                secondIndex = firstIndex;
                firstIndex = temp;
            }
            switch (Math.floor(Math.random() * 4)) {
                case 0:
                    mixingMutation(element, firstIndex, secondIndex);
                    break;
                case 1:
                    fixedInverseMutation(element, firstIndex);
                    break;
                case 2:
                    inverseMutation(element, firstIndex, secondIndex);
                    break;
                case 3:
                    swap(element, firstIndex, secondIndex);
                    break;
                default:
                    break;
            }
        }
    }
}


// выбор лучших хромосом из текущей популяции и обрезать до populationSize
function takeBestChromosome(): void {
    const sortedGeneration = generation.sort((a, b) => getDistance(a) - getDistance(b));
    generation = sortedGeneration.slice(0, populationSize);
}


function geneticAlgorithm(): void {
    let iteration = 0;
    while (iteration <= countGeneration) {
        rebirth();
        buildMutations();
        takeBestChromosome();
        let bestPopulationDistance = getDistance(generation[0]);
        if (bestPopulationDistance < minWayNumber) {
            minWayPoints = generation[0];
            minWayNumber = bestPopulationDistance;
            clearField();
            drawWay(minWayPoints);
            retakePoints(arrayPoints);
        }
        iteration++;
    }
    console.log(minWayNumber);
}
 

function calculateDistance(pointFirst: Point, pointSecond: Point): number {
    return Math.sqrt(Math.pow(pointFirst.x - pointSecond.x, 2) +
        Math.pow(pointFirst.y - pointSecond.y, 2));
}


function handlerPoint(place: MouseEvent, canvas: HTMLCanvasElement) {
    let x: number = place.offsetX;
    let y: number = place.offsetY;
    arrayPoints.push({ x, y });
    drawPoint({ x, y });
}


canvas.addEventListener('mousedown', function (event: MouseEvent) {
    handlerPoint(event, canvas);
});


window.addEventListener('resize', function () {
    changeSize();
    clearEvery();
}, false);

window.onload = changeSize.bind(canvas);


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


function prepareData() {
    arrayGens = arrayPoints;
    minWayNumber = Infinity;
    // номера путевых точек, которые нужно посетить
    chromosome = Array.from(Array(arrayGens.length).keys());
    fillDistance();
    fillFirstGeneration();
    geneticAlgorithm();
}


function launchGeneticAlgorithm() {
    if (arrayPoints.length === 0) {
        return;
    }
    if (work) {
        clearField();
        retakePoints(arrayPoints);
    } else {
        work = true;
    }
    prepareData();
}


function clearEvery() {
    document.getElementById('Build').textContent = "Build"
    work = false;
    arrayPoints = [];
    clearField();
}
