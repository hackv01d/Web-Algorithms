import { Point } from "../types/point.js";
import { fillDistance } from "./fillDistance.js";
import { buildMutations } from "./mutations.js";
import { populationSize, percentMutation, countGeneration, arrayPoints, solve} from "../main.js";


let minWayPoints: number[] = [];
let minWayNumber: number = Infinity;
let distancesGens: number[][] = [];
let generation: number[][] = [];
let arrayGens: Point[] = [];
let chromosome: number[];


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
    generation = randomChangePlace([...generation]);
    let divide = Math.ceil(generation[0].length / 2);
    for (let i = 0; i < generation.length; i += 2) {
        const [firstParent, secondParent] = generation.splice(-2);
        const firstChild = [...firstParent.slice(0, divide + 1)];
        const secondChild = [...secondParent.slice(0, divide + 1)];
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


// выбор лучших хромосом из текущей популяции и обрезать до populationSize
function takeBestChromosome(): void {
    const sortedGeneration = [...generation].sort((a, b) => getDistance(a) - getDistance(b));
    generation = [...sortedGeneration.slice(0, populationSize)];
}


function getNewBestChromosome() {
    rebirth();
    buildMutations(generation, percentMutation);
    takeBestChromosome();
}


async function geneticAlgorithm(): Promise<void> {
    let iteration = 0;
    while (iteration <= countGeneration) {
        getNewBestChromosome();
        let bestPopulationDistance = getDistance(generation[0]);
        if (bestPopulationDistance < minWayNumber) {
            minWayPoints = generation[0];
            minWayNumber = bestPopulationDistance;
            solve.clearField();
            solve.drawWay(minWayPoints, arrayPoints);
            solve.retakePoints(arrayPoints);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        iteration++;
    }
}
 

function calculateDistance(pointFirst: Point, pointSecond: Point): number {
    return Math.sqrt(Math.pow(pointFirst.x - pointSecond.x, 2) +
        Math.pow(pointFirst.y - pointSecond.y, 2));
}


export function prepareData() {
    arrayGens = arrayPoints;
    minWayNumber = Infinity;
    // номера путевых точек, которые нужно посетить
    chromosome = Array.from(Array(arrayGens.length).keys());
    distancesGens = fillDistance(distancesGens, arrayGens, calculateDistance);
    fillFirstGeneration();
    geneticAlgorithm();
}
