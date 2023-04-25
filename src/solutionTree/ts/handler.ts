import { Tree, TreeNode } from "./tree.js";
import { parseData } from "./parseData.js";

class TreeEventHandler {
  private treeInput: HTMLInputElement;
  private ansInput: HTMLInputElement;
  private separator: HTMLSelectElement;
  private answer: HTMLElement;
  private treeContainer: HTMLElement;

  private createTreeBtn: HTMLButtonElement;
  private getAnswerBtn: HTMLButtonElement;
  private clearTreeTextBtn: HTMLButtonElement;
  private clearAnswerBtn: HTMLButtonElement;
  private clearAllBtn: HTMLButtonElement;



  private readonly treeColors = new Map([
    ["main", "#CA4557"],
    ["way", "#1C94C4"],
    ["answer", "#2CB63E"],
    ["mistake", "red"],
    ["correct", "green"]
  ]);


  private readonly errorTexts = new Map([
    ["children", "Ошибка, введите корректный путь"],
    ["matrix", "Ошибка, проверьте длину введённых данных "],
    ["shortPath", "Ошибка, длина искомого пути слишком короткая или неверная"],
    ["emptyTree", "Ошибка, дерево отсутсвует"]
  ]);

  private tree?: Tree;
  private parser: parseData;
  private markedPath: (string | number)[];


  constructor() {
    this.treeInput = document.getElementById("create-tree-area") as HTMLInputElement;
    this.ansInput = document.getElementById("find-way-area") as HTMLInputElement;
    this.separator = document.getElementById('separator') as HTMLSelectElement;
    this.answer = document.getElementById("container__answer") as HTMLElement;
    this.treeContainer = document.getElementById('tree') as HTMLElement;

    this.createTreeBtn = document.getElementById("create-tree-button") as HTMLButtonElement;
    this.getAnswerBtn = document.getElementById("create-answer-button") as HTMLButtonElement;
    this.clearTreeTextBtn = document.getElementById("clear-tree-button") as HTMLButtonElement;
    this.clearAnswerBtn = document.getElementById("clear-answer-button") as HTMLButtonElement;
    this.clearAllBtn = document.getElementById("clear-all-button") as HTMLButtonElement;

    this.tree = undefined;
    this.parser = new parseData(this.treeInput, this.ansInput, this.separator.value);
    this.markedPath = [];

    this.createTreeBtn.addEventListener("click", this.createTree.bind(this));


    this.getAnswerBtn.addEventListener("click", async () => {
      if (this.markedPath.length === 0){
        this.showErrorPath(this.treeColors.get("mistake") || "red", this.errorTexts.get("emptyTree") || "Неизвестная ошибка");
      }
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


  private createTree() {
    this.treeContainer.innerHTML = "";
    const matrix: (number | string)[][] = this.parser.getInputDataMatrix();
    if (matrix.length <= 1) {

      this.showErrorMatrix(this.treeColors.get("mistake") || "red", this.errorTexts.get("children") || "Неизвестная ошибка");
    } else if (!this.isMatrixCorrect(matrix)) {
      this.showErrorMatrix(this.treeColors.get("mistake") || "red", this.errorTexts.get("matrix") || "Неизвестная ошибка");
    } else {
      this.tree = new Tree(matrix);
      this.answer.textContent = "";
      if (this.tree.rootNode !== undefined) {
        this.renderTree(this.tree.rootNode);
      }
    }
  }

  private async showWay() {
    const row: (string | number)[] = this.parser.getOutputDataRow();
    if (this.tree !== undefined && this.tree !== null && this.tree.rootNode !== undefined) {
      const answerPath = this.tree.traverseDecisionTree(this.tree.rootNode, row, []);

      if (!this.isEqual(this.markedPath, answerPath)) {
        if (this.markedPath.length > 0) {
          await this.clearOldWay(this.treeContainer.querySelector('ul'), 1);
        }
        if (answerPath.length > 0) {
          this.buildPath(answerPath);
        } else {
          this.showErrorPath(this.treeColors.get("mistake") || "red", this.errorTexts.get("path") || "Неизвестная ошибка");
        }
      } else {
        this.showErrorPath(this.treeColors.get("mistake") || "red", this.errorTexts.get("path") || "Неизвестная ошибка");
      }
    }
  }

  private getNodeValue(node: TreeNode): string {
    if (node.value !== undefined && node.value !== null) {
      return String(node.value);
    } else {
      return String(node.attribute) || "";
    }
  }


  private renderTree(node: TreeNode) {
    const buildTree = this.createTreeElement(node);
    this.treeContainer.appendChild(buildTree);
  }


  private createTreeElement(node: TreeNode): HTMLElement {
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


  private buildPath(answerPath: (string | number)[]) {
    this.markedPath = [...answerPath];
    if (this.treeContainer.querySelector('ul') !== null) {
      this.coloringWay(answerPath, this.treeContainer.querySelector('ul'), 1);
    }

  }


  private async coloringWay(answerPath: (string | number)[], container: HTMLUListElement | null, index: number) {
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


  private async clearOldWay(container: HTMLElement | null, index: number): Promise<void> {
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


  private delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => { resolve() }, ms);
    });
  }


  private isEqual(arr1: (string | number)[], arr2: (string | number)[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    } else {
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
          return false;
      }
      return true;
    }
  }


  private isMatrixCorrect(matrix: (string | number)[][]): boolean {
    const correctLength = matrix[0].length;
    for (const row of matrix) {
      if (row.length !== correctLength) {
        return false;
      }
    }
    return true;
  }
  private changeAnswer(color: string, value: string) {
    this.answer.style.color = color;
    this.answer.textContent = value;


  }
  private async showErrorMatrix(color: string, value: string) {
    const tempValue = this.treeInput.value;
    await this.delay(100);
    this.treeInput.style.color = color;
    this.treeInput.value = value;
    await this.delay(1400);
    this.treeInput.style.color = "white";
    this.treeInput.value = tempValue;
  }

  private async showErrorPath(color: string, value: string) {
    const tempValue = this.ansInput.value;
    await this.delay(100);
    this.ansInput.style.color = color;
    this.ansInput.value = value;
    await this.delay(1400);
    this.ansInput.style.color = "white";
    this.ansInput.value = tempValue;
  }

}

const decisionTree = new TreeEventHandler();


