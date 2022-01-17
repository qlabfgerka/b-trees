import { Injectable } from '@angular/core';
import { Node } from 'src/app/models/node/node.model';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  constructor() {}

  public search(current: Node, key: number): number {
    let i = 0;
    while (i < current.currentKeys! && key > current.keys![i]) ++i;

    if (i < current.currentKeys! && key == current.keys![i]) return i;

    if (current.leaf) return -1;
    else return this.search(current.children![i], key);
  }

  public initializeTree(tree: Node): Node {
    tree = new Node();
    tree.leaf = true;
    tree.currentKeys = 0;
    tree.children = new Array<Node>();
    tree.keys = new Array<number>();
    return tree;
  }

  public insert(tree: Node, key: number, degree: number): Node {
    const r: Node = tree;

    if (r.currentKeys === 2 * degree - 1) {
      const s: Node = new Node();
      s.children = new Array<Node>();
      s.keys = new Array<number>();
      tree = s;
      s.leaf = false;
      s.currentKeys = 0;
      s.children[0] = r;
      this.splitChild(s, 0, r, degree);
      this.insertNonfull(s, key, degree);
      return s;
    } else {
      this.insertNonfull(r, key, degree);
      return r;
    }
  }

  public insertNonfull(tree: Node, key: number, degree: number): void {
    let i = tree.currentKeys! - 1;

    if (tree.leaf) {
      while (i >= 0 && key < tree.keys![i]) {
        tree.keys![i + 1] = tree.keys![i];
        --i;
      }
      tree.keys![i + 1] = key;
      ++tree.currentKeys!;
    } else {
      while (i >= 0 && key < tree.keys![i]) {
        --i;
      }
      ++i;
      if (tree.children![i].currentKeys === 2 * degree - 1) {
        this.splitChild(tree, i, tree.children![i], degree);
        if (key > tree.keys![i]) ++i;
      }
      this.insertNonfull(tree.children![i], key, degree);
    }
  }

  public splitChild(tree: Node, i: number, y: Node, degree: number) {
    const z = new Node();
    z.children = new Array<Node>();
    z.keys = new Array<number>();
    z.leaf = y.leaf;
    z.currentKeys = degree - 1;

    for (let j = 0; j < degree - 1; j++) {
      z.keys[j] = y.keys![j + degree];
    }

    if (!y.leaf) {
      for (let j = 0; j < degree; j++) {
        z.children[j] = y.children![j + degree];
      }
    }

    y.currentKeys = degree - 1;

    for (let j = tree.currentKeys!; j > i; j--) {
      tree.children![j + 1] = tree.children![j];
    }

    tree.children![i + 1] = z;

    for (let j = tree.currentKeys! - 1; j > i - 1; j--) {
      tree.keys![j + 1] = tree.keys![j];
    }

    tree.keys![i] = y.keys![degree - 1];
    ++tree.currentKeys!;
  }
}
