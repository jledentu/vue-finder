import { union, difference } from "lodash";
import { path, buildNodesMap } from "@/utils/tree-utils";

export default class {
  constructor(treeData) {
    this.nodesMap = buildNodesMap(treeData);
    this.selected = Object.values(this.nodesMap).filter(node => node.selected);
    this.expanded = [];
    this.draggedItem = undefined;
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
}
