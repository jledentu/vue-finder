export interface Node {
  id?: string;
  // List of child nodes
  children?: Node[];
  // ID of the parent node
  parent?: string;
  selected?: boolean;
  selectable?: boolean;
}

export interface NodeMap {
  [id: string]: Node;
}

/**
 * Indicate whether an ID matches the given item or one of its children, or not.
 *
 * @param item Item data
 * @param id   ID of the item to find
 * @return `true` if `id` matches item or one of its children
 */
export function contains(item: Readonly<Node>, id: string): boolean {
  return (
    item.id === id ||
    (item.children ? item.children.some(child => contains(child, id)) : false)
  );
}

/**
 * Build a map between IDs and matching nodes from a tree.
 *
 * @param tree Root node
 * @return Built map
 */
export function buildNodesMap(tree: Readonly<Node>): NodeMap {
  const nodesMap: NodeMap = {};

  function buildChildrenMap(node: Node, parentId?: string): void {
    if (!node || !node.id) {
      return;
    }

    nodesMap[node.id] = {
      ...node,
      ...(parentId ? { parent: parentId } : {})
    };

    if (node.children) {
      for (
        let index = 0, length = node.children.length;
        index < length;
        ++index
      ) {
        buildChildrenMap(node.children[index], node.id);
      }
    }
  }

  buildChildrenMap(tree);
  return nodesMap;
}

/**
 * Get a path to a node.
 *
 * @param id       ID (key) of the node
 * @param nodesMap Map of keys -> nodes
 * @return List of node IDs composing a path to a given node
 */
export function path(id: string, nodesMap: Readonly<NodeMap>): string[] {
  function parentPath(id: string): string[] {
    const node = nodesMap[id];

    if (!node) {
      return [];
    }

    return [...(node.parent ? parentPath(node.parent) : []), id];
  }

  return parentPath(id);
}

/**
 * Return nodes matched by a filtered function, and their parents.
 *
 * @param filterFunction Function used to filter nodes
 * @param rootNodeId     Root node to filter
 * @param nodesMap       Map of keys -> nodes
 * @return List of nodes
 */
export function getFilteredNodes(
  filterFunction: Function,
  rootNodeId: string,
  nodesMap: NodeMap
): string[] {
  const filteredNodes: string[] = [];

  function filter(nodeId: string): Node & { toHide?: boolean } {
    const node = nodesMap[nodeId];
    const filteredChildren: Node[] = (node.children || [])
      .map(child => filter(child.id))
      .filter(({ toHide }) => !toHide);

    if (filteredChildren.length === 0 && !filterFunction(node)) {
      return {
        ...node,
        toHide: true
      };
    } else {
      filteredNodes.push(nodeId);
      return {
        ...node,
        children: filteredChildren
      };
    }
  }

  filter(rootNodeId);

  return filteredNodes;
}
