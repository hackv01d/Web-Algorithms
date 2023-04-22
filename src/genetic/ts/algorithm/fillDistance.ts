import { Point } from "../types/point.js";


export function fillDistance(distancesGens: number[][], arrayGens: Point[], calculateDistance): number[][] {
    distancesGens = [];
    for (const element of arrayGens) {
        let temp: number[] = [];
        for (let j = 0; j < arrayGens.length; j++) {
            temp.push(calculateDistance(element, arrayGens[j]));
        }
        distancesGens.push(temp);
    }
    return distancesGens;
}
