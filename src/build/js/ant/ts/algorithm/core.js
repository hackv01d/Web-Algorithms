import { Canvas } from "../canvas.js";
import { countSendAnts, Q, remainFeromon, beta, alfa } from "../main.js";
import { count, points } from "../points.js";
import { fillWeight, fillFeromon } from "./datastart.js";
let canvas = new Canvas('canvasAnt', 'container-canvas');
function printPath(arrayNum) {
    for (let i = 0; i < count - 1; i++) {
        canvas.drawPath(points[arrayNum[i]], points[arrayNum[i + 1]]);
    }
    canvas.drawPath(points[arrayNum[0]], points[arrayNum[arrayNum.length - 1]]);
}
export function calculateDistance(pointFirst, pointSecond) {
    return Math.sqrt(Math.pow(pointFirst.x - pointSecond.x, 2) + Math.pow(pointFirst.y - pointSecond.y, 2));
}
function getFreePoints(currentPoint) {
    return Array(count).fill(true).map((value, index) => index !== currentPoint ? value : false);
}
function choiceNextPoint(arrayWeights, arrayFeromons, needPoint, currentPoint) {
    let desireSum = 0, i;
    const desireToMove = needPoint.map((available, index) => {
        if (available) {
            const desire = Math.pow(200 / arrayWeights[currentPoint][index], beta) * Math.pow(arrayFeromons[currentPoint][index], alfa);
            desireSum += desire;
            return desire;
        }
        else {
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
function upFeromon(arrayFeromons, path) {
    const delta = Q / path[path.length - 1];
    const newFeromons = [...arrayFeromons];
    for (let i = 0; i < path.length - 2; i++) {
        newFeromons[i][i + 1] += delta;
        newFeromons[i + 1][i] = newFeromons[i][i + 1];
    }
    newFeromons[path[0]][path[path.length - 2]] += delta;
    newFeromons[path[path.length - 2]][path[0]] = newFeromons[path[0]][path[path.length - 2]];
    return newFeromons;
}
function downFeromon(arrayFeromons) {
    return arrayFeromons.map(row => [...row.map(pheromone => pheromone * remainFeromon)]);
}
export async function antAlgorithm() {
    let arrayWeights = fillWeight();
    let arrayFeromons = fillFeromon();
    let lenMinPath = Infinity;
    let minPath = [];
    for (let x = 0; x < countSendAnts; x++) {
        let everyPath = [];
        for (let j = 0; j < count; j++) {
            let availablePoints = getFreePoints(j);
            let currentPath = [];
            let lenCurrentPath = 0;
            currentPath.push(j);
            for (let i = 0; i < count - 1; i++) {
                let newPoint = choiceNextPoint(arrayWeights, arrayFeromons, availablePoints, currentPath[i]);
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
//# sourceMappingURL=core.js.map