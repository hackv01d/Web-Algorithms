import { calculateDistance } from './core.js';
import { points, count } from '../points.js';
let initFeromon = 0.8; // начальный феромон на рёбрах
export function fillWeight() {
    let array = [];
    for (let i = 0; i < count; i++) {
        let row = [];
        for (let j = 0; j < count; j++) {
            row.push(calculateDistance(points[i], points[j]));
        }
        array.push(row);
    }
    return array;
}
export function fillFeromon() {
    let array = [];
    for (let i = 0; i < count; i++) {
        let row = [];
        for (let j = 0; j < count; j++) {
            (i !== j) ? row.push(initFeromon) : row.push(0);
        }
        array.push(row);
    }
    return array;
}
//# sourceMappingURL=datastart.js.map