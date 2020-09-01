import { isNil, union, difference, differenceBy } from "lodash-es";
import {
  buildNodesMap,
  contains,
  path,
  getFilteredNodes
} from "@/utils/tree-utils";
import EventManager from "./event-manager";

export default class extends EventManager {
  constructor(root = {}, options = {}) {
    super();
    Object.defineProperty(this, "_root", {
      value: root,
      configurable: false,
      writable: true
    });
    Object.defineProperty(this, "nodesMap", {
      value: buildNodesMap(root),
      configurable: false,
      writable: true
    });

    this._initExpanded(options.defaultExpanded);

    this.selected = Object.values(this.nodesMap)
      .filter(({ selected }) => selected)
      .map(({ id }) => id);

    this.filtered = [];
    if (options.filter) {
      this.filter = options.filter;
    }

    this._updateVisibleTree();
    this.draggedNodeId = undefined;
  }

  _initExpanded(defaultExpanded) {
    if (defaultExpanded) {
      this.expandNode(defaultExpanded);
    } else if (this.root && this.root.id) {
      this.expanded = [this.root.id];
      this.expandedWithoutFilter = this.expanded;
    } else {
      this.expanded = [];
      this.expandedWithoutFilter = [];
    }
  }

  _updateVisibleTree() {
    this.visibleTree = this._computeVisibleTree(this.root.id, {
      expanded: this.expanded
    });
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

  _attachNodeToParent(node, parentId, index) {
    this._detachNodeFromParent(node);
    const parent = this._getNode(parentId);
    if (parent) {
      node.parent = parent.id;

      if (isNil(index)) {
        parent.children = [...(parent.children || []), { ...node }];
      } else {
        parent.children = [
          ...(parent.children || []).slice(0, index),
          { ...node },
          ...(parent.children || []).slice(index)
        ];
      }
    }
  }

  _computeVisibleTree(nodeId, { expanded }) {
    const node = this._getNode(nodeId);

    if (!node) {
      return {};
    }
    const children = node.children || [];
    return {
      ...node,
      children: expanded.includes(node.id)
        ? children
            .filter(child => this.isNodeFiltered(child.id))
            .map(child =>
              this._computeVisibleTree(child.id, {
                expanded
              })
            )
        : [],
      isLeaf: children.length === 0
    };
  }

  _getNode(nodeId) {
    return this.nodesMap[nodeId];
  }

  /**
   * Expand a node.
   *
   * @param {string} nodeId      ID of the node to expand
   * @param {string} sourceEvent Name of the event that triggered the expand
   */
  expandNode(nodeId, sourceEvent) {
    this.expanded = path(nodeId, this.nodesMap);
    this.expandedWithoutFilter = this.expanded;
    this._updateVisibleTree();
    this.trigger("expand", this.expanded, sourceEvent);
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

  isNodeFiltered(nodeId) {
    return !this._filter || this.filtered.includes(nodeId);
  }

  startDrag(nodeId) {
    if (Object.prototype.hasOwnProperty.call(this.nodesMap, nodeId)) {
      this.draggedNodeId = nodeId;
    }
  }

  stopDrag() {
    this.draggedNodeId = undefined;
  }

  isParent(parentNodeId, nodeId) {
    const parentNode = this._getNode(parentNodeId);
    return !!parentNode && contains(parentNode, nodeId);
  }

  hasChildren(nodeId) {
    return this._getNode(nodeId).children
      ? this._getNode(nodeId).children.length
      : false;
  }

  dropOnNode(nodeId, index) {
    if (!this.isDragging() || this.isNodeDragged(nodeId)) {
      return;
    }

    const draggedNode = this._getNode(this.draggedNodeId);

    if (contains(draggedNode, nodeId)) {
      return;
    }

    this._attachNodeToParent(draggedNode, nodeId, index);

    // Expand the dragged node
    this.expandNode(this.draggedNodeId, "drop");

    this.draggedNodeId = undefined;
    this._updateVisibleTree();
    this.trigger("move", {
      moved: draggedNode.id,
      to: nodeId,
      index
    });
  }

  isNodeDragged(nodeId) {
    return this.draggedNodeId === nodeId;
  }

  isDragging() {
    return this.draggedNodeId !== undefined;
  }

  get root() {
    return this._root;
  }

  set root(newRoot = {}) {
    this._root = newRoot;
    this.nodesMap = buildNodesMap(newRoot);

    if (!this.expanded.length || this.expanded.some(id => !this.nodesMap[id])) {
      // Initialize the expanded since not compatible with the new tree
      this._initExpanded();
    }

    this._applyFilter();
    this._updateVisibleTree();
  }

  /**
   * Function used to filter displayed items of the tree.
   *
   * @param {Function} newFilter
   */
  set filter(newFilter) {
    this._filter = newFilter;

    this._applyFilter();
    this._updateVisibleTree();
  }

  _applyFilter() {
    if (!this._filter) {
      this.filtered = [];
    } else {
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

      this.filtered = getFilteredNodes(
        this._filter,
        this.root.id,
        this.nodesMap
      );
    }
  }
}
