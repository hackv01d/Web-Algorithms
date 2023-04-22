import { Point } from "./types/point.js";


export default class Pheromone {
    private keepPosition: Point;
    private sizePheromone: number = 3;
    private isHome: boolean;
    private typePheromone: string;
    private remainTime: number = 15.0;
    private currentTime: number;
  
  
    constructor(currentX: number, currentY: number, home: boolean, type: string) {
      this.keepPosition = { x: currentX, y: currentY };
      this.isHome = home;
      this.typePheromone = type;
      this.currentTime = this.remainTime;
    }
  
    get position() {
      return this.keepPosition;
    }
  
    get size() {
      return this.sizePheromone;
    }
  
    get toHome() {
      return this.isHome;
    }
  
    get life() {
      return this.remainTime;
    }
  
    get originalLife() {
      return this.currentTime;
    }
  
    set life(time: number) {
      this.remainTime = time;
    }
  
    update(delta: number) {
      this.life -= 1 / delta;
    }
  
    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        if (this.toHome) {
            context.fillStyle = `rgba(0, 0, 255, ${this.life / this.originalLife})`;
        } else {
            context.fillStyle = `rgba(255, 0, 0, ${this.life / this.originalLife})`;
        }
        context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}
