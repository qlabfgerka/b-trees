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

  constructor(private readonly treeService: TreeService) {}

  ngOnInit(): void {
    this.degree = 2;
    this.tree = this.treeService.initializeTree(this.tree);
    this.text = '';
  }

  public insert(key: number): void {
    if (!this.tree) return;

    this.tree = this.treeService.insert(this.tree, key, this.degree);

    //console.log(this.tree);
    //this.displayTree(this.tree);
    this.nodeID = 0;
    this.text = '';
    this.displayTree(this.tree, 0, 0);
    //console.log(this.text);
    this.drawNodes(this.tree, 0);
  }

  public openFile(event: any): void {
    let array: Array<number> = new Array<number>();
    const reader = new FileReader();
    reader.onload = (e: any) => {
      array = e.target.result.split(' ');
      let i = 0;
      setInterval(() => {
        if (i < array.length) {
          this.insert(+array[i]);
          ++i;
          if (i == array.length) {
          }
        }
      }, 2000);
    };
    reader.readAsText(event.files[0]);
  }

  private displayTree(tree: Node, fIndex: number, sender: number): void {
    let j;
    console.log(tree);
    console.log('ID: ' + this.nodeID + ' <f' + fIndex + '> FROM: ' + sender);

    this.text += `node${this.nodeID}[label ="`;
    for (j = 0; j < tree.currentKeys!; j++) {
      this.text += `<f${j}> |${tree.keys![j]}| `;
    }
    if (sender == 0 && this.nodeID == 0) {
      this.text += `<f${j}>"];`;
    } else {
      this.text += `<f${j}>"];\n"node${sender}":f${fIndex} -> "node${
        this.nodeID
      }"\n
      `;
    }
    ++this.nodeID;

    let i = 0,
      id = this.nodeID;

    while (i < tree.currentKeys!) {
      if (!tree.leaf) this.displayTree(tree.children![i], i, id - 1);
      //console.log(tree.keys![i]);
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
}
