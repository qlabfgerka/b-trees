import { Component, OnInit } from '@angular/core';
import { Node } from 'src/app/models/node/node.model';
import { TreeService } from 'src/app/services/tree/tree.service';
import { graphviz } from 'd3-graphviz';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public key!: number;
  public tree!: Node;
  public degree!: number;
  public text!: string;
  public nodeID!: number;
  public array!: Array<number>;
  public interval!: any;
  public degreeSet: boolean = false;
  public found: string = '';

  constructor(private readonly treeService: TreeService) {}

  ngOnInit(): void {
    this.tree = this.treeService.initializeTree(this.tree);
    this.text = '';
    this.array = new Array<number>();
  }

  public async changeDegree(degree: number): Promise<void> {
    this.degreeSet = true;
    this.degree = degree;
    this.text = '';
    this.tree = this.treeService.initializeTree(this.tree);

    const temp = this.array;
    this.array = new Array<number>();

    if (temp.length > 0) {
      for (let i = 0; i < temp.length; i++) {
        this.insert(+temp[i]);
        await this.sleep();
      }
    }
  }

  public insert(key: number): void {
    if (!this.tree) return;

    this.array.push(key);

    this.tree = this.treeService.insert(this.tree, key, this.degree);

    this.nodeID = 0;
    this.text = '';
    this.displayTree(this.tree, 0, 0);
    this.drawNodes(this.tree, 0);
  }

  public search(key: number): void {
    if (this.treeService.search(this.tree, key) == -1)
      this.found = `${key} does not exist in the B-Tree.`;
    else this.found = `${key} was found in the tree.`;
  }

  public async openFile(event: any): Promise<void> {
    let array: Array<number> = new Array<number>();
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      array = e.target.result.split(' ');
      for (let i = 0; i < array.length; i++) {
        this.insert(+array[i]);
        await this.sleep();
      }
    };
    reader.readAsText(event.files[0]);
  }

  private displayTree(tree: Node, fIndex: number, sender: number): void {
    let j;

    this.text += `node${this.nodeID}[label ="`;
    for (j = 0; j < tree.currentKeys!; j++) {
      this.text += `<f${j}> |${tree.keys![j]}| `;
    }
    if (sender == 0 && this.nodeID == 0) {
      this.text += `<f${j}>"];`;
    } else {
      this.text += `<f${j}>"];\n"node${sender}":f${fIndex} -> "node${this.nodeID}"\n
      `;
    }
    ++this.nodeID;

    let i = 0,
      id = this.nodeID;

    while (i < tree.currentKeys!) {
      if (!tree.leaf) this.displayTree(tree.children![i], i, id - 1);
      ++i;
    }
    if (!tree.leaf) this.displayTree(tree.children![i], i, id - 1);
  }

  private drawNodes(tree: Node, index: number): void {
    graphviz('#graph').renderDot(`
    digraph G {
      node [shape = record,height=.1];
      ${this.text}
     }
    `);
  }

  private sleep() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
