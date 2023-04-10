import { Tree, TreeNode} from "./tree.js";


const treeInput = document.getElementById("create-tree-area") as HTMLInputElement;
const treeBtn = document.getElementById("create-tree-button") as HTMLButtonElement;

const ansInput = document.getElementById("find-way-area") as HTMLInputElement;
const getAnswerButton = document.getElementById("get-answer-button") as HTMLButtonElement;

const answer = document.getElementById("container__answer") as HTMLElement;
const separator = document.getElementById('separator') as HTMLSelectElement;

const container = document.getElementById('tree') as HTMLElement;
let tree: Tree;


treeBtn.addEventListener("click", () => {
  container.innerHTML ="";
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


getAnswerButton.addEventListener("click", () => {
  const rows: string[] = ansInput.value.split(separator.value);

  if (tree !== undefined && tree.rootNode.attribute !== "") {
    const content = tree.traverseTree(tree.rootNode, rows);
    if (content !== undefined) {
      if (tree.rootNode.children.length > 0 || rows[0] === content.attribute) {
        changeAnswer("green", content.value);
      } else {
        changeAnswer("red", "Error");
      }
    } else {
      changeAnswer("red", "Error");
    }
  } else {
    changeAnswer("red", "Error");
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


function createTreeElement(node: TreeNode) : HTMLElement {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = node.value ||node.attribute  || "";
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

function renderTree(node: TreeNode){
    const buildTree = createTreeElement(node);
    container.appendChild(buildTree);
    console.log("good");
    
}
