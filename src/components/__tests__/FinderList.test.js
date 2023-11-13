import { vi, describe, it, beforeEach, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderList from "../FinderList.vue";

vi.mock("@/utils/tree-model");

describe("FinderList", () => {
  let treeModel;
  const tree = {
    id: "test1",
    children: [
      {
        id: "test11",
        label: "Test 11",
        selected: true,
        children: [
          {
            id: "test111",
            label: "Test 111",
          },
          {
            id: "test112",
            label: "Test 112",
          },
        ],
        isLeaf: false,
      },
      {
        id: "test12",
        label: "Test 12",
        isLeaf: true,
      },
    ],
  };
  beforeEach(() => {
    treeModel = new TreeModel(tree);
  });

  it("should match snapshot", () => {
    const wrapper = mount(FinderList, {
      props: {
        treeModel,
        items: tree.children,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot if no item", () => {
    const wrapper = mount(FinderList, {
      props: {
        treeModel,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot if `dragEnabled` is true", () => {
    const wrapper = mount(FinderList, {
      props: {
        treeModel,
        items: tree.children,
        dragEnabled: true,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot if `selectable` is true", () => {
    const wrapper = mount(FinderList, {
      props: {
        treeModel,
        items: tree.children,
        selectable: true,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should handle focus with arrows up/down", async () => {
    const wrapper = mount(FinderList, {
      props: {
        treeModel,
        items: tree.children,
      },
      attachTo: document.body,
    });

    const firstItem = wrapper.findAll(".item")[0];
    const secondItem = wrapper.findAll(".item")[1];

    firstItem.element.focus();
    expect(document.activeElement).toBe(firstItem.element);

    // Up doesn't have any effect since the first item is focused
    await firstItem.trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(firstItem.element);

    // Down navigates to the second item
    await firstItem.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(secondItem.element);

    // Up navigates back to the first item
    await secondItem.trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(firstItem.element);
  });

  it("should handle focus with arrows up/down when drag enabled", async () => {
    const wrapper = mount(FinderList, {
      props: {
        treeModel,
        items: tree.children,
        dragEnabled: true,
      },
      attachTo: document.body,
    });

    const firstItem = wrapper.findAll(".item")[0];
    const secondItem = wrapper.findAll(".item")[1];

    firstItem.element.focus();
    expect(document.activeElement).toBe(firstItem.element);

    // Up doesn't have any effect since the first item is focused
    await firstItem.trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(firstItem.element);

    // Down navigates to the second item
    await firstItem.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(secondItem.element);

    // Up navigates back to the first item
    await secondItem.trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(firstItem.element);
  });
});
