export function fillDistance(distancesGens, arrayGens, calculateDistance) {
    distancesGens = [];
    for (const element of arrayGens) {
        let temp = [];
        for (let j = 0; j < arrayGens.length; j++) {
            temp.push(calculateDistance(element, arrayGens[j]));
        }
        distancesGens.push(temp);
    }
    return distancesGens;
}
//# sourceMappingURL=fillDistance.js.map