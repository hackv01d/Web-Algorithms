import { Point } from "./cluster";


export function kmeans(points: Point[], k : number){
    points = shuffle(points);
    
    
}

function shuffle(points: Point[]){
    let  index, currentIndex = points.length;
    while (currentIndex !== 0){
        index = Math.floor( currentIndex * Math.random());
        currentIndex--;
        let temp = points[index];
        points[index] = points[currentIndex];
        points[currentIndex] = temp;
    }
    return points;
}



// interface Point {
//     x: number;
//     y: number;
//   }
  
//   class KMeans {
//     private readonly k: number;
//     private readonly data: Point[];
  
//     constructor(k: number, data: Point[]) {
//       this.k = k;
//       this.data = data;
//     }
  
//     public run(): Point[][] {
//       // Инициализируем начальные центроиды случайным образом
//       const centroids = this.initializeCentroids();
  
//       while (true) {
//         // Создаем k кластеров и заполняем их точками
//         const clusters: Point[][] = new Array(this.k).fill(null).map(() => []);
  
//         // Кластеризуем точки
//         for (const point of this.data) {
//           const closestCentroidIndex = this.getClosestCentroidIndex(point, centroids);
//           clusters[closestCentroidIndex].push(point);
//         }
  
//         // Вычисляем новые центроиды
//         const newCentroids = clusters.map(cluster => this.calculateCentroid(cluster));
  
//         // Если центроиды не изменились, то заканчиваем алгоритм
//         if (this.areCentroidsEqual(centroids, newCentroids)) {
//           return clusters;
//         }
  
//         centroids = newCentroids;
//       }
//     }
  
//     private initializeCentroids(): Point[] {
//       // Выбираем k случайных точек в качестве начальных центроидов
//       const centroids: Point[] = [];
  
//       for (let i = 0; i < this.k; i++) {
//         const index = Math.floor(Math.random() * this.data.length);
//         centroids.push(this.data[index]);
//       }
  
//       return centroids;
//     }
  
//     private getClosestCentroidIndex(point: Point, centroids: Point[]): number {
//       // Находим ближайший центроид к заданной точке
//       let minDistance = Number.MAX_VALUE;
//       let closestCentroidIndex = -1;
  
//       for (let i = 0
class KMeans {
    private k: number; // число кластеров
    private data: number[][]; // данные
    private centroids: number[][]; // центроиды
    private labels: number[]; // метки кластеров
  
    constructor(k: number, data: number[][]) {
      this.k = k;
      this.data = data;
      this.centroids = [];
      this.labels = [];
  
      this.initCentroids();
    }
  
    // инициализация центроидов случайными значениями
    private initCentroids() {
      for (let i = 0; i < this.k; i++) {
        const centroid = [];
        for (let j = 0; j < this.data[0].length; j++) {
          centroid.push(Math.random());
        }
        this.centroids.push(centroid);
      }
    }
  
    // поиск ближайшего центроида
    private findClosestCentroid(point: number[]): number {
      let minDist = Number.MAX_VALUE;
      let closestCentroid = -1;
  
      for (let i = 0; i < this.centroids.length; i++) {
        const dist = this.euclideanDist(point, this.centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          closestCentroid = i;
        }
      }
  
      return closestCentroid;
    }
  
    // вычисление евклидова расстояния между двумя точками
    private euclideanDist(a: number[], b: number[]): number {
      let dist = 0;
      for (let i = 0; i < a.length; i++) {
        dist += Math.pow(a[i] - b[i], 2);
      }
      return Math.sqrt(dist);
    }
  
    // обновление центроидов
    private updateCentroids() {
      const clusterSum = Array(this.k)
        .fill(0)
        .map(() => Array(this.data[0].length).fill(0));
      const clusterSize = Array(this.k).fill(0);
  
      for (let i = 0; i < this.data.length; i++) {
        const label = this.labels[i];
        clusterSize[label]++;
        for (let j = 0; j < this.data[0].length; j++) {
          clusterSum[label][j] += this.data[i][j];
        }
      }
  
      for (let i = 0; i < this.k; i++) {
        for (let j = 0; j < this.data[0].length; j++) {
          this.centroids[i][j] = clusterSum[i][j] / clusterSize[i];
        }
      }
    }
  
    // кластеризация данных
    public fit(): number[] {
      let converged = false;
  
      while (!converged) {
        // присваивание меток
        let changed = false;
    for (let i = 0; i < this.data.length; i++) {
        const label = this.findClosestCentroid(this.data[i]);
        if (label !== this.labels[i]) {
        changed = true;
        this.labels[i] = label;
        }
  }

  // обновление центроидов
  this.updateCentroids();

  // проверка на сходимость
  if (!changed) {
    converged = true;
  }
}
}
    return this.labels;
    }




// пример использования
// const data = [
//     [1, 2],
//     [2, 1],
//     [2, 3],
//     [6, 5],
//     [7, 5],
//     [7, 7],
//     ];
//     const kmeans = new KMeans(2, data);
//     const labels = kmeans.fit();
//     console.log(labels); // [0, 0, 0, 1, 1, 1]