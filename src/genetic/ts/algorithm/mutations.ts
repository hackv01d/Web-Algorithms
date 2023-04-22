export function buildMutations(generation: number[][], percentMutation: number): void {
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
