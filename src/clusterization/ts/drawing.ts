
import { Point} from "./interfaces.js";
import { clusterisation } from "./clusterisation.js";





class Drawing{
    public drawCirce(point: Point, radiusCircle: number, color: string){
        ctx.beginPath();
        ctx.arc(point.x, point.y, radiusCircle, 0, Math.PI * 2, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    public getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    public getArrayRandomColor(k: number): string[]{
        let colors: string[] = [];
        while(colors.length < k){
            let color = this.getRandomColor();
            if (!contains(colors, color))
                colors.push();
        }
        return colors;
    }
}
function contains(arr: any, item: any): boolean {
    for(const elem of arr){
        if (elem === item){
            return true;
        }
    }
    return false;
}


const radiusCircle = 22;
const baseColorCircle = 'white';
const drawVar = new Drawing();

const slider = document.getElementById("slider") as HTMLInputElement;
const currentValueSpan = document.getElementById("currentValue") as HTMLSpanElement;
const button = document.getElementById("sendBtn") as HTMLButtonElement;



let canvas = document.getElementById('canv') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

let k: number = 2;
let points: Point[] = [];


canvas.addEventListener('click', function (event) {
    let point: Point  = {
        x: event.clientX - canvas.offsetLeft, 
        y: event.clientY - canvas.offsetTop
    };

    drawVar.drawCirce(point, radiusCircle, baseColorCircle);
    points.push(point);

})

slider.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    currentValueSpan.textContent = target.value;
    k = parseInt(target.value, 10);
});


button.addEventListener('click', () => {
    let colorsArray: string[] = [];
    for(let i = 0; i < k; ++i){
        colorsArray.push(drawVar.getRandomColor());
    }
    const metricType = getMetric();
    const lincageType = getLincage();
    
    const clust = new clusterisation(k, points);
    const coloredPoints : Point[][] = clust.hierarchicalClustering();
    
    for (let i = 0; i < coloredPoints.length; ++i) {
        for (let point of coloredPoints[i]) {
            drawVar.drawCirce(point, radiusCircle - 5,colorsArray[i]);
        }
    } 
})

function getMetric() : string{
    const metric = document.querySelectorAll('input[name="metric"]');
    for (const iterator of metric) {
        if (iterator.ariaChecked){
            return iterator.ariaValueText;
        }
    }
    return "euclidean";

}
function getLincage() : string{
    const lincage = document.querySelectorAll('input[name="lincage"]');
    for (const iterator of lincage) {
        if (iterator.ariaChecked){
            return iterator.ariaValueText;
        }
    }
    return "single";
}