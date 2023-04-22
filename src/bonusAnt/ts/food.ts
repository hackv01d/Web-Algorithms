import { Point } from "./types/point.js";


export default class Food {
    private positionFood: Point;
    private foodSize: number = 5;
    private picked: boolean = false;

    constructor(placeX: number, placeY: number) {
        this.positionFood = {x: placeX, y: placeY};
    }
    
    get position() {
        return this.positionFood;
    }
    
    get size() {
        return this.foodSize;
    }
    
    get pickedUp() {
        return this.picked;
    }

    // муравей может нести еду
    set position(place: Point) {
        this.positionFood.x = place.x;
        this.positionFood.y = place.y;
    }
    
    set size(currentSize: number) {
        this.foodSize = currentSize;
    }
    
    set pickedUp(isPicked: boolean) {
        this.picked = isPicked;
    }
    
    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = "green";
        context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}
