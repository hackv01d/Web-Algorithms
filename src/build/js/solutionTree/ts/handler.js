import { Tree } from "./tree.js";
import { parseData } from "./parseData.js";
class TreeEventHandler {
    constructor() {
        this.baseColor = "red";
        this.treeColors = new Map([
            ["main", "#CA4557"],
            ["way", "#1C94C4"],
            ["answer", "#2CB63E"],
            ["mistake", "red"],
            ["correct", "green"]
        ]);
        this.errorTexts = new Map([
            ["children", "Ошибка, введите корректный путь"],
            ["matrix", "Ошибка, проверьте длину введённых данных "],
            ["shortPath", "Ошибка, длина искомого пути слишком короткая или неверная"]
        ]);
        this.treeInput = document.getElementById("create-tree-area");
        this.ansInput = document.getElementById("find-way-area");
        this.separator = document.getElementById('separator');
        this.answer = document.getElementById("container__answer");
        this.treeContainer = document.getElementById('tree');
        this.createTreeBtn = document.getElementById("create-tree-button");
        this.getAnswerBtn = document.getElementById("create-answer-button");
        this.clearTreeTextBtn = document.getElementById("clear-tree-button");
        this.clearAnswerBtn = document.getElementById("clear-answer-button");
        this.clearAllBtn = document.getElementById("clear-all-button");
        this.tree = undefined;
        this.parser = new parseData(this.treeInput, this.ansInput, this.separator.value);
        this.markedPath = [];
        this.createTreeBtn.addEventListener("click", this.createTree.bind(this));
        this.getAnswerBtn.addEventListener("click", async () => {
            this.showWay();
        });
        this.clearTreeTextBtn.addEventListener("click", () => {
            this.treeInput.value = "";
        });
        this.clearAnswerBtn.addEventListener("click", () => {
            this.ansInput.value = "";
        });
        this.clearAllBtn.addEventListener("click", () => {
            this.treeInput.value = "";
            this.ansInput.value = "";
            this.treeContainer.innerHTML = "";
        });
    }
    createTree() {
        this.treeContainer.innerHTML = "";
        const matrix = this.parser.getInputDataMatrix();
        if (matrix.length <= 1) {
            this.changeAnswer(this.treeColors.get("mistake") || "red", this.errorTexts.get("children") || "Неизвестная ошибка");
        }
        else if (!this.isMatrixCorrect(matrix)) {
            this.changeAnswer(this.treeColors.get("mistake") || "red", this.errorTexts.get("matrix") || "Неизвестная ошибка");
        }
        else {
            this.tree = new Tree(matrix);
            this.answer.textContent = "";
            if (this.tree.rootNode !== undefined) {
                this.renderTree(this.tree.rootNode);
            }
        }
    }
    async showWay() {
        const row = this.parser.getOutputDataRow();
        if (this.tree !== undefined && this.tree !== null && this.tree.rootNode !== undefined) {
            const answerPath = this.tree.traverseDecisionTree(this.tree.rootNode, row, []);
            if (!this.isEqual(this.markedPath, answerPath)) {
                if (this.markedPath.length > 0) {
                    await this.clearOldWay(this.treeContainer.querySelector('ul'), 1);
                }
                if (answerPath.length > 0) {
                    this.changeAnswer(this.treeColors.get("correct") || "green", "");
                    this.buildPath(answerPath);
                }
                else {
                    this.changeAnswer(this.treeColors.get("mistake") || "red", this.errorTexts.get("path") || "Неизвестная ошибка");
                }
            }
            else {
                this.changeAnswer(this.treeColors.get("mistake") || "red", this.errorTexts.get("path") || "Неизвестная ошибка");
            }
        }
    }
    getNodeValue(node) {
        if (node.value !== undefined && node.value !== null) {
            return String(node.value);
        }
        else {
            return String(node.attribute) || "";
        }
    }
    renderTree(node) {
        const buildTree = this.createTreeElement(node);
        this.treeContainer.appendChild(buildTree);
    }
    createTreeElement(node) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = this.getNodeValue(node);
        li.appendChild(link);
        if (node.children.length > 0) {
            const ul = document.createElement("ul");
            node.children.forEach((child) => {
                if (child !== undefined) {
                    ul.appendChild(this.createTreeElement(child));
                }
            });
            li.appendChild(ul);
        }
        return li;
    }
    buildPath(answerPath) {
        this.markedPath = [...answerPath];
        if (this.treeContainer.querySelector('ul') !== null) {
            this.coloringWay(answerPath, this.treeContainer.querySelector('ul'), 1);
        }
    }
    async coloringWay(answerPath, container, index) {
        if (container === null) {
            return;
        }
        if (index === 1) {
            await this.delay(200);
            const link = this.treeContainer.querySelector('a');
            if (link !== null) {
                link.style.color = this.treeColors.get("way") || "red";
            }
        }
        const elements = container.children;
        if (index === answerPath.length - 1) {
            await this.delay(200);
            const link = container.querySelector('a');
            if (link !== null) {
                link.style.color = this.treeColors.get("answer") || "red";
            }
            return;
        }
        for (const element of elements) {
            const link = element.querySelector('a');
            if (link !== null) {
                const constElementUl = element.querySelector('ul');
                if (String(link.textContent) === String(answerPath[index])) {
                    await this.delay(200);
                    link.style.color = this.treeColors.get("way") || "red";
                    await this.coloringWay(answerPath, constElementUl, ++index);
                }
            }
        }
    }
    async clearOldWay(container, index) {
        if (container === null) {
            return;
        }
        if (index === 1) {
            await this.delay(200);
            const link = this.treeContainer.querySelector('a');
            if (link !== null) {
                link.style.color = this.treeColors.get("main") || "red";
            }
        }
        const elements = container.children;
        if (index === this.markedPath.length - 1) {
            await this.delay(300);
            const link = container.querySelector('a');
            if (link !== null) {
                link.style.color = this.treeColors.get("main") || "red";
            }
            return;
        }
        for (const element of elements) {
            const link = element.querySelector('a');
            const constElementUl = element.querySelector('ul');
            if (link !== null && String(link.textContent) === String(this.markedPath[index])) {
                await this.delay(200);
                if (link !== null) {
                    link.style.color = this.treeColors.get("main") || "red";
                }
                await this.clearOldWay(constElementUl, ++index);
            }
        }
    }
    delay(ms) {
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, ms);
        });
    }
    isEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        else {
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i])
                    return false;
            }
            return true;
        }
    }
    isMatrixCorrect(matrix) {
        const correctLength = matrix[0].length;
        for (const row of matrix) {
            if (row.length !== correctLength) {
                return false;
            }
        }
        return true;
    }
    changeAnswer(color, value) {
        this.answer.style.color = color;
        this.answer.textContent = value;
    }
}
const decisionTree = new TreeEventHandler();
//# sourceMappingURL=handler.js.map