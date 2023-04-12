
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
    const [bestAttrIdx, bestInfoGain] = this.getBestFuture(data);

    if (bestInfoGain === 0) {
      const attributes = data.map((row) => row[row.length - 1]);
      const mostPopularAttribute = this.getMostPopularAttribute(attributes);
      if (data.length === 1) {
        return new TreeNode(data[0][0], mostPopularAttribute);
      }
      return new TreeNode(mostPopularAttribute);
    }

    const bestAttr = this.headers[bestAttrIdx];
    const newNode = new TreeNode(bestAttr);

    const uniqueAttrValues = new Set(data.map((row) => row[bestAttrIdx]));

    for (const attrValue of uniqueAttrValues) {
      const attrSet = data.filter((row) => row[bestAttrIdx] === attrValue);
      const attrSetHeaders = headers.filter((header) => header !== bestAttr);
      const subtree = this.buildTree(attrSet, attrSetHeaders);

      newNode.addChild(bestAttr, attrValue, subtree);
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


  private getBestFuture(inputData: string[][]): [number, number] {
    const numAttribute = this.headers.length - 1;
    let bestAttrIdx = 0;
    let maxInfoGain = 0;

    for (let i = 0; i < numAttribute; ++i) {
      const attributeValues = new Set(inputData.map((row) => (row[i])));
      let entropy = 0;
      for (const attributeValue of attributeValues) {
        entropy += this.calculateAttributeValueEntropy(attributeValue, inputData, i);
      }
      const localInfoGain = this.calculateShannonEntropy(inputData.map((row => (row[row.length - 1])))) - entropy;

      if (maxInfoGain < localInfoGain) {
        maxInfoGain = localInfoGain;
        bestAttrIdx = i;
      }
    }
    return [bestAttrIdx, maxInfoGain];
  }

  private calculateAttributeValueEntropy(attributeValue: string, data: string[][], i: number): number {
    const probabilitySet = data.filter((row) => row[i] === attributeValue);
    const localProbability = probabilitySet.length / data.length;
    const attributeTypes = probabilitySet.map((row) => row[row.length - 1]);

    const entropy = this.calculateShannonEntropy(attributeTypes);
    return localProbability * entropy;
  }

  private calculateShannonEntropy(types: string[]): number {
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



  public traverseDecisionTree(node: TreeNode, path: string[], way: string[]): string[] {

    if (node.children.length === 0) {
      way.push(node.attribute);
      return way;
    }

    for (let i = 0; i < path.length; ++i) {
      const attributeValue = path[i];
      const childNode = node.children.find((child) => child.value === attributeValue);

      if (childNode !== undefined && childNode.value !== undefined) {
        way.push(this.headers[i], attributeValue);
        return this.traverseDecisionTree(childNode.children[0], path, way);

      } else {
        const childNodeAttribute = node.children.find((child) => child.attribute === attributeValue);
        if (childNodeAttribute !== undefined) {
          way.push(this.headers[i], attributeValue);
          return this.traverseDecisionTree(childNodeAttribute.children[0], path, way);
        }
      }
    }
    return [];

  }

}


