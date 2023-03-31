
// import { Point } from "./cluster.js";
type Point = {
    x: number;
    y: number;
};
import { kmeans } from "./Kmeans.js";

export let points: Point[] = [

];
const radiusCircle = 22;
const baseColorCircle = 'white';


let canvas = document.getElementById('canv') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 1000;


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

let k: number = 2;

const slider = document.getElementById("slider") as HTMLInputElement;
const currentValueSpan = document.getElementById("currentValue") as HTMLSpanElement;

slider.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    currentValueSpan.textContent = target.value;
    k = parseInt(target.value, 10);
});





const button = document.getElementById('sendBtn') as HTMLButtonElement;



button.addEventListener('click', (event) => {
    const randomColor = getRandomColor();
    button.style.backgroundColor = randomColor;
    const colors: string[] = [];
    for(let i = 0; i < k; ++i){
        colors.push(getRandomColor());
    }

    const clust = new kmeans(k, points);
    const coloring : Point[][] = clust.cluster();
    console.log(coloring);
    

    for (let i = 0; i < coloring.length; ++i) {
        for (let color of coloring[i]) {
            ctx.beginPath();
            ctx.arc(color.x, color.y, radiusCircle, 0, Math.PI * 2, false);
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.closePath();
        }
    } 
})



function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}