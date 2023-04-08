
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
    const [bestAttributeIndex, bestGain] = this.getBestFuture(data);

    if (bestGain === 0) {
      const attributes = data.map((row) => row[row.length - 1]);
      const mostPopularAttribute = this.getMostPopularAttribute(attributes);
      if (data.length === 1) {
        return new TreeNode(data[0][0], mostPopularAttribute);
      }
      return new TreeNode(mostPopularAttribute);
    }

    const bestAttribute = headers[bestAttributeIndex];
    const newNode = new TreeNode(bestAttribute);

    const attributeValues = new Set(data.map((row) => row[bestAttributeIndex]));
    for (const attributeValue of attributeValues) {
      const attributeSet = data.filter((row) => row[bestAttributeIndex] === attributeValue);
      const newHeaders = headers.filter((header) => header !== bestAttribute);
      const newSubtree = this.buildTree(attributeSet, newHeaders);

      newNode.addChild(bestAttribute, attributeValue, newSubtree);
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
        const probabilitySet = data.filter((row) => row[i] === attributeValue);
        const localProbability = probabilitySet.length / data.length;
        const attributeTypes = probabilitySet.map((row) => row[row.length - 1]);

        const entropy = this.calculateEntropy(attributeTypes);
        newEntropy += localProbability * entropy;
      }
      const localGain = this.calculateEntropy(data.map((row => (row[row.length - 1])))) - newEntropy;

      if (bestGain < localGain) {
        bestGain = localGain;
        bestAttrinuteIndex = i;
      }
    }
    return [bestAttrinuteIndex, bestGain];
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



  public traverseTree(node: TreeNode, path: string[]): TreeNode | undefined {
    if (node.children.length === 0) {
      return node;
    }
    for (const attribute of path) {
      const childNode = node.children.find((child) => child.value === attribute);
      if (childNode !== undefined) {
        return this.traverseTree(childNode.children[0], path);
      }
    }
    return undefined;

  }

}


