/**
 * Indicate whether an ID matches the given item or one of its children, or not.
 *
 * @param {Object} item Item data
 * @param {String} id   ID of the item to find
 * @return {Boolean} `true` if `id` matches item or one of its children
 */
export function contains(item, id) {
  return (
    item.id === id ||
    (item.children ? item.children.some(child => contains(child, id)) : false)
  );
}

/**
 * Build a map between IDs and matching nodes from a tree.
 *
 * @param {Object} tree Root node
 * @return {Object} Built map
 */
export function buildNodesMap(tree) {
  const nodesMap = {};

  function buildChildrenMap(node, parentId) {
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
 * @param {string} id       ID (key) of the node
 * @param {Object} nodesMap Map of keys -> nodes
 * @return {Array<string>} List of node IDs composing a path to a given node
 */
export function path(id, nodesMap) {
  function parentPath(id) {
    const node = nodesMap[id];

    if (!node) {
      return [];
    }

    return [...parentPath(node.parent), id];
  }

  return parentPath(id, []);
}

/**
 * Return a tree with only its filtered nodes.
 *
 * @param {Function} filterFunction Function used to filter nodes
 * @param {Object}   tree           Tree to filter
 */
export function filterTree(filterFunction, tree) {
  function filter(node) {
    const filteredChildren = (node.children || [])
      .map(filter)
      .filter(({ toRemove }) => !toRemove);

    if (filteredChildren.length === 0 && !filterFunction(node)) {
      return {
        ...node,
        toRemove: true
      };
    } else {
      return {
        ...node,
        children: filteredChildren
      };
    }
  }

  const filteredTree = filter(tree);

  return filteredTree.toRemove ? {} : filteredTree;
}
