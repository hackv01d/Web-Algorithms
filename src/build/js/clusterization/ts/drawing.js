import { clusterisation } from "./clusterisation.js";
class Drawing {
    constructor() {
        this.radiusCircle = 18;
        this.baseColorCircle = 'white';
        this.canvas = document.getElementById('canv');
        this.ctx = this.canvas.getContext('2d');
        this.slider = document.getElementById("slider");
        this.currentValueSpan = document.getElementById("currentValue");
        this.canvas.addEventListener('click', this.addPoint.bind(this));
        this.slider.addEventListener("input", (event) => {
            const target = event.target;
            this.currentValueSpan.textContent = target.value;
        });
    }
    clearField() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    addPoint(event) {
        const canvasBounds = this.canvas.getBoundingClientRect();
        const point = {
            x: event.clientX - canvasBounds.left,
            y: event.clientY - canvasBounds.top
        };
        this.drawCirce(point, this.radiusCircle, this.baseColorCircle);
    }
    drawPartCirce(point, radiusCircle, color, isReversed) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radiusCircle, 0, Math.PI, isReversed);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawCirce(point, radiusCircle, color) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radiusCircle, 0, Math.PI * 2, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    getArrayRandomColor(k) {
        let colors = [];
        while (colors.length < k) {
            let color = this.getRandomColor();
            if (!this.contains(colors, color))
                colors.push();
        }
        return colors;
    }
    contains(arr, item) {
        for (const elem of arr) {
            if (elem === item) {
                return true;
            }
        }
        return false;
    }
}
class ClusterHandler {
    constructor(points, algorithmType, k) {
        this.points = points;
        this.k = k || 2;
        this.metricType = this.getMetric();
        this.lincageType = this.getLincage();
        this.algorithmType = algorithmType;
        this.cluster = new clusterisation(this.k, this.metricType, this.lincageType, this.algorithmType, this.points);
        this.clusterPoints = this.cluster.clust;
        this.clearButton = document.getElementById("clearBtn");
        this.clearButton.addEventListener('click', this.clearField.bind(this));
        window.addEventListener('resize', this.clearField.bind(this));
    }
    clearField() {
        this.points = [];
        this.clusterPoints = [];
        this.cluster.clust = [];
    }
    getMetric() {
        const metric = Array.from(document.querySelectorAll('input[name="metric"]:checked'));
        for (const iterator of metric) {
            if (iterator.value !== "euclidean") {
                return iterator.value;
            }
        }
        return "euclidean";
    }
    getLincage() {
        const lincage = Array.from(document.querySelectorAll('input[name="lincage"]:checked'));
        for (const iterator of lincage) {
            if (iterator.value !== "single") {
                return iterator.value;
            }
        }
        return "single";
    }
}
class DrawAndHandle {
    constructor() {
        this.radiusCircle = 18;
        this.points = [];
        this.k = 2;
        this.canvas = document.getElementById('canv');
        this.button = document.getElementById("sendBtn");
        this.clearButton = document.getElementById("clearBtn");
        this.slider = document.getElementById("slider");
        this.canvas.height = window.innerHeight * 0.65;
        this.canvas.width = window.innerWidth * 0.4;
        this.drawVar = new Drawing();
        this.canvas.addEventListener('click', this.addPointListener.bind(this));
        window.addEventListener('resize', this.changeSize.bind(this));
        this.button.addEventListener('click', this.startClickListener.bind(this));
        this.clearButton.addEventListener('click', this.clearField.bind(this));
    }
    changeSize() {
        this.canvas.height = window.innerHeight * 0.65;
        this.canvas.width = window.innerWidth * 0.4;
        this.drawVar.clearField();
        this.points = [];
    }
    clearField() {
        if (this.points.length === 0) {
            alert('Поле пустое');
        }
        this.drawVar.clearField();
        this.points = [];
    }
    addPointListener(event) {
        const canvasBounds = this.canvas.getBoundingClientRect();
        const point = {
            x: event.clientX - canvasBounds.left,
            y: event.clientY - canvasBounds.top
        };
        this.points.push(point);
    }
    getAlgorithm() {
        const lincage = Array.from(document.querySelectorAll('input[name="algorithm"]:checked'));
        for (const iterator of lincage) {
            if (iterator.value !== "kmeans") {
                return iterator.value;
            }
        }
        return "kmeans";
    }
    startClickListener(event) {
        this.k = parseInt(this.slider.value, 10) || 2;
        const algorithmType = this.getAlgorithm();
        if (this.points.length === 0 || this.k > this.points.length) {
            alert('Проверьте количество точек');
        }
        else if (algorithmType !== "both") {
            const handler = new ClusterHandler(this.points, algorithmType, this.k);
            this.colorAllClusters(handler.clusterPoints);
        }
        else {
            const kmeansHandler = new ClusterHandler(this.points, "kmeans", this.k);
            const hierarhicalHandler = new ClusterHandler(this.points, "hierarhical", this.k);
            this.colorPartClusters(kmeansHandler.clusterPoints, hierarhicalHandler.clusterPoints);
        }
    }
    colorPartClusters(coloredPointsFirst, coloredPointsSecond) {
        let colorsArray = [];
        for (let i = 0; i < this.k; ++i) {
            colorsArray.push(this.drawVar.getRandomColor());
        }
        for (let i = 0; i < coloredPointsFirst.length; ++i) {
            for (let point of coloredPointsFirst[i]) {
                this.drawVar.drawPartCirce(point, this.radiusCircle - 5, colorsArray[i], true);
            }
        }
        for (let i = 0; i < coloredPointsSecond.length; ++i) {
            for (let point of coloredPointsSecond[i]) {
                this.drawVar.drawPartCirce(point, this.radiusCircle - 5, colorsArray[i], false);
            }
        }
    }
    colorAllClusters(coloredPoints) {
        let colorsArray = [];
        for (let i = 0; i < this.k; ++i) {
            colorsArray.push(this.drawVar.getRandomColor());
        }
        for (let i = 0; i < coloredPoints.length; ++i) {
            for (let point of coloredPoints[i]) {
                this.drawVar.drawCirce(point, this.radiusCircle - 5, colorsArray[i]);
            }
        }
    }
}
;
const draw = new DrawAndHandle();
//# sourceMappingURL=drawing.js.map