import { union, unionBy, difference, differenceBy } from "lodash-es";
import { buildNodesMap, contains, path, filterTree } from "@/utils/tree-utils";
import EventManager from "./event-manager";

export default class extends EventManager {
  constructor(root, filter) {
    super();
    Object.defineProperty(this, "root", {
      value: root,
      configurable: false
    });
    Object.defineProperty(this, "nodesMap", {
      value: buildNodesMap(root),
      configurable: false
    });
    this.expanded = [this.root.id];
    this.expandedWithoutFilter = this.expanded;
    this.selected = Object.values(this.nodesMap)
      .filter(({ selected }) => selected)
      .map(({ id }) => id);

    this._filter = filter;
    this.filtered = [];

    this._updateVisibleTree();
    this.draggedNodeId = undefined;
  }

  _updateVisibleTree() {
    let visibleTree = this.root;

    if (this._filter) {
      visibleTree = filterTree(this._filter, this.root);
    }

    this.visibleTree = this._computeVisibleTree(visibleTree, this.expanded);
  }

  _detachNodeFromParent(node) {
    const parent = this._getNode(node.parent);
    node.parent = undefined;
    if (parent) {
      parent.children = differenceBy(
        parent.children || [],
        [node],
        ({ id }) => id
      );
    }
  }

  _attachNodeToParent(node, parentId) {
    this._detachNodeFromParent(node);
    const parent = this._getNode(parentId);
    if (parent) {
      node.parent = parent.id;
      parent.children = unionBy(
        parent.children || [],
        [{ ...node }],
        ({ id }) => id
      );
    }
  }

  _computeVisibleTree(node, expanded) {
    let children = node.children || [];

    return {
      ...node,
      children: expanded.includes(node.id)
        ? children.map(child => this._computeVisibleTree(child, expanded))
        : [],
      isLeaf: children.length === 0
    };
  }

  _getNode(nodeId) {
    return this.nodesMap[nodeId];
  }

  expandNode(nodeId) {
    this.expanded = path(nodeId, this.nodesMap);
    this.expandedWithoutFilter = this.expanded;
    this._updateVisibleTree();
    this.trigger("expand", this.expanded);
  }

  isNodeExpanded(nodeId) {
    return this.expanded.includes(nodeId);
  }

  selectNode(nodeId, isSelected) {
    this.selected = (isSelected ? union : difference)(this.selected, [nodeId]);
    this.trigger("select", this.selected);
  }

  isNodeSelected(nodeId) {
    return this.selected.includes(nodeId);
  }

  startDrag(nodeId) {
    if (this.nodesMap.hasOwnProperty(nodeId)) {
      this.draggedNodeId = nodeId;
    }
  }

  stopDrag() {
    this.draggedNodeId = undefined;
  }

  dropOnNode(nodeId) {
    if (!this.isDragging() || this.isNodeDragged(nodeId)) {
      return;
    }

    const draggedNode = this._getNode(this.draggedNodeId);

    if (contains(draggedNode, nodeId)) {
      return;
    }

    this._attachNodeToParent(draggedNode, nodeId);

    // Expand the dragged node
    this.expandNode(this.draggedNodeId);

    this.draggedNodeId = undefined;
    this._updateVisibleTree();
    this.trigger("move");
  }

  isNodeDragged(nodeId) {
    return this.draggedNodeId === nodeId;
  }

  isDragging() {
    return this.draggedNodeId !== undefined;
  }

  /**
   * Function used to filter displayed items of the tree.
   *
   * @param {Function} newFilter
   */
  set filter(newFilter) {
    this._filter = newFilter;

    if (
      !this.expandedWithoutFilter.some(nodeId => {
        const node = this._getNode(nodeId);
        return (
          this._filter(node) ||
          (node.children && node.children.some(this._filter))
        );
      })
    ) {
      // If the expanded nodes do not match the filter,
      // Expand the first node matching
      this.expanded = [this.root.id];
    } else {
      // The previously expanded nodes match, re-expanded
      this.expanded = this.expandedWithoutFilter;
    }
    this._updateVisibleTree();
  }
}
