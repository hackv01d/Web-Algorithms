
import { Point } from "./interfaces.js";
import { clusterisation } from "./clusterisation.js";





class Drawing {
    private readonly radiusCircle = 22;
    private readonly baseColorCircle = 'white';
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private slider: HTMLInputElement;
    private currentValueSpan: HTMLSpanElement;


    constructor() {
        this.canvas = document.getElementById('canv') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

        this.slider = document.getElementById("slider") as HTMLInputElement;
        this.currentValueSpan = document.getElementById("currentValue") as HTMLSpanElement;

        this.canvas.addEventListener('click', this.addPoint.bind(this));

        this.slider.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            this.currentValueSpan.textContent = target.value;
        });
    }

    private addPoint(event: MouseEvent): void {
        const point: Point = {
            x: event.clientX - this.canvas.offsetLeft,
            y: event.clientY - this.canvas.offsetTop
        };
        this.drawCirce(point, this.radiusCircle, this.baseColorCircle);
    }

    public drawCirce(point: Point, radiusCircle: number, color: string) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radiusCircle, 0, Math.PI * 2, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    public getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    public getArrayRandomColor(k: number): string[] {
        let colors: string[] = [];
        while (colors.length < k) {
            let color = this.getRandomColor();
            if (!this.contains(colors, color))
                colors.push();
        }
        return colors;
    }

    private contains(arr: any, item: any): boolean {
        for (const elem of arr) {
            if (elem === item) {
                return true;
            }
        }
        return false;
    }

}


class ClusterHandler {
    private metricType: string;
    private lincageType: string;
    private algorithmType: string;
    private k: number;
    private cluster: clusterisation;
    private points: Point[];
    public clusterPoints: Point[][];

    constructor(points: Point[], k?: number) {
        this.points = points;
        this.k = k || 2;
        this.metricType = this.getMetric();
        this.lincageType = this.getLincage();
        this.algorithmType = this.getAlgorithm();
        this.cluster = new clusterisation(this.k, this.metricType, this.lincageType, this.algorithmType, this.points);
        this.clusterPoints = this.cluster.clust;
    }
    public logTypes(){
        console.log(this.lincageType,this.metricType, this.algorithmType);
        
    }

    private getMetric(): string {
        const metric = Array.from<HTMLInputElement>(document.querySelectorAll('input[name="metric"]:checked'));
        console.log(metric);
        
        for (const iterator of metric) {
            if (iterator.value !=="euclidean"){
                return iterator.value;
            }
        }
        return "euclidean";
    }
    private getLincage(): string {
        const lincage = Array.from<HTMLInputElement>(document.querySelectorAll('input[name="lincage"]:checked'));
        
        for (const iterator of lincage) {
            if (iterator.value !=="single"){
                return iterator.value;
            }
        }
        return "single";
    }
    private getAlgorithm(): string {
        const lincage = Array.from<HTMLInputElement>(document.querySelectorAll('input[name="algorithm"]:checked'));
        for (const iterator of lincage) {
            if (iterator.value !=="kmeans"){
                return iterator.value;
            }
        }
        
        return "kmeans";
    }
}

class DrawAndHandle {
    private readonly radiusCircle = 22;

    private button: HTMLButtonElement;
    private canvas: HTMLCanvasElement;
    private slider: HTMLInputElement;
    private points: Point[] = [];

    private k: number = 2;
    private drawVar: Drawing;

    constructor() {
        this.canvas = document.getElementById('canv') as HTMLCanvasElement;
        this.button = document.getElementById("sendBtn") as HTMLButtonElement;
        this.slider = document.getElementById("slider") as HTMLInputElement;
        this.drawVar = new Drawing();
        this.canvas.addEventListener('click', this.addPointListener.bind(this));
        this.button.addEventListener('click', this.startClickListener.bind(this));
    }
    private addPointListener(event: MouseEvent): void {
        const point: Point = {
            x: event.clientX - this.canvas.offsetLeft,
            y: event.clientY - this.canvas.offsetTop
        };
        this.points.push(point);
    }

    private startClickListener(event: MouseEvent): void {
        this.k = parseInt(this.slider.value, 10) || 2;
        let colorsArray: string[] = [];
        for (let i = 0; i < this.k; ++i) {
            colorsArray.push(this.drawVar.getRandomColor());
        }

        const handler = new ClusterHandler(this.points, this.k);
        handler.logTypes();
        const coloredPoints: Point[][] = handler.clusterPoints;
        this.colorAllClusters(coloredPoints, colorsArray);


    }
    private colorAllClusters(coloredPoints: Point[][], colorsArray: string[]): void {
        for (let i = 0; i < coloredPoints.length; ++i) {
            for (let point of coloredPoints[i]) {
                this.drawVar.drawCirce(point, this.radiusCircle - 5, colorsArray[i]);
            }
        }
    }
};


const draw = new DrawAndHandle();
