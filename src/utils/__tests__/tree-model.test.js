import { sortBy } from "lodash-es";
import TreeModel from "../tree-model";

describe("TreeModel", () => {
  const node = {
    id: "test1",
    children: [
      {
        id: "test11",
        selected: true,
        children: [
          {
            id: "test111"
          },
          {
            id: "test112"
          }
        ]
      },
      {
        id: "test12"
      }
    ]
  };

  let model;
  let onExpand;
  let onSelect;
  let onMove;

  beforeEach(() => {
    onExpand = jest.fn();
    onSelect = jest.fn();
    onMove = jest.fn();

    model = new TreeModel(node);
    model.on("expand", onExpand);
    model.on("select", onSelect);
    model.on("move", onMove);
  });

  describe("#constructor", () => {
    it("should initialize the TreeModel instance", () => {
      expect(model.expanded).toEqual(["test1"]);
      expect(model.visibleTree).toEqual({
        id: "test1",
        children: [
          {
            id: "test11",
            selected: true,
            children: [],
            isLeaf: false,
            parent: "test1"
          },
          {
            id: "test12",
            children: [],
            isLeaf: true,
            parent: "test1"
          }
        ],
        isLeaf: false
      });
    });

    it("should initialize the TreeModel instance with an undefined root", () => {
      const treeModelWithNoRoot = new TreeModel();
      expect(treeModelWithNoRoot.expanded).toEqual([]);
      expect(treeModelWithNoRoot.visibleTree).toEqual({});
    });
  });

  describe("#expandNode", () => {
    it("should return `true` if node is selected", () => {
      model.expandNode("test11");
      expect(model.isNodeExpanded("test11")).toBe(true);
      expect(onExpand).toHaveBeenCalledWith(["test1", "test11"]);
      expect(model.visibleTree).toEqual({
        id: "test1",
        children: [
          {
            id: "test11",
            selected: true,
            children: [
              {
                id: "test111",
                children: [],
                isLeaf: true,
                parent: "test11"
              },
              {
                id: "test112",
                children: [],
                isLeaf: true,
                parent: "test11"
              }
            ],
            isLeaf: false,
            parent: "test1"
          },
          {
            id: "test12",
            children: [],
            isLeaf: true,
            parent: "test1"
          }
        ],
        isLeaf: false
      });
    });
  });

  describe("#isNodeSelected", () => {
    it("should return `true` if node is selected", () => {
      expect(model.isNodeSelected("test11")).toBe(true);
    });

    it("should return `false` if node is not selected", () => {
      expect(model.isNodeSelected("test1")).toBe(false);
      expect(model.isNodeSelected("test12")).toBe(false);
    });
  });

  describe("#selectNode", () => {
    it("should select node and trigger an event", () => {
      model.selectNode("test12", true);
      expect(onSelect).toHaveBeenCalledWith(["test11", "test12"]);
      expect(model.isNodeSelected("test12")).toBe(true);
    });

    it("should unselect a node and trigger an event", () => {
      model.selectNode("test11", false);
      expect(onSelect).toHaveBeenCalledWith([]);
      expect(model.isNodeSelected("test11")).toBe(false);
    });
  });

  describe("#filter", () => {
    it("should filter the visible tree", () => {
      model.filter = ({ id }) => id === "test11";
      expect(sortBy(model.filtered)).toEqual(["test1", "test11"]);
      expect(model.visibleTree).toEqual({
        id: "test1",
        children: [
          {
            id: "test11",
            selected: true,
            children: [],
            isLeaf: false,
            parent: "test1"
          }
        ],
        isLeaf: false
      });
    });

    it("should unfilter the visible tree if undefined", () => {
      model.filter = ({ id }) => id === "test11";
      model.filter = undefined;

      expect(model.filtered).toEqual([]);
      expect(model.visibleTree).toEqual({
        id: "test1",
        children: [
          {
            id: "test11",
            selected: true,
            children: [],
            isLeaf: false,
            parent: "test1"
          },
          {
            id: "test12",
            children: [],
            isLeaf: true,
            parent: "test1"
          }
        ],
        isLeaf: false
      });
    });
  });

  describe("Drag & Drop", () => {
    describe("#startDrag", () => {
      it("should set the given node ID as dragged node id", () => {
        model.startDrag("test12");
        expect(model.draggedNodeId).toBe("test12");
      });

      it("should do nothing if the given node ID is not in the tree", () => {
        model.startDrag("unknown");
        expect(model.draggedNodeId).toBeUndefined();
      });
    });

    describe("#stopDrag", () => {
      it("should set the given node ID as dragged node id", () => {
        model.startDrag("test12");
        expect(model.draggedNodeId).toBe("test12");
        model.stopDrag();
        expect(model.draggedNodeId).toBeUndefined();
      });
    });

    describe("#isDragging", () => {
      it("should return `false` if not dragging", () => {
        expect(model.isDragging()).toBe(false);
        model.startDrag("test12");
        model.stopDrag();
        expect(model.isDragging()).toBe(false);
      });

      it("should return `true` if dragging", () => {
        model.startDrag("test12");
        expect(model.isDragging()).toBe(true);
      });
    });

    describe("#isNodeDragged", () => {
      it("should return `false` if not dragging", () => {
        expect(model.isNodeDragged("test12")).toBe(false);
        model.startDrag("test12");
        model.stopDrag();
        expect(model.isNodeDragged("test12")).toBe(false);
      });

      it("should return `true` if the given node ID is the ID of the dragged node", () => {
        model.startDrag("test12");
        expect(model.isNodeDragged("test12")).toBe(true);
      });
    });

    describe("#dropOnNode", () => {
      it("should do nothing if not dragging", () => {
        model.dropOnNode("test11");
        expect(model.visibleTree).toEqual({
          id: "test1",
          children: [
            {
              id: "test11",
              selected: true,
              children: [],
              isLeaf: false,
              parent: "test1"
            },
            {
              id: "test12",
              children: [],
              isLeaf: true,
              parent: "test1"
            }
          ],
          isLeaf: false
        });
        expect(onMove).not.toHaveBeenCalled();
      });

      it("should do nothing if the given node ID is the ID of the dragged node", () => {
        model.startDrag("test12");
        model.dropOnNode("test12");
        expect(model.visibleTree).toEqual({
          id: "test1",
          children: [
            {
              id: "test11",
              selected: true,
              children: [],
              isLeaf: false,
              parent: "test1"
            },
            {
              id: "test12",
              children: [],
              isLeaf: true,
              parent: "test1"
            }
          ],
          isLeaf: false
        });
        expect(onMove).not.toHaveBeenCalled();
      });

      it("should do nothing if the given node ID is a child of the dragged node", () => {
        model.startDrag("test11");
        model.dropOnNode("test112");
        expect(model.visibleTree).toEqual({
          id: "test1",
          children: [
            {
              id: "test11",
              selected: true,
              children: [],
              isLeaf: false,
              parent: "test1"
            },
            {
              id: "test12",
              children: [],
              isLeaf: true,
              parent: "test1"
            }
          ],
          isLeaf: false
        });
        expect(onMove).not.toHaveBeenCalled();
      });

      it("should move the dragged node", () => {
        model.startDrag("test12");
        model.dropOnNode("test112");
        expect(model.visibleTree).toEqual({
          id: "test1",
          children: [
            {
              id: "test11",
              selected: true,
              children: [
                {
                  id: "test111",
                  children: [],
                  isLeaf: true,
                  parent: "test11"
                },
                {
                  id: "test112",
                  children: [
                    {
                      id: "test12",
                      children: [],
                      isLeaf: true,
                      parent: "test112"
                    }
                  ],
                  isLeaf: false,
                  parent: "test11"
                }
              ],
              isLeaf: false,
              parent: "test1"
            }
          ],
          isLeaf: false
        });
        expect(onExpand).toHaveBeenCalledWith([
          "test1",
          "test11",
          "test112",
          "test12"
        ]);
        expect(onMove).toHaveBeenCalled();
      });
    });
  });
});
