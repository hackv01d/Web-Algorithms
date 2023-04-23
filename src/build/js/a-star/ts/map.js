import { SetupCellType } from "./enums/setupCellType.js";
import { EditCellMode } from "./enums/editCellMode.js";
import { Direction } from "./enums/direction.js";
import { animBackgroundCell } from "./animation.js";
import { removeClassFromAllCells } from "./utils/cellUtils.js";
import { disableButtons, enableButtons } from "./utils/buttonUtils.js";
import { graph, aStar, allOptionButtons } from "./main.js";
export class Map {
    constructor(elementMap, size, speedAnim) {
        this.size = size;
        this.speedAnim = speedAnim;
        this.elementMap = elementMap;
        this.setup();
    }
    endShowingSearch() {
        enableButtons(allOptionButtons);
    }
    beginShowingSearch() {
        disableButtons(allOptionButtons);
        aStar.search();
    }
    reset() {
        this.clear();
        graph.clearMatrix();
    }
    updateSpeedAnim(speed) {
        this.speedAnim = speed;
    }
    updateSize(newSize) {
        graph.updateSize(newSize);
        graph.setDefaultStartAndGoal();
        this.size = newSize;
        this.setup();
    }
    updateEditMapMode(mode) {
        this.editMapMode = mode;
    }
    removeWallFromMap(point, type = SetupCellType.clear) {
        this.elementMap.rows[point.y].cells[point.x].className = type;
    }
    async updateCellAppearance(point, color) {
        const cell = this.elementMap.rows[point.y].cells[point.x];
        await animBackgroundCell(cell, color, this.speedAnim);
    }
    generateMap() {
        for (let i = 0; i < this.size; i++) {
            for (let q = 0; q < this.size; q++) {
                const cell = this.elementMap.rows[i].cells[q];
                cell.className = SetupCellType.wall;
                graph.addWall({ x: q, y: i });
            }
        }
        let x = 1;
        let y = 1;
        while (x % 2 != 0 || y % 2 != 0) {
            if (x % 2 != 0)
                x = this.getRandomNum(this.size);
            if (y % 2 != 0)
                y = this.getRandomNum(this.size);
        }
        const point = { x: x, y: y };
        graph.removeWall(point);
        this.removeWallFromMap(point);
        const walls = [];
        if (point.y - 2 >= 0)
            walls.push({ x: point.x, y: point.y - 2 });
        if (point.y + 2 < this.size)
            walls.push({ x: point.x, y: point.y + 2 });
        if (point.x - 2 >= 0)
            walls.push({ x: point.x - 2, y: point.y });
        if (point.x + 2 < this.size)
            walls.push({ x: point.x + 2, y: point.y });
        while (walls.length > 0) {
            const index = this.getRandomNum(walls.length);
            const cell = walls[index];
            const x = cell.x;
            const y = cell.y;
            if (this.isAvailableCell(cell)) {
                walls.splice(index, 1);
                continue;
            }
            this.removeWallFromMap(cell);
            graph.removeWall(cell);
            walls.splice(index, 1);
            let directions = [Direction.up, Direction.down, Direction.left, Direction.right];
            while (directions.length > 0) {
                const index = this.getRandomNum(directions.length);
                switch (directions[index]) {
                    case Direction.up:
                        if (y - 2 >= 0 && this.isAvailableCell({ x: x, y: y - 2 })) {
                            graph.removeWall({ x: x, y: y - 1 });
                            this.removeWallFromMap({ x: x, y: y - 1 });
                            directions.splice(0, directions.length);
                        }
                        break;
                    case Direction.down:
                        if (y + 2 < this.size && this.isAvailableCell({ x: x, y: y + 2 })) {
                            graph.removeWall({ x: x, y: y + 1 });
                            this.removeWallFromMap({ x: x, y: y + 1 });
                            directions.splice(0, directions.length);
                        }
                        break;
                    case Direction.left:
                        if (x - 2 >= 0 && this.isAvailableCell({ x: x - 2, y: y })) {
                            graph.removeWall({ x: x - 1, y: y });
                            this.removeWallFromMap({ x: x - 1, y: y });
                            directions.splice(0, directions.length);
                        }
                        break;
                    case Direction.right:
                        if (x + 2 < this.size && this.isAvailableCell({ x: x + 2, y: y })) {
                            graph.removeWall({ x: x + 1, y: y });
                            this.removeWallFromMap({ x: x + 1, y: y });
                            directions.splice(0, directions.length);
                        }
                        break;
                }
                directions.splice(index, 1);
            }
            if (y - 2 >= 0 && !this.isAvailableCell({ x: x, y: y - 2 })) {
                walls.push({ x: x, y: y - 2 });
            }
            if (x + 2 < this.size && !this.isAvailableCell({ x: x + 2, y: y })) {
                walls.push({ x: x + 2, y: y });
            }
            if (y + 2 < this.size && !this.isAvailableCell({ x: x, y: y + 2 })) {
                walls.push({ x: x, y: y + 2 });
            }
            if (x - 2 >= 0 && !this.isAvailableCell({ x: x - 2, y: y })) {
                walls.push({ x: x - 2, y: y });
            }
        }
        this.removeWallFromMap(graph.startVertex.point, SetupCellType.start);
        this.removeWallFromMap(graph.goalVertex.point, SetupCellType.goal);
        graph.removeWallFromStart();
        graph.removeWallFromGoal();
    }
    isAvailableCell(point) {
        return graph.isAvailableAt(point);
    }
    getRandomNum(limit) {
        return Math.floor(Math.random() * limit);
    }
    isUnavailableCellForEdit(type, className) {
        switch (type) {
            case SetupCellType.start:
                return (className === SetupCellType.goal || className === SetupCellType.wall);
            case SetupCellType.goal:
                return (className === SetupCellType.start || className === SetupCellType.wall);
            case SetupCellType.wall:
                return (className === SetupCellType.start || className === SetupCellType.goal);
            case SetupCellType.clear:
                return false;
        }
    }
    clear() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.elementMap.rows[i].cells[j];
                if (j === graph.startVertex.point.x && i === graph.startVertex.point.y) {
                    cell.className = SetupCellType.start;
                }
                else if (j === graph.goalVertex.point.x && i === graph.goalVertex.point.y) {
                    cell.className = SetupCellType.goal;
                }
                else {
                    cell.className = SetupCellType.clear;
                }
            }
        }
    }
    setup() {
        this.elementMap.innerHTML = "";
        for (let i = 0; i < this.size; i++) {
            const row = document.createElement('tr');
            this.elementMap.appendChild(row);
            for (let q = 0; q < this.size; q++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${i}-${q}`);
                cell.addEventListener('click', () => this.update(cell));
                if (i == graph.startVertex.point.y && q == graph.startVertex.point.x) {
                    cell.className = SetupCellType.start;
                }
                else if (i == graph.goalVertex.point.y && q == graph.goalVertex.point.x) {
                    cell.className = SetupCellType.goal;
                }
                else {
                    cell.className = SetupCellType.clear;
                }
                row.appendChild(cell);
            }
        }
    }
    update(cell) {
        let className = cell.className;
        const location = { x: Number(cell.id.split('-')[1]),
            y: Number(cell.id.split('-')[0]) };
        switch (this.editMapMode) {
            case EditCellMode.start:
                if (this.isUnavailableCellForEdit(SetupCellType.start, className))
                    return;
                graph.updateStart(location);
                removeClassFromAllCells(SetupCellType.start, this.elementMap);
                cell.className = SetupCellType.start;
                break;
            case EditCellMode.goal:
                if (this.isUnavailableCellForEdit(SetupCellType.goal, className))
                    return;
                graph.updateGoal(location);
                removeClassFromAllCells(SetupCellType.goal, this.elementMap);
                cell.className = SetupCellType.goal;
                break;
            case EditCellMode.wall:
                if (this.isUnavailableCellForEdit(SetupCellType.wall, className))
                    return;
                graph.toggleWall(location);
                className === SetupCellType.wall
                    ? cell.className = SetupCellType.clear
                    : cell.className = SetupCellType.wall;
                break;
        }
    }
}
//# sourceMappingURL=map.js.map