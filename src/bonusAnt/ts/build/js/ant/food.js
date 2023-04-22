export default class Food {
    constructor(placeX, placeY) {
        this.foodSize = 5;
        this.picked = false;
        this.positionFood = { x: placeX, y: placeY };
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
    set position(place) {
        this.positionFood.x = place.x;
        this.positionFood.y = place.y;
    }
    set size(currentSize) {
        this.foodSize = currentSize;
    }
    set pickedUp(isPicked) {
        this.picked = isPicked;
    }
    draw(context) {
        context.beginPath();
        context.fillStyle = "green";
        context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}
//# sourceMappingURL=food.js.map