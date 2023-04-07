// import { parseCsv, readCsvFile } from "./parseData";
// import { Tree} from "./tree";


// async function decisionTree(): Promise<void> {
//   const csv =  'src/solutionTree/data/weather.csv';
//    const data: string[][] = readCsvFile(csv);
  
  
//   await new Promise(resolve => setTimeout(resolve, 2000));
//   console.log(data);
//   const tree = new Tree(data);
//   const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
//   console.log(tree.rootNode);
  
  
  
//   readline.question('Введите ваш запрос: ', (name: string) => {
//     const inputObject = name.split(',');
//     console.log(inputObject);
    
//     console.log(tree.traverseTree(tree.rootNode, inputObject).attribute);
//     readline.close();
//   });
    

// }

// decisionTree();

const myInput = document.getElementById('myInput') as HTMLInputElement;
const myButton = document.getElementById('myButton');

myButton.addEventListener('click', () => {
  const inputText = myInput.value;
  console.log(inputText);
});
// добавить функцию визуализации созданного дерева
// добавить функцию визуализации поиска пути и вывод результата targetValue