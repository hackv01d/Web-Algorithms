
import {Tree} from "./tree.js";



// добавить функцию визуализации созданного дерева
// добавить функцию визуализации поиска пути и вывод результата targetValue
const dataInput = document.getElementById("data-input") as HTMLInputElement;
const submitButton = document.getElementById("submit-button");

const dataInputTwo = document.getElementById("data-input_two") as HTMLInputElement;
const submitButtonTwo = document.getElementById("submit-button_two");
let tree: Tree;
submitButton.addEventListener("click", () => {
  const data: string = dataInput.value;
  const rows: string[] = data.split('\n');
  const matrix: string[][] = rows.map((row) => row.split(';'));
  tree = new Tree(matrix);
  console.log(tree.rootNode);
});


submitButtonTwo.addEventListener("click", () => {
  const data: string = dataInputTwo.value;
  const rows: string[] = data.split(';');
  console.log(tree.traverseTree(tree.rootNode, rows).attribute);
});
