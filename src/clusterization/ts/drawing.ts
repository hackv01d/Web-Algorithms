
import { Point} from "./cluster.js";

import {kmeans} from "./Kmeans.js";

export let points: Point[] = [

];
const radiusCircle = 22;
const baseColorCircle = 'white';


let canvas = document.getElementById('canv') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;


canvas.addEventListener('click', function (event) {

    let x: number = event.clientX - canvas.offsetLeft;
    let y: number = event.clientY - canvas.offsetTop;
    
    ctx.beginPath();
    ctx.arc(x, y, radiusCircle, 0, Math.PI * 2, false);
    ctx.fillStyle = baseColorCircle;
    ctx.fill();
    ctx.closePath();

    points.push({ x, y } as Point);
    
})
// Изменение k

const slider = document.getElementById("slider") as HTMLInputElement;
const currentValueSpan = document.getElementById("currentValue") as HTMLSpanElement;

slider.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    currentValueSpan.textContent = target.value;
});
let arr:Point[] =[]
let km  = new kmeans(3, arr);