
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
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.slider = document.getElementById("slider") as HTMLInputElement;
        this.currentValueSpan = document.getElementById("currentValue") as HTMLSpanElement;
        
        this.canvas.addEventListener('click', this.addPoint.bind(this));
       

        this.slider.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            this.currentValueSpan.textContent = target.value;
        });
        
    }

    public clearField(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }


    private addPoint(event: MouseEvent): void {
        const canvasBounds = this.canvas.getBoundingClientRect();
        const point: Point = {
            x: event.clientX - canvasBounds.left,
            y: event.clientY - canvasBounds.top
        };
        this.drawCirce(point, this.radiusCircle, this.baseColorCircle);
    }
    public drawPartCirce(point: Point, radiusCircle: number, color: string, isReversed: boolean) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radiusCircle, 0, Math.PI, isReversed);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
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
    private clearButton: HTMLButtonElement;



    constructor(points: Point[],algorithmType: string, k?: number) {
        this.points = points;
        this.k = k || 2;
        this.metricType = this.getMetric();
        this.lincageType = this.getLincage();
        this.algorithmType = algorithmType;
        this.cluster = new clusterisation(this.k, this.metricType, this.lincageType, this.algorithmType, this.points);
        this.clusterPoints = this.cluster.clust;
        this.clearButton = document.getElementById("clearBtn") as HTMLButtonElement;
        this.clearButton.addEventListener('click', this.clearField.bind(this));
        
    }
    public clearField(){
        this.points = [];
        this.clusterPoints = [];
        this.cluster.clust =[];
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



}

class DrawAndHandle {
    private readonly radiusCircle = 22;

    private button: HTMLButtonElement;
    private clearButton: HTMLButtonElement;
    private canvas: HTMLCanvasElement;
    private slider: HTMLInputElement;
    
    private points: Point[] = [];

    private k: number = 2;
    private drawVar: Drawing;


    constructor() {
        this.canvas = document.getElementById('canv') as HTMLCanvasElement;
        this.button = document.getElementById("sendBtn") as HTMLButtonElement;
        this.clearButton = document.getElementById("clearBtn") as HTMLButtonElement;
        this.slider = document.getElementById("slider") as HTMLInputElement;
        this.canvas.height = window.innerHeight * 0.6;
        this.canvas.width = window.innerWidth * 0.4;

        this.drawVar = new Drawing();
        this.canvas.addEventListener('click', this.addPointListener.bind(this));
        this.button.addEventListener('click', this.startClickListener.bind(this));
        this.clearButton.addEventListener('click', this.clearField.bind(this));
        this.canvas.addEventListener('resize', this.changeSize.bind(this));
    }

    private changeSize(): void {
        this.canvas.height = window.innerHeight * 0.6;
        this.canvas.width = window.innerWidth * 0.4;
        
    }
    private clearField(){
        this.drawVar.clearField();
        this.points = [];
    }

    private addPointListener(event: MouseEvent): void {
        const canvasBounds = this.canvas.getBoundingClientRect();
        const point: Point = {
            x: event.clientX - canvasBounds.left,
            y: event.clientY - canvasBounds.top
        };
        this.points.push(point);
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

    private startClickListener(event: MouseEvent): void {
        this.k = parseInt(this.slider.value, 10) || 2;
        let colorsArray: string[] = [];
        for (let i = 0; i < this.k; ++i) {
            colorsArray.push(this.drawVar.getRandomColor());
        }
        const algorithmType = this.getAlgorithm();
        if (algorithmType !== "both"){
            const handler = new ClusterHandler(this.points, algorithmType, this.k);
            const coloredPoints: Point[][] = handler.clusterPoints;
            this.colorAllClusters(coloredPoints, colorsArray);
        } else{
            const kmeansHandler = new ClusterHandler(this.points, "kmeans", this.k);
            this.colorPartClusters(kmeansHandler.clusterPoints, colorsArray, true);

            const hierarhicalHandler = new ClusterHandler(this.points, "hierarhical", this.k);
            this.colorPartClusters(hierarhicalHandler.clusterPoints, colorsArray, false);
        }
        
    }

    private colorPartClusters(coloredPoints: Point[][], colorsArray: string[], isReversed: boolean): void {
        for (let i = 0; i < coloredPoints.length; ++i) {
            for (let point of coloredPoints[i]) {
                this.drawVar.drawPartCirce(point, this.radiusCircle - 5, colorsArray[i], isReversed);
            }
        }
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
