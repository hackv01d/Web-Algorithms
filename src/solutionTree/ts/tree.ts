

export class TreeNode{
  public value?: string;
  public children: TreeNode[];
  public attribute?: string;

  constructor(attribute?: string, value?: string){ // мб добавить value
    this.children = [];
    this.attribute = attribute;
    this.value = value;
  }
  public addChild(attributeValue: string, subtree: TreeNode): void {
    const newChild = new TreeNode(attributeValue);
    newChild.children.push(subtree);
    this.children.push(newChild);
  }
}

class Tree{
  private rootNode: TreeNode;
  private headers: string[];

  constructor(data: string[][]){ // обработать данные для хранения в дереве, возможно, добавить targetValue для настройки поиска элемента
    this.headers = data.shift()|| []; // вырезать первую строку матрицы data
    this.rootNode = this.buildTree(data, this.headers);
  }

  private buildTree(data: string[][], headers: string[]) : TreeNode{
    const [bestAttributeIndex, bestGain] = this.getBestFuture(data); // получаем индекс атрибута для лучшей выборки и его сумму 

    if (bestGain === 0){
      const attributes = data.map((row) => row[row.length - 1]); //извлекает последний элемент каждой строки row из массива data и сохраняет их в массив attributes
      const mostPopularAttribute = this.getMostPopularAttribute(attributes);
      return new TreeNode(mostPopularAttribute); 
    }

    const bestAttribute = headers[bestAttributeIndex];
    const newNode = new TreeNode(bestAttribute);
    
    const attributeValues = new Set(data.map((row) => row[bestAttributeIndex])); // собираем все неповторяющиеся аттрибуты
    for (const attributeValue of attributeValues){
      const attributeSet = data.filter((row) => row[bestAttributeIndex] === attributeValue); // создаём матрицу только из тех элементов, где в строке есть искомы аттрибут
      const newHeaders = headers.filter((header) => header !== bestAttribute); // собираем все аттрибуты без уже использованного(attributeValue)
      const newSubtree = this.buildTree(attributeSet, newHeaders);
      newNode.addChild(attributeValue, newSubtree);
    }
    return newNode;

    
  }
  private getMostPopularAttribute(attributes: string[]): string{
    const attributeCounts = new Map<string, number>();
    for(const attribute of attributes){
      attributeCounts.set(attribute, (attributeCounts.get(attribute) || 0) + 1);
    }
    let mostPopularAttribute: string = "";
    let maxCount = -Infinity;
    for(const [attribute, count] of attributeCounts){
      if (count > maxCount){
        maxCount = count;
        mostPopularAttribute = attribute;
      }
    }
    return mostPopularAttribute;
  }
  private getBestFuture(data: string[][]): [number, number]{ // нахождение наилучшей выборки, число или значение, благодаря которому мы строим дерево
  //мы запускаем эту функцию для каждой ветки, если она не является листом
    const numAttribute = data[0].length - 1; // мб data[0] заменить на headers
    let bestAttrinuteIndex = 0;
    let bestGain = 0;
    for(let i = 0; i < numAttribute; ++i){
      const attributeValues = new Set(data.map((row) => (row[i]))); // проходимся по каждой строке и из неё берем i-й аттрибут
      let newEntropy = 0;
      for (const attributeValue of attributeValues){
        const probabilitySet = data.filter((row) => row[i] === attributeValue);
        const localProbability = probabilitySet.length / data.length; // здесь может быть проблема с лишней строкой(может учитываться строка с аттрибутами)
        const attributeTypes = probabilitySet.map((row) => row[row.length - 1]);

        const entropy = this.calculateEntropy(attributeTypes); // вычисляем энтропию для нахождения наилучшего информационного прироста
        newEntropy += localProbability * entropy;
      }
      const localGain = this.calculateEntropy(data.map((row => (row[row.length - 1])))) - newEntropy;

      if (bestGain < localGain){
        bestGain = localGain;
        bestAttrinuteIndex = i;
      }
    }

    return [bestAttrinuteIndex, bestGain];
  }

  private calculateEntropy(types: string[]): number{ // когда энтропия равна нулю, формируем лист
    const entryCounts = new Map<string, number>();
    for(const type of types){
      entryCounts.set(type, (entryCounts.get(type)|| 0) + 1);
    }
    let entropy = 0;
    for (const count of entryCounts.values()){
      const probability = count / types.length;
      entropy -= probability * Math.log2(probability);
    }
    return entropy;
  }



  public traverseTree(way: string[]): TreeNode{ // targetValue здесь искать
    let currentNode = this.rootNode;
    for (const step of way) {
      const matchingChild = currentNode.children.find((child) => child.value === step);
      console.log(matchingChild);
      if (!matchingChild) {
        return undefined; 
      }
      currentNode = matchingChild;
    }
    return currentNode;
  }
}



// Sunny,Cool,Normal,false
const way = ["Rain","Cool","Normal","true"];
const data = [
  ["Outlook","Temperature","Humidity","Windy","Play"],
  ["Sunny","Hot","High","false","No"],
  ["Sunny","Hot","High","true","No"],
  ["Overcast","Hot","High","false","Yes"],
  ["Rain","Mild","High","false","Yes"],
  ["Rain","Cool","Normal","false","Yes"],
  ["Rain","Cool","Normal","true","No"],
  ["Overcast","Cool","Normal","true","Yes"],
  ["Sunny","Mild","High","false","No"],
  ["Sunny","Cool","Normal","false","Yes"],
  ["Rain","Mild","Normal","false","Yes"],
  ["Sunny","Mild","Normal","true","Yes"],
  ["Overcast","Mild","High","true","Yes"],
  ["Overcast","Hot","Normal","false","Yes"],
  ["Rain","Mild","High","true","No"]
  ];
  
  const decisionTree = new Tree(data);
  
  console.log(decisionTree); // отображаем дерево решений, построенное на входных данных
  console.log(decisionTree.traverseTree(way));
  
//   // Для тестирования работы дерева сделаем простое консольное приложение
  
//   const readline = require("readline");
//   const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
//   });
  
//   rl.question("Введите данные в формате csv для принятия решения: ", function(data) {
//   const input = data.split(",").map(value => value.trim());
//   const result = decisionTree.traverseTree(input);
//   console.log(`Результат принятия решения: ${result.value}`);
//   rl.close();
//   });


