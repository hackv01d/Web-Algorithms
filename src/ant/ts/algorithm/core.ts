import { Canvas } from "../canvas.js";
import { countSendAnts, Q, remainFeromon, beta, alfa } from "../main.js";
import { count, points } from "../points.js";
import { fillWeight, fillFeromon } from "./datastart.js";


let canvas = new Canvas('canvasAnt', 'container-canvas');


function printPath(arrayNum: number[]) {
    for (let i = 0; i < count - 1; i++) {
        canvas.drawPath(points[arrayNum[i]], points[arrayNum[i + 1]]);
    }
    canvas.drawPath(points[arrayNum[0]], points[arrayNum[arrayNum.length - 1]]);
}


export function calculateDistance(pointFirst: { x: number; y: number }, pointSecond: { x: number; y: number }) {
    return Math.sqrt(Math.pow(pointFirst.x - pointSecond.x, 2) + Math.pow(pointFirst.y - pointSecond.y, 2));
}
  

function getFreePoints(currentPoint: number): boolean[] {
    return Array(count).fill(true).map((value, index) => index !== currentPoint ? value : false);
}


function choiceNextPoint(arrayWeights: number[][], arrayFeromons: number[][], needPoint: boolean[], currentPoint: number): number {
    let desireSum: number = 0, i: number;
  
    const desireToMove = needPoint.map((available, index) => {
        if (available) {
            const desire = Math.pow(200 / arrayWeights[currentPoint][index], beta) * Math.pow(arrayFeromons[currentPoint][index], alfa);
            desireSum += desire;
            return desire;
        } else {
            return 0;
        }
    });
  
    const probabilityToMove = desireToMove.reduce((arr, desire) => {
        const lastProbability = arr[arr.length - 1] || 0;
        const probability = lastProbability + desire / desireSum;
        arr.push(probability);
        return arr;
    }, []);
  
    const randomValue = Math.random();
    probabilityToMove.forEach((probability, index) => {
        if (i === undefined && randomValue <= probability) {
            i = index;
        }
    });
  
    return i;
}


function upFeromon(arrayFeromons: number[][], path: number[]) {
    const delta: number = Q / path[path.length - 1];
    const newFeromons = [...arrayFeromons];
    for (let i: number = 0; i < path.length - 2; i++) {
    newFeromons[i][i + 1] += delta;
    newFeromons[i + 1][i] = newFeromons[i][i + 1];
    }
    
    newFeromons[path[0]][path[path.length - 2]] += delta;
    newFeromons[path[path.length - 2]][path[0]] = newFeromons[path[0]][path[path.length - 2]];
    return newFeromons;
}


function downFeromon(arrayFeromons: number[][]) {
    return arrayFeromons.map(row => [...row.map(pheromone => pheromone * remainFeromon)]);
}


export async function antAlgorithm(): Promise<number[]> {
    let arrayWeights: number[][] = fillWeight();
    let arrayFeromons: number[][] = fillFeromon();
    let lenMinPath: number = Infinity;
    let minPath: number[] = [];
    
    for (let x: number = 0; x < countSendAnts; x++) {
        let everyPath: number[][] = [];
        for (let j: number = 0; j < count; j++) {
            let availablePoints: boolean[] = getFreePoints(j);
            let currentPath: number[] = [];
            let lenCurrentPath: number = 0;
            currentPath.push(j);
 
            for (let i: number = 0; i < count - 1; i++) {
                let newPoint: number = choiceNextPoint(arrayWeights, arrayFeromons, availablePoints, currentPath[i]);
                currentPath.push(newPoint);
                availablePoints[newPoint] = false;
                lenCurrentPath += calculateDistance(points[currentPath[currentPath.length - 2]], points[currentPath[currentPath.length - 1]]);
            }
 
            lenCurrentPath += calculateDistance(points[currentPath[0]], points[currentPath[currentPath.length - 1]]);
            if (lenCurrentPath < lenMinPath) {
                lenMinPath = lenCurrentPath;
                minPath = currentPath;
                canvas.clearField();
                canvas.retakePoints(points);
                printPath(minPath);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            currentPath.push(lenCurrentPath);
            everyPath.push(currentPath);
        }

        arrayFeromons = downFeromon(arrayFeromons);
        for (const element of everyPath) {
            arrayFeromons = upFeromon(arrayFeromons, element);
        }
    }
 
    return minPath;
}
