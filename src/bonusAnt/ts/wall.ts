import { Point } from "./types/point.js";


export default class Wall {
    public position: Point;
    public width: number;
    public height: number;
  
    constructor(coordinateX: number, coordinateY: number, currentWidth: number, currentHeight: number) {
      this.position = { x: coordinateX, y: coordinateY };
      this.width = currentWidth;
      this.height = currentHeight;
    }

    public draw(context: CanvasRenderingContext2D) {
      context.beginPath();
      context.fillStyle = "#8B4513";
      context.rect(this.position.x, this.position.y, this.width, this.height);
      context.fill();
      context.closePath();
    }
}
