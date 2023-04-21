import Pheromone from "./pheromone.js";
import { work } from "./script.js";
export default class Ant {
    constructor(currentX, currentY, angle, sizeAnts) {
        this.distanceView = 80;
        this.positionAnt = { x: currentX, y: currentY };
        this.prevPosition = { x: this.positionAnt.x, y: this.positionAnt.y };
        this.maxSpeeds = 80;
        this.angle = angle;
        this.moving = { x: this.maxSpeeds * Math.cos(this.angle), y: this.maxSpeeds * Math.sin(this.angle) };
        this.sizeAnt = sizeAnts;
        this.distanceView = 80;
        this.distanceViewPosition = { x: this.positionAnt.x + ((this.sizeAnt / 2 + this.distanceView)
                * Math.cos(this.angle)), y: this.positionAnt.y + ((this.sizeAnt / 2 + this.distanceView) * Math.sin(this.angle)) };
        this.bringFood = [];
        this.frames = 0;
    }
    get position() {
        return this.positionAnt;
    }
    get previousPosition() {
        return this.prevPosition;
    }
    get maxSpeed() {
        return this.maxSpeeds;
    }
    get dir() {
        return this.angle;
    }
    get velocity() {
        return this.moving;
    }
    get species() {
        return this.type;
    }
    get size() {
        return this.sizeAnt;
    }
    get viewRange() {
        return this.distanceView;
    }
    get viewRangePosition() {
        return this.distanceViewPosition;
    }
    get foodCarried() {
        return this.bringFood;
    }
    get frame() {
        return this.frames;
    }
    set position(positionAnt) {
        this.positionAnt.x = positionAnt.x;
        this.positionAnt.y = positionAnt.y;
    }
    set previousPosition(prevPosition) {
        this.prevPosition.x = prevPosition.x;
        this.prevPosition.y = prevPosition.y;
    }
    set maxSpeed(speed) {
        this.maxSpeeds = speed;
    }
    set dir(angle) {
        this.angle = angle;
    }
    set species(type) {
        this.type = type;
    }
    set velocity(moving) {
        this.moving.x = moving.x;
        this.moving.y = moving.y;
    }
    set size(sizeAnt) {
        this.sizeAnt = sizeAnt;
    }
    set viewRange(vr) {
        this.distanceView = vr;
    }
    set viewRangePosition(vrp) {
        this.distanceViewPosition.x = vrp.x;
        this.distanceViewPosition.y = vrp.y;
    }
    set foodCarried(bringFood) {
        this.bringFood = bringFood;
    }
    set frame(frames) {
        this.frames = frames;
    }
    // поведение муравья на границе canvas (изменяем позицию на противоположную)
    // UPD: на концах canvas добавлены границы
    wrapEdges(canvasWidth, canvasHeight) {
        if (this.positionAnt.x + this.sizeAnt > canvasWidth) {
            this.positionAnt.x = this.sizeAnt;
        }
        if (this.positionAnt.x - this.sizeAnt < 0) {
            this.positionAnt.x = canvasWidth - this.sizeAnt;
        }
        if (this.positionAnt.y + this.sizeAnt > canvasHeight) {
            this.positionAnt.y = this.sizeAnt;
        }
        if (this.positionAnt.y - this.sizeAnt < 0) {
            this.positionAnt.y = canvasHeight - this.sizeAnt;
        }
    }
    // отражаем муравья на границе canvas
    reflectEdges(canvasWidth, canvasHeight) {
        if (this.positionAnt.x + this.sizeAnt >= canvasWidth) {
            this.positionAnt.x = this.prevPosition.x;
            this.moving.x *= Math.random() - 1.0;
        }
        if (this.positionAnt.x - this.sizeAnt < 0) {
            this.positionAnt.x = this.prevPosition.x;
            this.moving.x *= Math.random() - 1.0;
        }
        if (this.positionAnt.y + this.sizeAnt >= canvasHeight) {
            this.positionAnt.y = this.prevPosition.y;
            this.moving.y *= Math.random() - 1.0;
        }
        if (this.positionAnt.y - this.sizeAnt < 0) {
            this.positionAnt.y = this.prevPosition.y;
            this.moving.y *= Math.random() - 1.0;
        }
        this.angle = Math.atan2(this.moving.y, this.moving.x);
    }
    calculateSpeed() {
        this.velocity = { x: this.maxSpeed * Math.cos(this.dir), y: this.maxSpeed * Math.sin(this.dir) };
    }
    // изменяем направление муравья
    flipDir() {
        this.velocity.x *= (Math.random() - 1.0);
        this.velocity.y *= (Math.random() - 1.0);
        this.dir = Math.atan2(this.velocity.y, this.velocity.x);
    }
    update(delta) {
        if (!delta) {
            return;
        }
        this.previousPosition = Object.assign({}, this.position);
        this.position.x += this.velocity.x / delta;
        this.position.y += this.velocity.y / delta;
        this.dir = Math.atan2(this.velocity.y, this.velocity.x);
        this.calculateSpeed();
        this.viewRangePosition.x = this.position.x + ((this.size / 2 + this.viewRange) * Math.cos(this.dir));
        this.viewRangePosition.y = this.position.y + ((this.size / 2 + this.viewRange) * Math.sin(this.dir));
        this.frame++;
    }
    updateFoodCarriedPosition() {
        this.foodCarried[0].position = { x: this.position.x +
                (this.size * Math.cos(this.dir)), y: this.position.y + (this.size * Math.sin(this.dir)) };
    }
    dropFood(food, foodPieces) {
        for (let i = 0; i < foodPieces.length; i++) {
            if (foodPieces[i] == food) {
                foodPieces.splice(i, 1);
                break;
            }
        }
        this.foodCarried = [];
    }
    getDistance(firstPosition, secondPosition) {
        return Math.sqrt((secondPosition.x - firstPosition.x) * (secondPosition.x - firstPosition.x) +
            (secondPosition.y - firstPosition.y) * (secondPosition.y - firstPosition.y));
    }
    findInRangePheromones(pheromones) {
        const temp = [];
        for (let i = 0; i < pheromones.length; i++) {
            if (this.getDistance(this.viewRangePosition, pheromones[i].position) < this.viewRange) {
                temp.push(pheromones[i]);
            }
        }
        return temp;
    }
    findWeakestPheromone(pheromones) {
        const temp = this.findInRangePheromones(pheromones);
        if (temp.length > 0) {
            let weakest = pheromones[0].originalLife + 1;
            let weakestPheromone = pheromones[0];
            for (let i = 1; i < temp.length; i++) {
                if (temp[i].life < weakest) {
                    weakest = temp[i].life;
                    weakestPheromone = temp[i];
                }
            }
            return weakestPheromone;
        }
        return undefined;
    }
    findStrongestPheromone(pheromones) {
        let temp = this.findInRangePheromones(pheromones);
        if (temp.length > 0) {
            let strongest = -1;
            let strongestPheromone = pheromones[0];
            for (let i = 1; i < temp.length; i++) {
                if (temp[i].life > strongest) {
                    strongest = temp[i].life;
                    strongestPheromone = temp[i];
                }
            }
            return strongestPheromone;
        }
        return undefined;
    }
    direction(pos) {
        if (pos != undefined) {
            this.dir = Math.atan2(pos.y - this.position.y, pos.x - this.position.x);
            this.calculateSpeed();
        }
    }
    // столкновение с едой
    checkFoodCollision(food) {
        let distanceToFood = this.getDistance(this.position, food.position);
        if (distanceToFood <= (food.size + this.size * 1.25) && !food.pickedUp) {
            if (this.foodCarried.length === 0) {
                food.pickedUp = true;
                this.foodCarried.push(food);
                return true;
            }
        }
        return false;
    }
    // столкновение с колонией
    checkColonyCollision(foodPieces, colonyPos, colonySize) {
        let distanceToColony = this.getDistance(this.position, colonyPos);
        if (distanceToColony <= (this.size + colonySize)) {
            this.dropFood(this.foodCarried[0], foodPieces);
            return true;
        }
        return false;
    }
    // муравей и стены столкнулись ли
    intersects(wall) {
        let collision = false;
        let dx = Math.abs(this.position.x - (wall.position.x + wall.width / 2));
        let dy = Math.abs(this.position.y - (wall.position.y + wall.height / 2));
        if (dx > wall.width / 2 + this.size) {
            return [false];
        }
        if (dy > wall.height / 2 + this.size) {
            return [false];
        }
        let cornerDistanceSq = Math.pow(dx - wall.width / 2, 2) + Math.pow(dy - wall.height / 2, 2);
        if (cornerDistanceSq <= (this.size * this.size)) {
            collision = true;
        }
        if (dx <= (wall.width / 2)) {
            collision = true;
        }
        if (dy <= (wall.height / 2)) {
            collision = true;
        }
        let sides = [];
        if (this.position.x < wall.position.x) {
            sides.push(0);
        }
        else if (this.position.x > wall.position.x + wall.width) {
            sides.push(1);
        }
        if (this.position.y < wall.position.y) {
            sides.push(2);
        }
        else if (this.position.y > wall.position.y + wall.height) {
            sides.push(3);
        }
        return [collision, sides];
    }
    // муравей и стены обработка
    handleWallCollision(walls) {
        for (let i = 0; i < walls.length; i++) {
            let collision = this.intersects(walls[i]);
            if (collision[0]) {
                let sides = collision[1];
                for (let j = 0; j < sides.length; j++) {
                    if (sides[j] === 0 || sides[j] === 1) {
                        this.velocity.x *= (Math.random() - 1.0);
                        this.position.x = this.previousPosition.x;
                    }
                    if (sides[j] === 2 || sides[j] === 3) {
                        this.velocity.y *= (Math.random() - 1.0);
                        this.position.y = this.previousPosition.y;
                    }
                }
                this.dir = Math.atan2(this.velocity.y, this.velocity.x);
                break;
            }
        }
    }
    randomWalk() {
        let randomWalkAmount = 0.02;
        let randomWalk = (Math.random() <= 0.5 ? randomWalkAmount : -1 * randomWalkAmount);
        this.dir += randomWalk;
        this.calculateSpeed();
    }
    walkAnt(foodPheromones, homePheromones, foodPieces, walls, colonyPos, colonySize) {
        let foodDropped = 0;
        if (this.foodCarried.length === 0) {
            if (this.frame != 0 && this.frame % 60 == 0) {
                homePheromones.push(new Pheromone(this.position.x, this.position.y, true, this.species));
            }
            let foodInRange = false;
            for (let i = 0; i < foodPieces.length; i++) {
                let vrDist = this.getDistance(this.viewRangePosition, foodPieces[i].position);
                if (this.foodCarried.length > 0) {
                    break;
                }
                else if (vrDist < this.viewRange + foodPieces[i].size && !foodPieces[i].pickedUp) {
                    foodInRange = true;
                    if (this.checkFoodCollision(foodPieces[i])) {
                        this.flipDir();
                        break;
                    }
                    this.direction(foodPieces[i].position);
                }
            }
            if (!foodInRange) {
                let bestFood = this.findStrongestPheromone(foodPheromones);
                if (bestFood != undefined) {
                    this.direction(bestFood.position);
                }
                else {
                    this.randomWalk();
                }
            }
        }
        else {
            this.updateFoodCarriedPosition();
            if (this.frame != 0 && this.frame % 60 == 0) {
                foodPheromones.push(new Pheromone(this.position.x, this.position.y, false, this.species));
            }
            let colonyInRange = false;
            let vrDist = this.getDistance(this.viewRangePosition, colonyPos);
            if (vrDist < this.viewRange + colonySize) {
                colonyInRange = true;
                this.direction(colonyPos);
                if (this.checkColonyCollision(foodPieces, colonyPos, colonySize)) {
                    this.flipDir();
                    foodDropped += 1;
                }
            }
            if (!colonyInRange) {
                let bestHome = this.findWeakestPheromone(homePheromones);
                if (bestHome != undefined) {
                    this.direction(bestHome.position);
                }
                else {
                    this.randomWalk();
                }
            }
        }
        this.handleWallCollision(walls);
        return foodDropped;
    }
    draw(ctx, showViewRange) {
        if (!work) {
            return;
        }
        ctx.beginPath();
        ctx.fillStyle = "brown";
        ctx.arc(this.position.x - this.size * 1.75 * Math.cos(this.dir), this.position.y - this.size * 1.75 * Math.sin(this.dir), this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        // голова муравья
        ctx.beginPath();
        ctx.fillStyle = "brown";
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        // туловище муравья
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.position.x + (3 * this.size) / 5 * Math.cos(this.dir), this.position.y - (3 * this.size) / 5 * Math.sin(this.dir), 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.position.x - (3 * this.size) / 5 * Math.cos(this.dir), this.position.y + (3 * this.size) / 5 * Math.sin(this.dir), 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        if (showViewRange) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
            ctx.arc(this.viewRangePosition.x, this.viewRangePosition.y, this.viewRange, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }
}
//# sourceMappingURL=ants.js.map