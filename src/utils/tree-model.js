import { union, unionBy, difference, differenceBy } from "lodash";
import { buildNodesMap, contains, path } from "@/utils/tree-utils";
import EventManager from "./event-manager";

export default class extends EventManager {
  constructor(root) {
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
    this.selected = Object.values(this.nodesMap)
      .filter(({ selected }) => selected)
      .map(({ id }) => id);
    this._updateVisibleTree();
    this.draggedNodeId = undefined;
  }

  _updateVisibleTree() {
    this.visibleTree = this._computeVisibleTree(this.root.id, this.expanded);
  }

  _detachNodeFromParent(node) {
    const parent = this.nodesMap[node.parent];
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
    const parent = this.nodesMap[parentId];
    if (parent) {
      node.parent = parent.id;
      parent.children = unionBy(
        parent.children || [],
        [{ ...node }],
        ({ id }) => id
      );
    }
  }

  _computeVisibleTree(nodeId, expanded) {
    const node = this.nodesMap[nodeId];
    const children = node.children || [];
    return {
      ...node,
      children: expanded.includes(node.id)
        ? children.map(child => this._computeVisibleTree(child.id, expanded))
        : [],
      isLeaf: children.length === 0
    };
  }

  expandNode(nodeId) {
    this.expanded = path(nodeId, this.nodesMap);
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

    const draggedNode = this.nodesMap[this.draggedNodeId];

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
}
