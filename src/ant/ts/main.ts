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
    canvas.canvas.width = window.innerWidth * 0.6;
    canvas.canvas.height = window.innerHeight * 0.6;
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight * 0.6;
}


function isValidCount(count: number): void {
    if (count >= 10 && count <= 6000) {
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


startEffect();

document.getElementById("Build")!.addEventListener('click', startEffect);


const countSendDiapason = document.getElementById("countSendDiapason") as HTMLInputElement;
countSendDiapason.addEventListener("input", () => {
  isValidCount(countSendDiapason.valueAsNumber);
});


const qDiapason = document.getElementById("qDiapason") as HTMLInputElement;
qDiapason.addEventListener("input", () => {
    isValidQ(qDiapason.valueAsNumber);
});


const alfaDiapason = document.getElementById("alfaDiapason") as HTMLInputElement;
alfaDiapason.addEventListener("input", () => {
    isValidAlfa(alfaDiapason.valueAsNumber);
});

const remainFeromonDiapason = document.getElementById("remainFeromonDiapason") as HTMLInputElement;
remainFeromonDiapason.addEventListener("input", () => {
    isValidRemainFeromon(remainFeromonDiapason.valueAsNumber);
});

const betaDiapason = document.getElementById("betaDiapason") as HTMLInputElement;
betaDiapason.addEventListener("input", () => {
    isValidBeta(betaDiapason.valueAsNumber);
});
