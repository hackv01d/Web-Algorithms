import { Canvas } from "./canvas.js";
import { antAlgorithm } from "./algorithm/core.js";
import { clearEvery, count, points } from "./points.js";


export let countSendAnts: number = 1500; // количество отправлений муравья
export let remainFeromon: number = 0.8; //  процент оставленного феромона
export let Q: number = 2; // количество добавления феромона 
export let beta: number = 4; // учитывание длины ребра 
export let alfa: number = 2; // учитывание количества феромона
let canvas = new Canvas('canvasAnt', 'container-canvas');


function changeSize(): void {
    canvas.canvas.width = canvas.container.offsetWidth;
    canvas.canvas.height = canvas.container.offsetHeight;
    canvas.width = canvas.context.canvas.width;
    canvas.height = canvas.context.canvas.height;
}


function isValidCount(count: number): void {
    if (count >= 10 && count <= 1000) {
        countSendAnts = count;
    }
}


function isValidQ(count: number): void {
    if (count >= 1 && count <= 10) {
        Q = count;
    }
}


function isValidRemainFeromon(count: number): void {
    if (count >= 0 && count <= 100) {
        remainFeromon = count / 100;
    }
}


function isValidBeta(count: number): void {
    if (count >= 1 && count <= 6) {
        beta = count;
    }
}


function isValidAlfa(count: number): void {
    if (count >= 1 && count <= 4) {
        alfa = count;
    }
}


window.addEventListener('resize', function (): void {
    changeSize();
    clearEvery();
}, false);

window.onload = changeSize.bind(canvas);


function startEffect(): void {
    const buildButton = document.getElementById('Build') as HTMLButtonElement;
    buildButton.addEventListener('click', async (): Promise<void> => {
        canvas.clearField();
        canvas.retakePoints(points);
        if (count !== 0) {
            buildButton.disabled = true;
            canvas.clearField();
            for (let i = 0; i < count; i++) {
                canvas.drawPoint(points[i]);
            }
            antAlgorithm();
            buildButton.disabled = false;
        }
    });
}


function changeValue(id: string): void {
    let elem = document.getElementById(`${id}Diapason`) as HTMLInputElement;
    let countElem = document.getElementById(`${id}Count`);
    countElem.textContent = countElem.textContent!.replace(/\d+/, `${elem.value}`);
    switch (id) { 
        case 'countSend':
            isValidCount(parseInt(elem.value));
            break;
        case 'q':
            isValidQ(parseInt(elem.value));
            break;
        case 'remainFeromon':
            isValidRemainFeromon(parseInt(elem.value));
            break;
        case 'beta':
            isValidBeta(parseInt(elem.value));
            break;
        case 'alfa':
            isValidAlfa(parseInt(elem.value));
            break;
        default:
            break;
    }
}


startEffect();

document.getElementById("Build")!.addEventListener('click', startEffect);

document.getElementById("countSendDiapason")!.addEventListener('input', () => changeValue('countSend'));

document.getElementById("qDiapason")!.addEventListener("input", () => {changeValue("q");});

document.getElementById("remainFeromonDiapason")!.addEventListener("input", () => {changeValue("remainFeromon");});

document.getElementById("alfaDiapason")!.addEventListener("input", () => {changeValue("alfa");});

document.getElementById("betaDiapason")!.addEventListener("input", () => {changeValue("beta");});
