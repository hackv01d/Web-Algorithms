import {HeaderType } from "./interfaces.js";

export class TreeNode {
  public value?: string | number;
  public children: TreeNode[];
  public attribute?: string | number;

  constructor(attribute?: string | number, value?: string | number) {
    this.children = [];
    this.attribute = attribute;
    this.value = value;
  }

  public addChild(attribute: string | number, value: string | number, subtree: TreeNode): void {
    const newChild = new TreeNode(attribute, value);
    newChild.children.push(subtree);
    this.children.push(newChild);
  }
}

export class Tree {
  public rootNode: TreeNode;
  private headers: HeaderType[];

  constructor(data: (string | number)[][]) {
    const headers = data.shift() || [];
    this.headers = this.parseHeaders(headers.map(variable => String(variable)), data);
    this.rootNode = this.buildTree(data, this.headers);
  }


  private parseHeaders(headers: string[], data: (string | number)[][]): HeaderType[] {
    return headers.map((header) => {
      let type: ('string' | 'number') = 'number';
      const index = headers.indexOf(header);
      for (let i = 0; i < data.length; i++) {
        if (typeof data[i][index] === 'string') {
          type = 'string';
          break;
        }
      }
      return { name: header, type: type };
    })
  }



  private buildTree(data: (string | number)[][], headers: HeaderType[]): TreeNode {
    const uniqueClasses = new Set(data.map(item => item[item.length - 1]));
    const [bestAttrIdx, bestGainRatio] = this.getBestFeature(data);

    if (uniqueClasses.size === 1 || headers.length === 0 || bestGainRatio === 0) {
      return this.createLeaf(data);
    }
    
    if (bestAttrIdx !== -1){
      const bestAttr = this.headers[bestAttrIdx];
      const newNode = new TreeNode(bestAttr.name);
      const attrValues = new Set(data.map((row) => row[bestAttrIdx]));
  
      for (const attrValue of attrValues) {
  
        const attrSet = data.filter((row) => row[bestAttrIdx] === attrValue);
        const attrSetHeaders = headers.filter((header) => header !== bestAttr);
        const subtree = this.buildTree(attrSet, attrSetHeaders);
  
        if (bestAttr.type === 'number') {
          newNode.addChild(bestAttr.name, Number(attrValue), subtree);
        } else {
          newNode.addChild(bestAttr.name, String(attrValue), subtree);
        }
      }
      return newNode;
    }
    
  }


  private createLeaf(data: (string | number)[][]) {
    const attributes = data.map((row) => row[row.length - 1]);
    const mostPopularAttribute = this.getMostPopularAttribute(attributes);
    if (data.length === 1) {
      return new TreeNode(data[0][0], mostPopularAttribute);
    }
    return new TreeNode(mostPopularAttribute);
  }


  private getBestFeature(inputData: (string | number)[][]): [number, number] {
    const numAttributes = this.headers.length - 1;
    let bestAttrIndex = -1, maxGainRatio = 0;

    for (let i = 0; i < numAttributes; ++i) {
      
      const attributeValues = new Set(inputData.map((row) => row[i]));
      const [stringEntropy, numberEntropy] = this.calculateEntropies(attributeValues, inputData, i);
      
      const shannonEntropy = this.calculateShannonEntropy(inputData.map((row) => row[row.length - 1]));
      const localInfoGain = this.calculateLocalInfoGain(shannonEntropy, stringEntropy, numberEntropy);

      if (localInfoGain > 0) {
        const intrinsicInfo = this.calculateIntrinsicInfo(inputData, i);
        const gainRatio = localInfoGain / intrinsicInfo;

        if (gainRatio > maxGainRatio) {
          maxGainRatio = gainRatio;
          bestAttrIndex = i;
        }
      }
    }

    return [bestAttrIndex, maxGainRatio];
  }


  private calculateEntropies(attributeValues: Set<string | number>, inputData: (string | number)[][], i: number) : [number, number]{
    let stringEntropy = 0, numberEntropy = 0;
    for (const attributeValue of attributeValues) {
      const isNumeric = typeof attributeValue === 'number';

      if (isNumeric) {
        numberEntropy += this.calculateNumberAttrEntropy(inputData, i);
      } else {
        stringEntropy += this.calculateStringAttrEntropy(attributeValue, inputData, i);
      }
    }
    return [stringEntropy, numberEntropy];
  }


  private calculateLocalInfoGain(shannonEntropy: number, stringEntropy: number, numberEntropy: number): number {
    
    let localInfoGain = shannonEntropy;

    if (stringEntropy !== 0 && numberEntropy !== 0) {
      localInfoGain -= Math.min(stringEntropy, numberEntropy);
    } else if (stringEntropy !== 0 && numberEntropy === 0 ) {
      localInfoGain -= stringEntropy;
    } else if (stringEntropy === 0 && numberEntropy !== 0) {
      localInfoGain -= numberEntropy;
    }

    return localInfoGain;
  }


  private calculateIntrinsicInfo(data: (string | number)[][], i: number): number { // интринсическая информация - помогает избежать занижения информационного выигрыша для атрибутов с высокой частотой встречаемости.
    const attributeValues = new Set(data.map((row) => (row[i])));
    const numRecords = data.length;
    let intrinsicInfo = 0;

    for (const attributeValue of attributeValues) {
      const probability = data.filter((row) => row[i] === attributeValue).length / numRecords;
      intrinsicInfo -= probability * Math.log2(probability);
    }

    return intrinsicInfo;
  }


  private calculateNumberAttrEntropy(inputData: (string | number)[][], attributeIndex: number): number {
    const attributeValues = new Set(inputData.map(row => row[attributeIndex]));
    let entropy = 0;

    attributeValues.forEach(attributeValue => {
      const subset = inputData.filter(row => row[attributeIndex] === attributeValue);
      const classCounts = new Map<string | number, number>();

      subset.forEach(row => {
        const classLabel = row[row.length - 1];
        classCounts.set(classLabel, (classCounts.get(classLabel) || 0) + 1);
      });

      let subsetEntropy = 0;
      for (const count of classCounts.values()) {
        const probability = count / subset.length;
        subsetEntropy -= probability * Math.log2(probability);
      }
      entropy += (subset.length / inputData.length) * subsetEntropy;
    });

    return entropy;
  }


  private calculateStringAttrEntropy(attributeValue: string, data: (string | number)[][], i: number): number {
    const probabilitySet = data.filter((row) => row[i] === attributeValue);
    const localProbability = probabilitySet.length / data.length;
    const attributeTypes = probabilitySet.map((row) => row[row.length - 1]);

    const entropy = this.calculateShannonEntropy(attributeTypes);
    return localProbability * entropy;
  }


  private calculateShannonEntropy(types: (string | number)[]): number {
    const entryCounts = new Map<string | number, number>();
    for (const type of types) {
      entryCounts.set(type, (entryCounts.get(type) || 0) + 1);
    }

    let entropy = 0;
    const typesLength = types.length;
    for (const value of entryCounts.values()) {
      const probability = value / typesLength;
      entropy -= probability * Math.log2(probability);
    }
    return entropy;
  }


  private getMostPopularAttribute(attributes: (string | number)[]): string | number {
    const attributeCounts = new Map<string | number, number>();
    for (const attribute of attributes) {
      attributeCounts.set(attribute, (attributeCounts.get(attribute) || 0) + 1);
    }
    let mostPopularAttribute: (string | number) = undefined;
    let maxCount = -Infinity;

    for (const [attribute, count] of attributeCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostPopularAttribute = attribute;
      }
    }
    return mostPopularAttribute;
  }


  public traverseDecisionTree(node: TreeNode, path: (string | number)[], way: (string | number)[]): (string | number)[] {

    if (node.children.length === 0) {
      way.push(node.attribute);
      return way;
    }

    for (let i = 0; i < path.length; ++i) {
      const attributeValue = path[i];
      const childNode = node.children.find((child) => child.value === attributeValue);
      const childNodeAttribute = node.children.find((child) => child.attribute === attributeValue);

      if (childNode !== undefined) {
        way.push(this.headers[i].name, attributeValue);
        return this.traverseDecisionTree(childNode.children[0], path, way);

      } else if (childNodeAttribute !== undefined) {
        way.push(this.headers[i].name, attributeValue);
        return this.traverseDecisionTree(childNodeAttribute.children[0], path, way);
      }
    }
    return [];
  }
}


