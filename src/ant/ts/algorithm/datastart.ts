import { calculateDistance } from './core.js';
import { points, count } from '../points.js';


let initFeromon: number = 0.8; // начальный феромон на рёбрах


export function fillWeight(): number[][] {
    let array: number[][] = [];
    for (let i = 0; i < count; i++) {
        let row: number[] = [];
        for (let j = 0; j < count; j++) {
            row.push(calculateDistance(points[i], points[j]));
        }
        array.push(row);
    }
    return array;
}
  

export function fillFeromon(): number[][] {
    let array: number[][] = [];
    for (let i = 0; i < count; i++) {
        let row: number[] = [];
        for (let j = 0; j < count; j++) {
          (i !== j) ? row.push(initFeromon) : row.push(0);
        }
        array.push(row);
    }
    return array;
}
