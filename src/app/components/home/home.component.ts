import { Component, OnInit } from '@angular/core';
import { Node } from 'src/app/models/node/node.model';
import { TreeService } from 'src/app/services/tree/tree.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public key!: number;
  public tree!: Node;
  public degree!: number;

  constructor(private readonly treeService: TreeService) {}

  ngOnInit(): void {
    this.degree = 2;
    this.tree = this.treeService.initializeTree(this.tree);
  }

  public insert(key: number): void {
    if (!this.tree) return;

    console.log(key);

    this.tree = this.treeService.insert(this.tree, key, this.degree);

    //console.log(this.tree);
    this.displayTree(this.tree);
  }

  public openFile(event: any): void {
    let array: Array<number> = new Array<number>();
    console.log(event.files);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      array = e.target.result.split(' ');
      let i = 0;
      setInterval(() => {
        if(i < array.length) {
          this.insert(+array[i]);
          ++i;
        }
      }, 1000);
    };
    reader.readAsText(event.files[0]);
  }

  private displayTree(tree: Node): void {
    let i = 0;
    while(i < tree.currentKeys!) {
      if(!tree.leaf) this.displayTree(tree.children![i]);
      console.log(tree.keys![i])
      ++i;
    }
    if(!tree.leaf) this.displayTree(tree.children![i]);
  }
}
