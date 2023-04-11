
export class TreeNode {
  public value?: string;
  public children: TreeNode[];
  public attribute?: string;

  constructor(attribute?: string, value?: string) {
    this.children = [];
    this.attribute = attribute;
    this.value = value;
  }
  public addChild(attribute: string, value: string, subtree: TreeNode): void {
    const newChild = new TreeNode(attribute, value);
    newChild.children.push(subtree);
    this.children.push(newChild);
  }
}

export class Tree {
  public rootNode: TreeNode;
  private headers: string[];

  constructor(data: string[][]) {
    this.headers = data.shift() || [];
    this.rootNode = this.buildTree(data, this.headers);
  }

  private buildTree(data: string[][], headers: string[]): TreeNode {
    const [bestAttributeId, bestGain] = this.getBestFuture(data);

    if (bestGain === 0) {
      const attributes = data.map((row) => row[row.length - 1]);
      const mostPopularAttribute = this.getMostPopularAttribute(attributes);
      if (data.length === 1) {
        return new TreeNode(data[0][0], mostPopularAttribute);
      }
      return new TreeNode(mostPopularAttribute);
    }

    const bestAttribute = this.headers[bestAttributeId];
    const newNode = new TreeNode(bestAttribute);

    const attributeValues = new Set(data.map((row) => row[bestAttributeId]));

    for (const attributeValue of attributeValues) {
      const attributeSet = data.filter((row) => row[bestAttributeId] === attributeValue);
      const newHeaders = headers.filter((header) => header !== bestAttribute);
      const subtree = this.buildTree(attributeSet, newHeaders);
      console.log(headers[bestAttributeId] + attributeValue);
      
      newNode.addChild(bestAttribute, attributeValue, subtree);
    }
    return newNode;
  }

  private getMostPopularAttribute(attributes: string[]): string {
    const attributeCounts = new Map<string, number>();
    for (const attribute of attributes) {
      attributeCounts.set(attribute, (attributeCounts.get(attribute) || 0) + 1);
    }
    let mostPopularAttribute: string = "";
    let maxCount = -Infinity;
    for (const [attribute, count] of attributeCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostPopularAttribute = attribute;
      }
    }
    return mostPopularAttribute;
  }


  private getBestFuture(data: string[][]): [number, number] {
    const numAttribute = this.headers.length - 1;
    let bestAttrinuteIndex = 0;
    let bestGain = 0;

    for (let i = 0; i < numAttribute; ++i) {
      const attributeValues = new Set(data.map((row) => (row[i])));
      let newEntropy = 0;
      for (const attributeValue of attributeValues) {
        newEntropy += this.calculateAttributeValueEntropy(attributeValue, data, i);
      }
      const localGain = this.calculateEntropy(data.map((row => (row[row.length - 1])))) - newEntropy;

      if (bestGain < localGain) {
        bestGain = localGain;
        bestAttrinuteIndex = i;
      }
    }
    return [bestAttrinuteIndex, bestGain];
  }

  private calculateAttributeValueEntropy(attributeValue : string, data: string[][], i: number) : number{
    const probabilitySet = data.filter((row) => row[i] === attributeValue);
    const localProbability = probabilitySet.length / data.length;
    const attributeTypes = probabilitySet.map((row) => row[row.length - 1]);

    const entropy = this.calculateEntropy(attributeTypes);
    return localProbability * entropy;
  }

  private calculateEntropy(types: string[]): number {
    const entryCounts = new Map<string, number>();
    for (const type of types) {
      entryCounts.set(type, (entryCounts.get(type) || 0) + 1);
    }

    let entropy = 0;
    for (const count of entryCounts.values()) {
      const probability = count / types.length;
      entropy -= probability * Math.log2(probability);
    }

    return entropy;
  }



  public traverseTree(node: TreeNode, path: string[], way: string[]): string[]{
    
    if (node.children.length === 0) {
      way.push(node.attribute);
      return way;
    }
    for (const attribute of path) {
      const childNode = node.children.find((child) => child.value === attribute);
      
      if (childNode !== undefined && childNode.value !==undefined) {
        way.push(this.headers[path.indexOf(attribute)]);
        way.push(attribute);
        
        return this.traverseTree(childNode.children[0], path, way);
      } else{
        const childNodeAttribute = node.children.find((child) => child.attribute === attribute);
        if (childNodeAttribute !== undefined) {
          way.push(this.headers[path.indexOf(attribute)]);
          way.push(attribute);
          return this.traverseTree(childNodeAttribute.children[0], path, way);  
      }
    }
  }
    return [];

  }

}


