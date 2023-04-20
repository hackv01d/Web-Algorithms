import { Tree, TreeNode } from "./tree.js";
import { parseData } from "./parseData.js";

class treeEventHandler {
  private treeInput: HTMLInputElement;
  private ansInput: HTMLInputElement;
  private separator: HTMLSelectElement;
  private answer: HTMLElement;
  private container: HTMLElement;
  private tree: Tree;
  private parser: parseData;
  private markedPath: (string | number)[];


  constructor() {
    this.treeInput = document.getElementById("create-tree-area") as HTMLInputElement;
    this.ansInput = document.getElementById("find-way-area") as HTMLInputElement;
    this.separator = document.getElementById('separator') as HTMLSelectElement;
    this.answer = document.getElementById("container__answer") as HTMLElement;
    this.container = document.getElementById('tree') as HTMLElement;

    this.tree = null;
    this.parser = new parseData(this.treeInput, this.ansInput, this.separator.value);
    this.markedPath = [];


    document.getElementById("create-tree-button").addEventListener("click", () => {
      this.container.innerHTML = "";
      const matrix: (number | string)[][] = this.parser.getInputDataMatrix();

      if (matrix.length <= 1) {
        this.changeAnswer("red", "Error, add the children of the tree");
      } else {
        if (this.isMatrixCorrect(matrix)) {
          this.tree = new Tree(matrix);
          this.answer.textContent = "";
          this.renderTree(this.tree.rootNode);
        } else {
          this.changeAnswer("red", "Error, check the matrix for correctness");
        }
      }
    });

    document.getElementById("get-answer-button").addEventListener("click", async () => {
      const row: (string | number)[] = this.parser.getOutputDataRow();
      console.log(row);

      if (this.tree !== undefined && this.tree.rootNode.attribute !== "") {
        const answerPath = this.tree.traverseDecisionTree(this.tree.rootNode, row, []);
        if (!this.isEqual(this.markedPath, answerPath)) {
          if (this.markedPath.length > 0) {
            await this.clearOldWay(this.container.querySelector('ul'), 1);
          }
          this.buildPath(answerPath);
        };

      }
    });
  }

  private renderTree(node: TreeNode) {
    const buildTree = this.createTreeElement(node);
    this.container.appendChild(buildTree);
  }

  private getNodeValue(node: TreeNode): string {
    if (node.value !== undefined && node.value !== null) {
      return String(node.value);
    } else {
      return String(node.attribute) || "";
    }
  }

  private createTreeElement(node: TreeNode): HTMLElement {
    const li = document.createElement("li");
    const span = document.createElement("span");

    span.textContent = this.getNodeValue(node);
    li.appendChild(span);
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
    const constSpan = this.container.querySelector('span');
    constSpan.style.color = "#1C94C4";
    this.markedPath = [...answerPath];
    this.showWay(answerPath, this.container.querySelector('ul'), 1);
  }


  private async showWay(answerPath: (string | number)[], container: HTMLElement, index: number) {
    const elements = container.children;

    if (index === answerPath.length - 1) {
      await this.delay(300);
      const constSpan = container.querySelector('span');
      constSpan.style.color = "#2CB63E";
      return;
    }

    for (const element of elements) {
      const constSpan = element.querySelector('span');
      const constElementUl = element.querySelector('ul');

      if (constSpan.textContent === answerPath[index]) {
        await this.delay(300);
        constSpan.style.color = "#1C94C4";
        await this.showWay(answerPath, constElementUl, ++index);
      }
    }
  }
  private async clearOldWay(container: HTMLElement, index: number): Promise<void> {
    if (index === 1) {
      await this.delay(200);
      const constSpan = this.container.querySelector('span');
      constSpan.style.color = "#CA4557";
    }

    const elements = container.children;

    if (index === this.markedPath.length - 1) {
      await this.delay(300);
      const constSpan = container.querySelector('span');
      constSpan.style.color = "#CA4557";
      return;
    }

    for (const element of elements) {
      const constSpan = element.querySelector('span');
      const constElementUl = element.querySelector('ul');

      if (constSpan.textContent === this.markedPath[index]) {
        await this.delay(200);
        constSpan.style.color = "#CA4557";
        await this.clearOldWay(constElementUl, ++index);
      }
    }
  }
  private delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
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


}

const decisionTree = new treeEventHandler();


