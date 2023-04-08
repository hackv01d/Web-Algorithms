import { Tree } from "./tree.js";


const createTreeInput = document.getElementById("create-tree-area") as HTMLInputElement;
const createTreeButton = document.getElementById("create-tree-button") as HTMLButtonElement;

const inputFindAnswer = document.getElementById("find-way-area") as HTMLInputElement;
const getAnswerButton = document.getElementById("get-answer-button") as HTMLButtonElement;

const answerText = document.getElementById("container__answer") as HTMLElement;
const separatorSymbol = document.getElementById('separator') as HTMLSelectElement;

let tree: Tree;


createTreeButton.addEventListener("click", () => {
  const rows: string[] = createTreeInput.value.split('\n');
  const matrix: string[][] = rows.map((row) => row.split(separatorSymbol.value));
  const matrixIsCorrect = isMatrixCorrect(matrix);
  
  if (matrix.length <= 1) {
    changeTextContent("red", "Error, add the children of the tree");
  } else {
    if (matrixIsCorrect) {
      tree = new Tree(matrix);
      answerText.textContent = "";
    } else {
      changeTextContent("red", "Error, check the matrix for correctness");
    }

  }
});


getAnswerButton.addEventListener("click", () => {
  const rows: string[] = inputFindAnswer.value.split(separatorSymbol.value);

  if (tree !== undefined && tree.rootNode.attribute !== "") {
    const content = tree.traverseTree(tree.rootNode, rows);
    if (content !== undefined) {
      if (tree.rootNode.children.length > 0) {
        changeTextContent("green", content.attribute);
      } else if (rows[0] === content.attribute) {
        changeTextContent("green", content.value);
      } else {
        changeTextContent("red", "Error");
      }
    } else {
      changeTextContent("red", "Error");
    }
  } else {
    changeTextContent("red", "Error");
  }
});


function changeTextContent(color: string, value: string) {
  answerText.style.color = color;
  answerText.textContent = value;
}

function isMatrixCorrect(matrix: string[][]): boolean {
  const correctLength = matrix[0].length;
  for (const row of matrix) {
    if (row.length !== correctLength) {
      return false;
    }
  }
  return true;
}