import { log } from "console";
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
      console.log(tree);
      
      answer.textContent = "";
      renderTree(tree.rootNode);
    } else {
      changeAnswer("red", "Error, check the matrix for correctness");
    }
  }
});
let content: string[];

getAnswerButton.addEventListener("click", () => {
  const rows: string[] = ansInput.value.split(separator.value);

  if (tree !== undefined && tree.rootNode.attribute !== "") {
    
    content = tree.traverseTree(tree.rootNode, rows, []);
  //   if (content !== undefined) {
  //     if (tree.rootNode.children.length > 0 || rows[0] === content.attribute) {
  //       changeAnswer("green", content.value);
  //     } else {
  //       changeAnswer("red", "Error");
  //     }
  //   } else {
  //     changeAnswer("red", "Error");
  //   }
  // } else {
  //   changeAnswer("red", "Error");
    console.log(content);
    
    const constSpan = container.querySelector('span');
    constSpan.style.color = "red";
    showWay(content, container.querySelector('ul'), 1);
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
    if (node.value !== undefined){
      span.textContent = node.value;
    } else{
      span.textContent = node.attribute  || "";
    }
    
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
}
function showWay(way: string[], constainer: HTMLElement,index: number){
  const elements = constainer.children;
  if (index === way.length - 1){
    const constSpan = constainer.querySelector('span');
    constSpan.style.color = "green";
    return;
  }
  for(const element of elements){
    const constSpan = element.querySelector('span');
    const constElementUl = element.querySelector('ul');

    if (index === way.length){
      constSpan.style.color = "green";
      break;
    }
    if (constSpan.textContent === way[index]){
      constSpan.style.color = "red";

      index += 1;
      showWay(way, constElementUl, index);
      
    }
  }
}
function deleteWay(way: string[], constainer: HTMLElement,index: number){
  const elements = constainer.children;
  if (index === way.length - 1){
    const constSpan = constainer.querySelector('span');
    constSpan.style.color = "black";
    return;
  }
  for(const element of elements){
    const constSpan = element.querySelector('span');
    const constElementUl = element.querySelector('ul');
    if (index === way.length){
      constSpan.style.color = "black";
      break;
    }
    if (constSpan.textContent === way[index]){
      constSpan.style.color = "black";

      index += 1;
      deleteWay(way, constElementUl, index);
      
    }
  }
}