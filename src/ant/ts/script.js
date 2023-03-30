let points = []; // вершины, выставленные user'ом
let count = 0; // счётчик
let countSendAnts = 1500; // количество отправлений муравья
let remainFeromon = 0.8; //  процент оставленного феромона
let Q = 2; // количество добавления феромона 
let beta = 4; // учитывание длины ребра 
let alfa = 2; // учитывание количества феромона
let initFeromon = 0.8; // начальный феромон на рёбрах


let canvas = document.getElementById('canvasAnt');
context = canvas.getContext('2d');
let width = context.canvas.width;
let height = context.canvas.height;
container = document.getElementById('container-canvas');
startEffect();


function drawPoint(point) {
    context.beginPath();
    context.arc(point.x + 2, point.y + 3, 7, 0, 2 * Math.PI);
    context.fillStyle = "orange";
    context.fill();
}


function drawPoints() {
    for (const element of points) {
        drawPoint(element);
    }
}


function changeSize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    width = context.canvas.width;
    height = context.canvas.height;
}


function drawPath(pointFirst, pointSecond) {
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.moveTo(pointFirst.x + 3, pointFirst.y + 4);
    context.lineTo(pointSecond.x + 3, pointSecond.y + 4);
    context.stroke();
}


function printPath(arrayNum) {
    for (let i = 0; i < count - 1; i++) {
        drawPath(points[arrayNum[i]], points[arrayNum[i + 1]]);
    }
    // дорисовать путь из конца в начало
    drawPath(points[arrayNum[0]], points[arrayNum[arrayNum.length - 2]]);
}
 
 
function handlerPoints(mouseEvent) {
    let x = mouseEvent.offsetX, y = mouseEvent.offsetY;
    drawPoint({x, y});
    points.push({x, y, count});
    count++;
}


function calculateDistance(pointFirst, pointSecond) {
    return Math.sqrt(Math.pow((pointFirst.x - pointSecond.x), 2)
        + Math.pow((pointFirst.y - pointSecond.y), 2));
}


function fillWeight() {
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


function fillFeromon() {
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


function getFreePoints(currentPoint) {
    let array = [];
    for (let i = 0; i < count; i++) {
        (i !== currentPoint) ? array.push(true) : array.push(false);
    }
    return array;
}


function choiceNextPoint(arrayWeights, arrayFeromons, needPoint, currentPoint) {
    let desireSum = 0, i;

    const desireToMove = needPoint.map((available, i) => {
        if (available) {
            const desire = Math.pow(200 / arrayWeights[currentPoint][i], beta)
                * Math.pow(arrayFeromons[currentPoint][i], alfa);
            desireSum += desire;
            return desire;
        } else {
            return 0;
        }
    });

    const probabilityToMove = desireToMove.reduce((arr, desire) => {
        const lastProbability = arr[arr.length - 1] || 0;
        const probability = lastProbability + (desire / desireSum);
        arr.push(probability);
        return arr;
    }, []);

    const randomValue = Math.random();
    probabilityToMove.forEach((probability, index) => {
        if ((i === undefined) && (randomValue <= probability)) {
            i = index;
        }
    });

    return i;
}


function upFeromon(arrayFeromons, path) {
    const delta = Q / path[path.length - 1];
    for (let i = 0; i < path.length - 2; i++) {
        arrayFeromons[i][i + 1] += delta;
        arrayFeromons[i + 1][i] = arrayFeromons[i][i + 1];
    }

    arrayFeromons[path[0]][path[path.length - 2]] += delta;
    arrayFeromons[path[path.length - 2]][path[0]] = arrayFeromons[path[0]][path[path.length - 2]];
    return arrayFeromons;
}


function downFeromon(arrayFeromons) {
    return Array.from(arrayFeromons, row =>
        Array.from(row, pheromone => pheromone * remainFeromon)
    );
}


function antAlgorithm() {
    let arrayWeights = fillWeight();
    let arrayFeromons = fillFeromon();
    let lenMinPath = Infinity;
    let minPath = []
    
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
                lenCurrentPath +=
                    calculateDistance(points[currentPath[currentPath.length - 2]], points[currentPath[currentPath.length - 1]]);
            }
 
            lenCurrentPath += calculateDistance(points[currentPath[0]], points[currentPath[currentPath.length - 1]]);
            if (lenCurrentPath < lenMinPath) {
                lenMinPath = lenCurrentPath;
                minPath = currentPath;
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


function isValidCount(count) {
    return count >= 10 && count <= 1000;
}


function isValidQ(count) {
    return count >= 1 && count <= 10;
}


function isValidRemainFeromon(count) {
    return count >= 0 && count <= 100;
}


function isValidBeta(count) {
    return count >= 1 && count <= 6;
}


function isValidAlfa(count) {
    return count >= 1 && count <= 4;
}


function getAnswer(minPath) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawPoints();
    printPath(minPath);
}


canvas.addEventListener('mousedown', function (event) {
    handlerPoints(event, canvas);

})


window.addEventListener('resize', function () {
    changeSize();
    clearEvery();
}, false);
window.onload = changeSize.bind(canvas);


function startEffect() {
    const buildButton = document.getElementById('Build');
    buildButton.addEventListener('click', async () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawPoints();
        if (count !== 0) {
            buildButton.disabled = true;
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            for (let i = 0; i < count; i++) {
                drawPoint(points[i]);
            }
            getAnswer(antAlgorithm());
            buildButton.disabled = false;
        }
    });
}


function inputAttributes(id) {
    let elem = document.getElementById(`${id}Diapason`);
    let count = document.getElementById(`${id}Count`);
    count.textContent = count.textContent.replace(/\d+/, `${elem.value}`);
    switch (id) {
        case 'countSend':
            isValidCount(elem.value) ? countSendAnts = parseInt(elem.value) : countSendAnts = 1500;
            break;
        case 'q':
            isValidQ(elem.value) ? Q = parseInt(elem.value) : Q = 2;
            break;
        case 'remainFeromon':
            isValidRemainFeromon(elem.value) ? remainFeromon = parseInt(elem.value) / 100 : remainFeromon = 0.72;
            break;
        case 'beta':
            isValidBeta(elem.value) ? beta = parseInt(elem.value) : beta = 4;
            break;
        case 'alfa':
            isValidAlfa(elem.value) ? alfa = parseInt(elem.value) : alfa = 2;
            break;
        default:
            break;
    }
}


function clearEvery() {
    document.getElementById('Build').disabled = false;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    points = [];
    count = 0;
}
