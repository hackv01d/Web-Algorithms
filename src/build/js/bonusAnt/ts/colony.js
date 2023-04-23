import Ant from './ants.js';
import { work } from './script.js';
export default class Colony {
    constructor(placeX, placeY, numAnts, colonySize) {
        this.antsColony = [];
        this.homePheromones = [];
        this.foodPheromones = [];
        this.collectFood = 0;
        this.positionColony = { x: placeX, y: placeY };
        this.numAntsColony = numAnts;
        this.sizeColony = colonySize;
    }
    get position() {
        return this.positionColony;
    }
    get numAnts() {
        return this.numAntsColony;
    }
    get ants() {
        return this.antsColony;
    }
    get toHomePheromones() {
        return this.homePheromones;
    }
    get toFoodPheromones() {
        return this.foodPheromones;
    }
    get size() {
        return this.sizeColony;
    }
    get foodCollected() {
        return this.collectFood;
    }
    set position(positionColony) {
        this.positionColony.x = positionColony.x;
        this.positionColony.y = positionColony.y;
    }
    set numAnts(numAntsColony) {
        this.numAntsColony = numAntsColony;
    }
    set ants(antsColony) {
        this.antsColony = antsColony;
    }
    set toHomePheromones(homePheromones) {
        this.homePheromones = homePheromones;
    }
    set toFoodPheromones(foodPheromones) {
        this.foodPheromones = foodPheromones;
    }
    set size(sizeColony) {
        this.sizeColony = sizeColony;
    }
    set foodCollected(collectFood) {
        this.collectFood = collectFood;
    }
    // создаем муравьев и ставим их по кругу
    makeColonyAnts(antSize) {
        const dirIncr = (Math.PI * 2) / this.numAnts;
        for (let i = 0; i < this.numAnts; i++) {
            const dir = (i + 1) * dirIncr;
            const ax = this.position.x + this.size * Math.cos(dir);
            const ay = this.position.y + this.size * Math.sin(dir);
            this.ants.push(new Ant(ax, ay, dir, antSize));
        }
    }
    update(delta, canvasWidth, canvasHeight, ctx, foodPieces, walls, wrap) {
        for (let i = 0; i < this.toFoodPheromones.length; i++) {
            this.toFoodPheromones[i].update(delta);
            this.toFoodPheromones[i].draw(ctx);
            if (this.toFoodPheromones[i].life < 0) {
                this.toFoodPheromones.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < this.toHomePheromones.length; i++) {
            this.toHomePheromones[i].update(delta);
            this.toHomePheromones[i].draw(ctx);
            if (this.toHomePheromones[i].life < 0) {
                this.toHomePheromones.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < this.ants.length; i++) {
            this.foodCollected += this.ants[i].walkAnt(this.toFoodPheromones, this.toHomePheromones, foodPieces, walls, this.position, this.size);
            this.ants[i].update(delta);
            if (wrap) {
                this.ants[i].wrapEdges(canvasWidth, canvasHeight);
            }
            else {
                this.ants[i].reflectEdges(canvasWidth, canvasHeight);
            }
            this.ants[i].draw(ctx, true);
        }
    }
    draw(context) {
        if (!work) {
            return;
        }
        context.beginPath();
        context.fillStyle = "red";
        context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        const divElement = document.getElementById('countCollected');
        divElement.innerHTML = `${this.foodCollected}`;
    }
}
//# sourceMappingURL=colony.js.map