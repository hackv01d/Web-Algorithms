let points: {x: number, y: number, count: number}[] = []; // вершины, выставленные user'ом
let count: number = 0; // счётчик
let countSendAnts: number = 1500; // количество отправлений муравья
let remainFeromon: number = 0.8; //  процент оставленного феромона
let Q: number = 2; // количество добавления феромона 
let beta: number = 4; // учитывание длины ребра 
let alfa: number = 2; // учитывание количества феромона
let initFeromon: number = 0.8; // начальный феромон на рёбрах


let canvas: HTMLCanvasElement = document.getElementById('canvasAnt') as HTMLCanvasElement;
let context: CanvasRenderingContext2D = canvas.getContext('2d')!;
let width: number = context.canvas.width;
let height: number = context.canvas.height;
let container: HTMLElement = document.getElementById('container-canvas')!;

startEffect();

function drawPoint(point: {x: number, y: number}) {
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


function changeSize():void {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    width = context.canvas.width;
    height = context.canvas.height;
}


function drawPath(pointFirst: { x: number; y: number}, pointSecond: {x: number; y: number}):void {
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.moveTo(pointFirst.x + 3, pointFirst.y + 4);
    context.lineTo(pointSecond.x + 3, pointSecond.y + 4);
    context.stroke();
}


function printPath(arrayNum: number[]) {
    for (let i = 0; i < count - 1; i++) {
      drawPath(points[arrayNum[i]], points[arrayNum[i + 1]]);
    }
    // дорисовать путь из конца в начало
    drawPath(points[arrayNum[0]], points[arrayNum[arrayNum.length - 2]]);
  }
  
function handlerPoints(mouseEvent: MouseEvent) {
    let x = mouseEvent.offsetX,
      y = mouseEvent.offsetY;
    drawPoint({ x, y });
    points.push({ x, y, count });
    count++;
}
  
function calculateDistance(
    pointFirst: { x: number; y: number },
    pointSecond: { x: number; y: number }
  ) {
    return Math.sqrt(
      Math.pow(pointFirst.x - pointSecond.x, 2) +
        Math.pow(pointFirst.y - pointSecond.y, 2)
    );
}


function fillWeight(): number[][] {
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
  
function fillFeromon(): number[][] {
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
  
function getFreePoints(currentPoint: number): boolean[] {
    let array: boolean[] = [];
    for (let i = 0; i < count; i++) {
      (i !== currentPoint) ? array.push(true) : array.push(false);
    }
    return array;
}

function choiceNextPoint(
    arrayWeights: number[][],
    arrayFeromons: number[][],
    needPoint: boolean[],
    currentPoint: number
  ): number {
    let desireSum = 0,
      i: number;
  
    const desireToMove = needPoint.map((available, index) => {
      if (available) {
        const desire =
          Math.pow(200 / arrayWeights[currentPoint][index], beta) *
          Math.pow(arrayFeromons[currentPoint][index], alfa);
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
    for (let i: number = 0; i < path.length - 2; i++) {
        arrayFeromons[i][i + 1] += delta;
        arrayFeromons[i + 1][i] = arrayFeromons[i][i + 1];
    }

    arrayFeromons[path[0]][path[path.length - 2]] += delta;
    arrayFeromons[path[path.length - 2]][path[0]] = arrayFeromons[path[0]][path[path.length - 2]];
    return arrayFeromons;
}

function downFeromon(arrayFeromons: number[][]) {
    return Array.from(arrayFeromons, row =>
        Array.from(row, pheromone => pheromone * remainFeromon)
    );
}


function antAlgorithm(): number[] {
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


function isValidCount(count: number): boolean {
    return count >= 10 && count <= 1000;
}


function isValidQ(count: number): boolean {
    return count >= 1 && count <= 10;
}


function isValidRemainFeromon(count: number): boolean {
    return count >= 0 && count <= 100;
}


function isValidBeta(count: number): boolean {
    return count >= 1 && count <= 6;
}


function isValidAlfa(count: number): boolean {
    return count >= 1 && count <= 4;
}


function getAnswer(minPath: any): void {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawPoints();
    printPath(minPath);
}

canvas.addEventListener('mousedown', function (event: MouseEvent) {
    handlerPoints(event);
});

window.addEventListener('resize', function (): void {
    changeSize();
    clearEvery();
}, false);

window.onload = changeSize.bind(canvas);


function startEffect(): void {
    const buildButton = document.getElementById('Build') as HTMLButtonElement;
    buildButton.addEventListener('click', async (): Promise<void> => {
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

function inputAttributes(id: string): void {
    let elem = document.getElementById(`${id}Diapason`) as HTMLInputElement;
    let countElem = document.getElementById(`${id}Count`);
    countElem.textContent = countElem.textContent!.replace(/\d+/, `${elem.value}`);
    switch (id) {
        case 'countSend':
            isValidCount(parseInt(elem.value)) ? countSendAnts = parseInt(elem.value) : countSendAnts = 1500;
            break;
        case 'q':
            isValidQ(parseInt(elem.value)) ? Q = parseInt(elem.value) : Q = 2;
            break;
        case 'remainFeromon':
            isValidRemainFeromon(parseInt(elem.value)) ? remainFeromon = parseInt(elem.value) / 100 : remainFeromon = 0.72;
            break;
        case 'beta':
            isValidBeta(parseInt(elem.value)) ? beta = parseInt(elem.value) : beta = 4;
            break;
        case 'alfa':
            isValidAlfa(parseInt(elem.value)) ? alfa = parseInt(elem.value) : alfa = 2;
            break;
        default:
            break;
    }
}

function clearEvery(): void {
    (document.getElementById('Build') as HTMLButtonElement).disabled = false;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    points = [];
    count = 0;
}
