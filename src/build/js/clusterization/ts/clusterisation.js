export class clusterisation {
    constructor(k, metric, lincage, algorithm, points) {
        this.k = 2;
        this.k = k;
        this.points = points || [];
        this.centroids = this.initializeCentroids();
        this.metric = metric;
        this.lincage = lincage;
        this.algorithm = algorithm;
        this.clust = this.cluster();
    }
    initializeCentroids() {
        const result = [];
        const length = this.points.length;
        while (result.length < this.k) {
            const randomIndex = Math.floor(Math.random() * length);
            if (!result.includes(this.points[randomIndex])) {
                result.push(this.points[randomIndex]);
            }
        }
        return result;
    }
    calculateCentroid(points) {
        const numPoints = points.length;
        let summa = ({ x: 0, y: 0 });
        for (const point of points) {
            summa.x += point.x;
            summa.y += point.y;
        }
        return {
            x: summa.x / numPoints,
            y: summa.y / numPoints
        };
    }
    areCentroidsEqual(a, b) {
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
    getClosestCentroidIndex(point) {
        let closestDistance = Infinity;
        let closestCentroidIndex = -1;
        for (let i = 0; i < this.centroids.length; i++) {
            let distance = this.calculateDistance(this.centroids[i], point);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCentroidIndex = i;
            }
        }
        return closestCentroidIndex;
    }
    euclideanDistance(first_p, second_p) {
        return Math.sqrt((first_p.x - second_p.x) ** 2 + ((first_p.y - second_p.y) ** 2));
    }
    chebyshevDistance(first_p, second_p) {
        return Math.max(Math.abs(first_p.x - second_p.x), Math.abs(first_p.y - second_p.y));
    }
    manhattanDistance(first_p, second_p) {
        return Math.abs(first_p.x - second_p.x) + Math.abs(first_p.y - second_p.y);
    }
    calculateDistance(first_p, second_p) {
        if (this.metric === "manhattan") {
            return this.manhattanDistance(first_p, second_p);
        }
        else if (this.metric === "chebyshev") {
            return this.chebyshevDistance(first_p, second_p);
        }
        else {
            return this.euclideanDistance(first_p, second_p);
        }
    }
    singleLinkage(first_c, second_c) {
        let minDistance = Infinity;
        for (let i = 0; i < first_c.length; i++) {
            for (let j = 0; j < second_c.length; j++) {
                const distance = this.euclideanDistance(first_c[i], second_c[j]);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
        return minDistance;
    }
    averageLinkage(first_c, second_c) {
        let distanceSum = 0;
        for (let i = 0; i < first_c.length; i++) {
            for (let j = 0; j < second_c.length; j++) {
                distanceSum += this.euclideanDistance(first_c[i], second_c[j]);
            }
        }
        return distanceSum / (first_c.length * second_c.length);
    }
    completeLinkage(first_c, second_c) {
        let maxDistance = -Infinity;
        for (let i = 0; i < first_c.length; i++) {
            for (let j = 0; j < second_c.length; j++) {
                const distance = this.euclideanDistance(first_c[i], second_c[j]);
                if (distance > maxDistance) {
                    maxDistance = distance;
                }
            }
        }
        return maxDistance;
    }
    Lincage(first_c, second_c) {
        if (this.lincage === "complete") {
            return this.completeLinkage(first_c, second_c);
        }
        else if (this.lincage === "average") {
            return this.averageLinkage(first_c, second_c);
        }
        else {
            return this.singleLinkage(first_c, second_c);
        }
    }
    kmeans() {
        let oldCentroids = [{ x: 0, y: 0 }];
        let clusters = Array(this.k).fill([]);
        for (let i = 0; i < this.k; i++) {
            clusters[i] = [];
        }
        for (let i = 0; i < 100; ++i) {
            for (const point of this.points) {
                const closestCentroidIndex = this.getClosestCentroidIndex(point);
                if (closestCentroidIndex !== -1) {
                    clusters[closestCentroidIndex].push(point);
                }
            }
            oldCentroids = [...this.centroids];
            for (let i = 0; i < clusters.length; i++) {
                this.centroids[i] = this.calculateCentroid(clusters[i]);
            }
            if (!this.areCentroidsEqual(this.centroids, oldCentroids)) {
                clusters = Array(this.k).fill([]).map(() => []);
            }
            else {
                break;
            }
        }
        return clusters;
    }
    hierarchicalClustering() {
        const clusters = this.points.map((point) => [point]);
        while (this.k < clusters.length) {
            let minDist = Infinity;
            let idClosestClusters = [0, 1];
            for (let i = 0; i < clusters.length; i++) {
                for (let j = i + 1; j < clusters.length; j++) {
                    const dist = this.Lincage(clusters[i], clusters[j]);
                    if (dist < minDist) {
                        minDist = dist;
                        idClosestClusters = [i, j];
                    }
                }
            }
            const newCluster = clusters[idClosestClusters[0]].concat(clusters[idClosestClusters[1]]); // сливаем 1 и 2 кластер
            clusters.splice(idClosestClusters[1], 1); // удаляем первый элемент
            clusters[idClosestClusters[0]] = newCluster;
        }
        return clusters;
    }
    cluster() {
        if (this.algorithm === "hierarchical") {
            return this.hierarchicalClustering();
        }
        else {
            return this.kmeans();
        }
    }
}
//# sourceMappingURL=clusterisation.js.map