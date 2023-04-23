var _a, _b, _c;
import Colony from "./colony.js";
import Wall from "./wall.js";
import Food from "./food.js";
import { maze, generateMap } from "./map.js";
export let canvas = document.getElementById("canvasBonusAnt");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight * 0.7;
export let work = false;
let wallSize = 3;
let walls = [];
let foods = [];
let lastTime = 0.0;
let countClickedFood = 60;
let foodSpawnRange = 30;
let countAnts = 50;
let x, y;
let colony;
generateLabyrinth();
function generateLabyrinth() {
    generateMap();
    walls = [];
    wallSize = 3;
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 0) {
                walls.push(new Wall(j * wallSize * 10, i * wallSize * 10, wallSize * 10, wallSize * 10));
            }
        }
    }
    drawWalls();
    wallSize = 25;
}
const mouse = {
    x: null,
    y: null,
};
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth * 0.6;
    ;
    canvas.height = window.innerHeight * 0.7;
});
window.addEventListener('click', function (event) {
    const canvasBounds = canvas.getBoundingClientRect();
    mouse.x = event.pageX - canvasBounds.left;
    mouse.y = event.pageY - canvasBounds.top;
    if (colony === undefined) {
        return;
    }
    if ((event.shiftKey) && (isExistWall(mouse) !== undefined)) {
        let wall = isExistWall(mouse);
        walls.splice(wall, 1);
    }
    else if (work) {
        spreadFoodAtLocation(mouse);
    }
});
function clearEvery() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    walls = [];
    foods = [];
    colony = null;
    work = false;
}
function setColony() {
    canvas.addEventListener("click", function (event) {
        const canvasBounds = canvas.getBoundingClientRect();
        x = event.clientX - canvasBounds.left;
        y = event.clientY - canvasBounds.top;
    });
}
(_a = document.getElementById("Clear")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", clearEvery);
(_b = document.getElementById("Set")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", setColony);
(_c = document.getElementById("Create")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", generateLabyrinth);
function setup() {
    //generateLabyrinth();
    colony = new Colony(x, y, countAnts, 30);
    // размер муравья
    colony.makeColonyAnts(6);
    work = true;
    launchAnimation(0);
}
function isExistWall(place) {
    if (walls.length > 0) {
        for (let i = 0; i < walls.length; i++) {
            let dx = place.x - walls[i].position.x - walls[i].width / 2;
            let dy = place.y - walls[i].position.y - walls[i].height / 2;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let side = (walls[i].width < walls[i].height) ? walls[i].width : walls[i].height;
            if (dist < side) {
                return i;
            }
        }
    }
    return undefined;
}
function getRandomNumber() {
    return Math.floor(Math.random() * (foodSpawnRange * 2)) - foodSpawnRange;
}
function spreadFoodAtLocation(place) {
    for (let i = 0; i < countClickedFood; i++) {
        let probablyX = place.x + getRandomNumber();
        let probablyY = place.y + getRandomNumber();
        if ((probablyX > 0) && (probablyX < canvas.width) && (probablyY > 0) && (probablyY < canvas.height)) {
            foods.push(new Food(probablyX, probablyY));
        }
    }
}
function drawWalls() {
    for (let i = 0; i < walls.length; i++) {
        walls[i].draw(context);
    }
}
function drawFood() {
    for (let i = 0; i < foods.length; i++) {
        foods[i].draw(context);
    }
}
// анимация алгоритма с муравьями
function launchAnimation(currentTime) {
    // разница между текущим и предыдущим кадром
    let difference = currentTime - lastTime;
    lastTime = currentTime;
    context.clearRect(0, 0, canvas.width, canvas.height);
    colony.update(difference, canvas.width, canvas.height, context, foods, walls, true);
    drawFood();
    colony.draw(context);
    drawWalls();
    // для получения нового кадра анимации
    requestAnimationFrame(launchAnimation);
}
function isValidCount(count) {
    if (count >= 1 && count <= 200) {
        countAnts = count;
    }
}
function isValidnumFood(count) {
    if (count >= 10 && count <= 250) {
        countClickedFood = count;
    }
}
function isValidfoodSpawnRange(count) {
    if (count >= 1 && count <= 60) {
        foodSpawnRange = count;
    }
}
document.getElementById('Build').addEventListener('click', setup);
const countSendDiapason = document.getElementById("countSendDiapason");
countSendDiapason.addEventListener("input", () => {
    isValidCount(countSendDiapason.valueAsNumber);
});
const numFoodDiapason = document.getElementById("numFoodDiapason");
numFoodDiapason.addEventListener("input", () => {
    isValidnumFood(numFoodDiapason.valueAsNumber);
});
const foodSpawnDiapason = document.getElementById("foodSpawnDiapason");
foodSpawnDiapason.addEventListener("input", () => {
    isValidfoodSpawnRange(foodSpawnDiapason.valueAsNumber);
});
drawWalls();
//# sourceMappingURL=script.js.map