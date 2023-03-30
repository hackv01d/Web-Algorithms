export { };
export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  getCoords() {
    return { x: this.x, y: this.y };
  }
  setCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(point: Point) {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
}


