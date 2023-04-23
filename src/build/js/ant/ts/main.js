import { Canvas } from "./canvas.js";
import { antAlgorithm } from "./algorithm/core.js";
import { clearEvery, count, points } from "./points.js";
export let countSendAnts = 1500; // количество отправлений муравья
export let remainFeromon = 0.8; //  процент оставленного феромона
export let Q = 2; // количество добавления феромона 
export let beta = 4; // учитывание длины ребра 
export let alfa = 2; // учитывание количества феромона
let canvas = new Canvas('canvasAnt', 'container-canvas');
function changeSize() {
    canvas.canvas.width = window.innerWidth * 0.6;
    canvas.canvas.height = window.innerHeight * 0.6;
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight * 0.6;
}
function isValidCount(count) {
    if (count >= 10 && count <= 6000) {
        countSendAnts = count;
    }
}
function isValidQ(count) {
    if (count >= 1 && count <= 10) {
        Q = count;
    }
}
function isValidRemainFeromon(count) {
    if (count >= 0 && count <= 100) {
        remainFeromon = count / 100;
    }
}
function isValidBeta(count) {
    if (count >= 1 && count <= 6) {
        beta = count;
    }
}
function isValidAlfa(count) {
    if (count >= 1 && count <= 4) {
        alfa = count;
    }
}
window.addEventListener('resize', function () {
    changeSize();
    clearEvery();
}, false);
window.onload = changeSize.bind(canvas);
function startEffect() {
    const buildButton = document.getElementById('Build');
    buildButton.addEventListener('click', async () => {
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
document.getElementById("Build").addEventListener('click', startEffect);
const countSendDiapason = document.getElementById("countSendDiapason");
countSendDiapason.addEventListener("input", () => {
    isValidCount(countSendDiapason.valueAsNumber);
});
const qDiapason = document.getElementById("qDiapason");
qDiapason.addEventListener("input", () => {
    isValidQ(qDiapason.valueAsNumber);
});
const alfaDiapason = document.getElementById("alfaDiapason");
alfaDiapason.addEventListener("input", () => {
    isValidAlfa(alfaDiapason.valueAsNumber);
});
const remainFeromonDiapason = document.getElementById("remainFeromonDiapason");
remainFeromonDiapason.addEventListener("input", () => {
    isValidRemainFeromon(remainFeromonDiapason.valueAsNumber);
});
const betaDiapason = document.getElementById("betaDiapason");
betaDiapason.addEventListener("input", () => {
    isValidBeta(betaDiapason.valueAsNumber);
});
//# sourceMappingURL=main.js.map