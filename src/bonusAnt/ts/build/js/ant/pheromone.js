export default class Pheromone {
    constructor(currentX, currentY, home, type) {
        this.sizePheromone = 3;
        this.remainTime = 15.0;
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
    set life(time) {
        this.remainTime = time;
    }
    update(delta) {
        this.life -= 1 / delta;
    }
    draw(context) {
        context.beginPath();
        if (this.toHome) {
            context.fillStyle = `rgba(0, 0, 255, ${this.life / this.originalLife})`;
        }
        else {
            context.fillStyle = `rgba(255, 0, 0, ${this.life / this.originalLife})`;
        }
        context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}
//# sourceMappingURL=pheromone.js.map