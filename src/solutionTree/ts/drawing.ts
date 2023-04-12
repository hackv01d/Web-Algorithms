import { Tree, TreeNode } from "./tree.js";

const treeInput = document.getElementById("create-tree-area") as HTMLInputElement;

const ansInput = document.getElementById("find-way-area") as HTMLInputElement;

const answer = document.getElementById("container__answer") as HTMLElement;
const separator = document.getElementById('separator') as HTMLSelectElement;

const container = document.getElementById('tree') as HTMLElement;

let tree: Tree;

document.getElementById("create-tree-button").addEventListener("click", () => {
  container.innerHTML = "";
  const rows: string[] = treeInput.value.split('\n');
  const matrix: string[][] = rows.map((row) => row.split(separator.value));
  const matrixIsCorrect = isMatrixCorrect(matrix);

  if (matrix.length <= 1) {
    changeAnswer("red", "Error, add the children of the tree");
  } else {
    if (matrixIsCorrect) {
      tree = new Tree(matrix);

      answer.textContent = "";
      renderTree(tree.rootNode);
    } else {
      changeAnswer("red", "Error, check the matrix for correctness");
    }
  }
});



function changeAnswer(color: string, value: string) {
  answer.style.color = color;
  answer.textContent = value;
}

function isMatrixCorrect(matrix: string[][]): boolean {
  const correctLength = matrix[0].length;
  for (const row of matrix) {
    if (row.length !== correctLength) {
      return true;
    }
  }
  return true;
}


function createTreeElement(node: TreeNode): HTMLElement {
  const li = document.createElement("li");
  const span = document.createElement("span");

  span.textContent = node.value || node.attribute || "";

  li.appendChild(span);

  if (node.children.length > 0) {
    const ul = document.createElement("ul");
    node.children.forEach((child) => {
      ul.appendChild(createTreeElement(child));
    });
    li.appendChild(ul);
  }
  return li;
}

document.getElementById("get-answer-button").addEventListener("click", () => {
  const rows: string[] = ansInput.value.split(separator.value);

  if (tree !== undefined && tree.rootNode.attribute !== "") {
    const answerPath = tree.traverseDecisionTree(tree.rootNode, rows, []);
    buildPath(answerPath);
  }
});

function renderTree(node: TreeNode) {
  const buildTree = createTreeElement(node);
  container.appendChild(buildTree);
}

function buildPath(answerPath: string[]) {
  const constSpan = container.querySelector('span');
  constSpan.style.color = "red";
  showWay(answerPath, container.querySelector('ul'), 1);
}

function showWay(way: string[], constainer: HTMLElement, index: number) {
  const elements = constainer.children;

  if (index === way.length - 1) {
    const constSpan = constainer.querySelector('span');
    constSpan.style.color = "green";
    return;
  }

  for (const element of elements) {
    const constSpan = element.querySelector('span');
    const constElementUl = element.querySelector('ul');

    if (constSpan.textContent === way[index]) {
      constSpan.style.color = "red";
      showWay(way, constElementUl, ++index);

    }
  }
}
