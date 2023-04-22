import Ant from './ants.js';
import Pheromone from './pheromone.js';
import { Point } from './types/point.js';
import Wall from './wall.js';
import Food from './food.js';
import { work } from './script.js';


export default class Colony {
  private positionColony: Point;
  private numAntsColony: number;
  private antsColony: Ant[] = [];
  private homePheromones: Pheromone[] = [];
  private foodPheromones: Pheromone[] = [];
  private sizeColony: number;
  private collectFood: number = 0;

  constructor(placeX: number, placeY: number, numAnts: number, colonySize: number) {
    this.positionColony = {x: placeX, y: placeY};
    this.numAntsColony = numAnts;
    this.sizeColony = colonySize;
  }


  get position(): Point {
    return this.positionColony;
  }

  get numAnts(): number {
    return this.numAntsColony;
  }

  get ants(): Ant[] {
    return this.antsColony;
  }

  get toHomePheromones(): Pheromone[] {
    return this.homePheromones;
  }

  get toFoodPheromones(): Pheromone[] {
    return this.foodPheromones;
  }

  get size(): number {
    return this.sizeColony;
  }

  get foodCollected(): number {
    return this.collectFood;
  }

  set position(positionColony: Point) {
    this.positionColony.x = positionColony.x;
    this.positionColony.y = positionColony.y;
  }

  set numAnts(numAntsColony: number) {
    this.numAntsColony = numAntsColony;
  }

  set ants(antsColony: Ant[]) {
    this.antsColony = antsColony;
  }

  set toHomePheromones(homePheromones: Pheromone[]) {
    this.homePheromones = homePheromones;
  }

  set toFoodPheromones(foodPheromones: Pheromone[]) {
    this.foodPheromones = foodPheromones;
  }

  set size(sizeColony: number) {
    this.sizeColony = sizeColony;
  }

  set foodCollected(collectFood: number) {
    this.collectFood = collectFood;
  }

  // создаем муравьев и ставим их по кругу
  makeColonyAnts(antSize: number): void {
    const dirIncr = (Math.PI * 2) / this.numAnts;

    for (let i = 0; i < this.numAnts; i++) {
      const dir = (i + 1) * dirIncr;
      const ax = this.position.x + this.size * Math.cos(dir);
      const ay = this.position.y + this.size * Math.sin(dir);

      this.ants.push(new Ant(ax, ay, dir, antSize));
    }
  }

  update(delta: number, canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D, foodPieces: Food[], walls: Wall[], wrap: boolean): void {
    for (let i = 0; i < this.toFoodPheromones.length; i++){
      this.toFoodPheromones[i].update(delta);
      this.toFoodPheromones[i].draw(ctx);
      if (this.toFoodPheromones[i].life < 0) {
          this.toFoodPheromones.splice(i, 1);
          i--;
      }
    }

    for (let i = 0; i < this.toHomePheromones.length; i++){
      this.toHomePheromones[i].update(delta);
      this.toHomePheromones[i].draw(ctx);
      if (this.toHomePheromones[i].life < 0) {
          this.toHomePheromones.splice(i, 1);
          i--;
      }
    }

    for (let i = 0; i < this.ants.length; i++){
      this.foodCollected += this.ants[i].walkAnt(this.toFoodPheromones, this.toHomePheromones, foodPieces, walls, this.position, this.size);
      this.ants[i].update(delta);

      if (wrap) {
          this.ants[i].wrapEdges(canvasWidth, canvasHeight);
      } else {
          this.ants[i].reflectEdges(canvasWidth, canvasHeight);
      }
      this.ants[i].draw(ctx, true);
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    if (!work) {
      return;
    }

    context.beginPath();
    context.fillStyle = "red";
    context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
      
    const divElement: HTMLElement = document.getElementById('countCollected')!;
    divElement.innerHTML = `${this.foodCollected}`;
  }
}