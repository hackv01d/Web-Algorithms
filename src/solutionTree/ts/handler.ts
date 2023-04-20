import { Tree, TreeNode } from "./tree.js";
import { parseData } from "./parseData.js";

class TreeEventHandler {
  private treeInput: HTMLInputElement;
  private ansInput: HTMLInputElement;
  private separator: HTMLSelectElement;
  private answer: HTMLElement;
  private treeContainer: HTMLElement;

  private createTreeBtn:  HTMLButtonElement;
  private getAnswerBtn:  HTMLButtonElement;
  private clearTreeTextBtn:  HTMLButtonElement;
  private clearAnswerBtn:  HTMLButtonElement;
  private clearAllBtn:  HTMLButtonElement;

  private tree: Tree;
  private parser: parseData;
  private markedPath: (string | number)[];
  private errorTexts = ["Error, add the children of the tree", "Error, check the matrix for correctness","Error, the length of the desired path is too short"];

  constructor() {
    this.treeInput = document.getElementById("create-tree-area") as HTMLInputElement;
    this.ansInput = document.getElementById("find-way-area") as HTMLInputElement;
    this.separator = document.getElementById('separator') as HTMLSelectElement;
    this.answer = document.getElementById("container__answer") as HTMLElement;
    this.treeContainer = document.getElementById('tree') as HTMLElement;

    this.createTreeBtn =  document.getElementById("create-tree-button") as HTMLButtonElement;
    this.getAnswerBtn =  document.getElementById("create-answer-button") as HTMLButtonElement;
    this.clearTreeTextBtn =  document.getElementById("clear-tree-button") as HTMLButtonElement;
    this.clearAnswerBtn =  document.getElementById("clear-answer-button") as HTMLButtonElement;
    this.clearAllBtn =  document.getElementById("clear-all-button") as HTMLButtonElement;

    this.tree = null;
    this.parser = new parseData(this.treeInput, this.ansInput, this.separator.value);
    this.markedPath = [];


    this.createTreeBtn.addEventListener("click", () => {
      this.treeContainer.innerHTML = "";
      const matrix: (number | string)[][] = this.parser.getInputDataMatrix();

      if (matrix.length <= 1) {
        this.changeAnswer("red", this.errorTexts[0]);
      } else if (this.isMatrixCorrect(matrix)){
          this.tree = new Tree(matrix);
          console.log(this.tree);
          
          this.answer.textContent = "";
          this.renderTree(this.tree.rootNode);
      }else {
        this.changeAnswer("red", this.errorTexts[1]);
      }
    });


    this.getAnswerBtn.addEventListener("click", async () => {
      const row: (string | number)[] = this.parser.getOutputDataRow();
      if (this.tree !== undefined && this.tree.rootNode.attribute !== "") {
        const answerPath = this.tree.traverseDecisionTree(this.tree.rootNode, row, []);
        if (!this.isEqual(this.markedPath, answerPath)) {
          if (this.markedPath.length > 0) {
            await this.clearOldWay(this.treeContainer.querySelector('ul'), 1);
          }
          if (answerPath.length > 0){
            this.changeAnswer("green", "");
            this.buildPath(answerPath);
          } else{
            this.changeAnswer("red", this.errorTexts[2]);
          }
        };
      }
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
    // link.href = "#";

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
    const link = this.treeContainer.querySelector('a');
    link.style.color = "#1C94C4";
    this.markedPath = [...answerPath];
    this.showWay(answerPath, this.treeContainer.querySelector('ul'), 1);
  }


  private async showWay(answerPath: (string | number)[], container: HTMLElement, index: number) {
    const elements = container.children;

    if (index === answerPath.length - 1) {
      await this.delay(300);
      const link = container.querySelector('a');
      link.style.color = "#2CB63E";
      return;
    }

    for (const element of elements) {
      const link = element.querySelector('a');
      const constElementUl = element.querySelector('ul');

      if (String(link.textContent) === String(answerPath[index])) {
        await this.delay(300);
        link.style.color = "#1C94C4";
        await this.showWay(answerPath, constElementUl, ++index);
      }
    }
  }


  private async clearOldWay(container: HTMLElement, index: number): Promise<void> {
    if (index === 1) {
      await this.delay(200);
      const link = this.treeContainer.querySelector('a');
      link.style.color = "#CA4557";
    }

    const elements = container.children;

    if (index === this.markedPath.length - 1) {
      await this.delay(300);
      const link = container.querySelector('a');
      link.style.color = "#CA4557";
      return;
    }

    for (const element of elements) {
      const link = element.querySelector('a');
      const constElementUl = element.querySelector('ul');

      if (String(link.textContent) === String(this.markedPath[index])) {
        await this.delay(200);
        link.style.color = "#CA4557";
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

const decisionTree = new TreeEventHandler();


