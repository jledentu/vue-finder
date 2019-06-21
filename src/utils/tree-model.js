import { union, difference } from "lodash";
import { path, buildNodesMap } from "@/utils/tree-utils";

export default class {
  constructor(treeData, refreshData) {
    Object.defineProperty(this, "nodesMap", {
      value: buildNodesMap(treeData),
      configurable: false
    });
    this.selected = Object.values(this.nodesMap).filter(node => node.selected);
    this.expanded = [];
    this.draggedItem = undefined;
    this.refreshData = refreshData;
  }

  expandNode(nodeId) {
    this.expanded = path(nodeId, this.nodesMap);
  }

  isNodeExpanded(nodeId) {
    return this.expanded.includes(nodeId);
  }

  selectNode(nodeId, isSelected) {
    this.selected = (isSelected ? union : difference)(this.selected, [nodeId]);
  }

  isNodeSelected(nodeId) {
    return this.selected.includes(nodeId);
  }

  startDrag(nodeId) {
    this.draggedNode = nodeId;
  }

  stopDrag() {
    this.draggedNode = undefined;
  }

  dropOnNode(nodeId) {
    if (this.draggedNode) {
      this.nodesMap[this.draggedNode].parent = nodeId;
      this.draggedNode = undefined;
      this.refreshData();
    }
  }
}
