

export class TreeNode{
  public value?: string;
  public children: TreeNode[];

  constructor(){ // мб добавить value
    this.children = [];
  }
}

class Tree{
  private rootNode: TreeNode;
  private headers: string[];

  constructor(data: string[][]){ // обработать данные для хранения в дереве, возможно, добавить targetValue для настройки поиска элемента
    this.headers = data.shift()|| []; // вырезать первую строку матрицы data
    this.rootNode = this.buildTree(data);
  }

  private buildTree(data: string[][]) : TreeNode{
    const node = new TreeNode();
    return;
  }

  private findFeature(){ // нахождение наилучшей выборки, число или значение, благодаря которому мы строим дерево
    // здесь нужно найти Gain для каждого header (исключая самый последний) и тем самым выбрать его основным

    //мы запускаем эту функцию для каждой ветки, если она не является листом
  }
  private getGain(firstTypeValueOfAllAttributes: number, secondTypeValueOfAllAttributes: number, allTypes: string[], arrayOfFirstValuesOfAllAttributes: number[], arrayOfSecondValuesOfAllAttributes: number[] ){ 
    // рассчитать для каждого атрибута выигрыш информации
    
    let gain = this.calculateEntropy(firstTypeValueOfAllAttributes, secondTypeValueOfAllAttributes);  
    let summaOfEntropyAllAttributes = 0;
    for (let i = 0; i < allTypes.length; ++i) {
      let chanceOfAttribute =  (firstTypeValueOfAllAttributes[i] + secondTypeValueOfAllAttributes[i]) / allTypes.length; 
      summaOfEntropyAllAttributes +=  chanceOfAttribute * this.calculateEntropy(firstTypeValueOfAllAttributes[i], secondTypeValueOfAllAttributes[i]) ;
    }
    return gain - summaOfEntropyAllAttributes;

  }
  private calculateEntropy(firstTypeValue: number, secondTypeValue){ 
    // функция должна принимать атрибут и знать количество значений 
    // true/false, candy/shit и т.п. и должно быть в численной мере
    // когда энтропия равна нулю, формируем лист
    const countOfValues = firstTypeValue + secondTypeValue;
    let entropy = (-1) * (firstTypeValue / countOfValues) * this.returnLogTwo((firstTypeValue / countOfValues))
     - (secondTypeValue / countOfValues) *  this.returnLogTwo((secondTypeValue / countOfValues));
    return entropy;
  }

  private returnLogTwo(x: number): number{
    return Math.log(x) / Math.log(2);
  }

  public traverseTree(way: string[]){ // targetValue здесь искать
    // ... код обхода дерева и вывода принятых решений
  }
}



export function addNode(value: string, parentValue: string): void{

};    






// ... код построения дерева
    // if all examples are of the same class:
    //     return a leaf node with that class
    // if dataset is empty:
    //     return a leaf node with the most common class in the parent dataset
    // else:
    //     best_feature = choose_best_feature(dataset)
    //     tree = a new decision tree with root as best_feature
    //     for each value of best_feature:
    //         subset = all examples in dataset with best_feature = value
    //         subtree = build_decision_tree(subset)
    //         add subtree as a child of tree's root
    //     return tree

//функция ID3(выборка):
      // если выборка состоит из объектов одного класса:
      // вернуть узел-лист с этим классом
      // если атрибуты выборки пусты:
      // вернуть узел-лист с наиболее часто встречающимся классом в выборке
      // иначе:
      // выбрать атрибут с наибольшим выигрышем информации
      // создать новый узел для выбранного атрибута
      // для каждого значения выбранного атрибута:
      //     создать подмножество выборки, содержащее только объекты с этим значением атрибута
      //     добавить новый лист в узел для соответствующего значения атрибута, рекурсивно вызвав ID3 для подмножества
      // вернуть дерево решений



// function ID3(examples, target_attribute, attributes)
//     create a new node N
//     if all examples are positive, return N labeled with the target_attribute value "positive"
//     else if all examples are negative, return N labeled with the target_attribute value "negative"
//     else if attributes is empty, return N labeled with the most common value of the target_attribute in the examples
//     else
//         calculate the entropy of the target_attribute for the examples
//         for each attribute in attributes, calculate the information gain for the attribute:
//             calculate the entropy for each possible value of the attribute
//             calculate the weighted average of the entropy for each possible value
//             calculate the information gain as the difference between the entropy of the target_attribute and the weighted average of the entropy of the attribute
//         select the attribute with the highest information gain
//         label the node N with the selected attribute
//         for each possible value of the selected attribute
//             create a new branch below node N
//             subset the examples where the selected attribute has the value equal to the current possible value
//             if the subset of examples is empty, create a leaf node labeled with the most common value of the target_attribute in the examples
//             else, create a child node by recursively calling the ID3 function with the subset of examples, target_attribute, and the remaining attributes
//             attach the child node to the corresponding branch
//     return N