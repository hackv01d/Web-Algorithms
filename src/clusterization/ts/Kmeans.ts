import { Point } from "./cluster.js";

export class kmeans {
    private k: number = 2;
    private points: Point[];
    private centroids: Point[];

    constructor(k: number, points: Point[]) {
        this.k = k;
        this.points = points;
        this.centroids = this.initializeCentroids(); 
    }

    private initializeCentroids(): Point[] {
        const result: Point[] = [];
        const length = this.points.length;
        if (length === 0 || this.k > length) {
          throw new Error('Invalid arguments');
        }
        while (result.length < this.k) {
          const randomIndex = Math.floor(Math.random() * length);
          if (!result.includes(this.points[randomIndex])) {
            result.push(this.points[randomIndex]);
          }
        }
        return result;
    }

    private minDistance(first_p: Point, second_p: Point) {
        return Math.sqrt((first_p.x - second_p.x) ** 2 + ((first_p.y - second_p.y) ** 2))
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
        let summa = ({x: 0, y:0});

        for (const point of points) {
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


    public cluster(): Point[][] {
        let oldCentroids: Point[] = [{x: 0, y: 0}];

        let clusters: Point[][] = Array(this.k).fill([]);
        for (let i = 0; i < this.k; i++) {
            clusters[i] = [];
        }
        for(let i = 0 ; i < 100; ++i) {
            for (const point of this.points) {
                const closestCentroidIndex = this.getClosestCentroidIndex(point);
                if (closestCentroidIndex !== -1) {
                    clusters[closestCentroidIndex].push(point);  
                }
            }
            
            oldCentroids = JSON.parse(JSON.stringify(this.centroids));
            for (let i = 0; i < clusters.length; i++) {
                this.centroids[i] = this.calculateCentroid(clusters[i]);
            }
            if (!this.areCentroidsEqual(this.centroids, oldCentroids)) {
                clusters = Array(this.k).fill([]).map(() => []);
            } else{
                break;
            }
        }

        return clusters;
    }
}



