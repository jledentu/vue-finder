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

export function buildNodesMap(tree) {
  const nodesMap = {};

  function buildChildrenMap(node, parentId) {
    if (!node) {
      return;
    }

    nodesMap[node.id] = {
      ...node,
      ...(parentId ? { parent: parentId } : {})
    };

    if (node.children && node.children.length) {
      node.children.forEach(child => buildChildrenMap(child, node.id));
    }
  }

  buildChildrenMap(tree);
  return nodesMap;
}
