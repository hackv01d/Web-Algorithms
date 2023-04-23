export function buildMutations(generation, percentMutation) {
    for (const element of generation) {
        if (Math.random() <= percentMutation) {
            let firstIndex = -1, secondIndex = -1;
            while ((secondIndex === firstIndex)) {
                firstIndex = Math.floor(Math.random() * element.length);
                secondIndex = Math.floor(Math.random() * element.length);
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
function swap(array, firstIndex, secondIndex) {
    let temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
}
function inverseMutation(array, firstIndex, secondIndex) {
    let i = firstIndex;
    let j = secondIndex;
    while (i <= j) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        i++;
        j--;
    }
}
// проходим половину массива генов, начиная от начала и до выбранного индекса и 
// меняем местами соответствующие гены с их зеркальными относительно выбранного индекса парами.
function fixedInverseMutation(array, firstIndex) {
    for (let i = 0; i < Math.floor(array.length / 2); i++) {
        if (i < firstIndex) {
            let temp = array[i];
            array[i] = array[firstIndex - i];
            array[firstIndex - i] = temp;
        }
        else {
            break;
        }
    }
}
// мутация: две случайные позиции в хромосоме и меняются местами все элементы между ними включительно. 
function mixingMutation(array, firstIndex, secondIndex) {
    let index = secondIndex;
    let random;
    while (index !== firstIndex) {
        random = firstIndex + Math.floor(Math.random() * (index - firstIndex));
        index--;
        let temp = array[index];
        array[index] = array[random];
        array[random] = temp;
    }
}
//# sourceMappingURL=mutations.js.map