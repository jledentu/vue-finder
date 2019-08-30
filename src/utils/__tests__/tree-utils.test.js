import { sortBy } from "lodash-es";
import { contains, buildNodesMap, path, getFilteredNodes } from "../tree-utils";

describe("Tree Utils", () => {
  describe("#contains", () => {
    const node = {
      id: "test1",
      children: [
        {
          id: "test11"
        },
        {
          id: "test12"
        }
      ]
    };

    it("should return false if node is empty", () => {
      expect(contains({}, "unknown")).toBe(false);
    });

    it("should return false if node does not contain the given node", () => {
      expect(contains(node, "unknown")).toBe(false);
    });

    it("should return true since node contains itself", () => {
      expect(contains(node, "test1")).toBe(true);
    });

    it("should return true if node contains the given node", () => {
      expect(contains(node, "test12")).toBe(true);
    });
  });

  describe("#buildNodesMap", () => {
    it("should return {} if tree is an empty object", () => {
      expect(buildNodesMap({})).toEqual({});
    });

    it("should return the nodes map from a given tree", () => {
      expect(
        buildNodesMap({
          id: "test1",
          children: [
            {
              id: "test11",
              selected: true
            },
            {
              id: "test12"
            }
          ]
        })
      ).toEqual({
        test1: {
          id: "test1",
          children: [
            {
              id: "test11",
              selected: true
            },
            {
              id: "test12"
            }
          ]
        },
        test11: {
          parent: "test1",
          id: "test11",
          selected: true
        },
        test12: {
          parent: "test1",
          id: "test12"
        }
      });
    });
  });

  describe("#path", () => {
    const nodesMap = {
      test1: {},
      test11: {
        parent: "test1"
      },
      test12: {
        parent: "test1"
      }
    };

    it("should return [] if node not found", () => {
      expect(path("unknown", nodesMap)).toEqual([]);
    });

    it("should return the path to the given node", () => {
      expect(path("test1", nodesMap)).toEqual(["test1"]);
      expect(path("test11", nodesMap)).toEqual(["test1", "test11"]);
      expect(path("test12", nodesMap)).toEqual(["test1", "test12"]);
    });
  });

  describe("#getFilteredNodes", () => {
    const nodesMap = {
      test1: {
        id: "test1",
        children: [
          {
            id: "test11"
          },
          {
            id: "test12"
          }
        ]
      },
      test11: {
        parent: "test1",
        id: "test11",
        children: [
          {
            id: "test111"
          },
          {
            id: "test112"
          }
        ]
      },
      test12: {
        parent: "test1",
        id: "test12",
        keep: true
      },
      test111: {
        parent: "test11",
        id: "test11"
      },
      test112: {
        parent: "test11",
        id: "test112",
        keep: true
      }
    };

    it("should return the filtered nodes", () => {
      expect(
        sortBy(getFilteredNodes(node => node.keep, "test1", nodesMap))
      ).toEqual(["test1", "test11", "test112", "test12"]);
    });

    it("should return [] if no node matches", () => {
      expect(
        getFilteredNodes(node => node.id === "notfound", "test1", nodesMap)
      ).toEqual([]);
    });
  });
});
