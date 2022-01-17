export class Node {
  keys: Array<number> | undefined | null = null;
  children: Array<Node> | undefined | null = null;
  currentKeys: number | undefined | null = null;
  leaf: boolean | undefined | null = null;
}
