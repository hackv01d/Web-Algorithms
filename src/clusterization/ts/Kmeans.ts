import { Point } from "./cluster.js";


export class kmeans{
    private k: number;
    private points : Point[];
    private centroids : Point[];

    constructor(k: number, points: Point[]) {
        this.k = k;
        this.points = points;
        this.centroids = this.initializeCentroids();
    }

    private initializeCentroids(): Point[] {
        const centroids: Point[] = [];
        for (let i = 0; i < this.k; i++) {
            const index = Math.floor(Math.random() *  this.points.length);
            centroids.push( this.points[index]);
        }
        return centroids;
    }


    private minDistance(first_p : Point, second_p :Point){
        return Math.sqrt((first_p.x - second_p.x ) ** 2 + (second_p.y + second_p.y) ** 2)
    }


    private getClosestCentroidIndex(point: Point): number {
        let closestDistance = Infinity;
        let closestCentroidIndex = -1;
    
        for (let i = 0; i < this.centroids.length; i++) {
            let distance = this.minDistance(this.centroids[i], point);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCentroidIndex = i;
          }
        }
    
        return closestCentroidIndex;
    }



    private calculateCentroid(points: Point[]): Point {
        const numPoints = points.length;
        let summa = new Point(0, 0);
    
        for(const point of points){
            summa.x += point.x;
            summa.y += point.y;
        }
        summa.x = summa.x / numPoints;
        summa.y = summa.y / numPoints;
      
        return summa;
    }
    

    private areCentroidsEqual(a: Point[], b: Point[]): boolean {
        if (a.length !== b.length) {
            return false;
        }
    
        for (let i = 0; i < a.length; i++) {
            if (a[i].x !== b[i].x || a[i].y !== b[i].y) {
                return false;
            }
        }
        return true;
    }
    

    public cluster(): Point[][]{
        let oldCentroids : Point[] = [];
    
        let clusters: Point[][] = Array.from({ length: this.k }, () => []);
    
        const MAX_ITERATIONS = 100;
        let counter = 0;
    
        
        while(!this.areCentroidsEqual(this.centroids, oldCentroids) && counter++ <= MAX_ITERATIONS){
    
            for(const point of this.points){ 
                const closestCentroidIndex = this.getClosestCentroidIndex( point);
                clusters[closestCentroidIndex].push(point);
            }
            for (let i = 0; i < clusters.length; i++) {
                this.centroids[i] = this.calculateCentroid(clusters[i]);
            }
    
            if (!this.areCentroidsEqual(this.centroids, oldCentroids)) {
                clusters = Array.from({ length: this.k }, () => []);
            }
    
            oldCentroids = [...this.centroids];
        }
        return clusters;
    }
}



