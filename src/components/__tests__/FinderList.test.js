import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderList from "../FinderList";

jest.mock("@/utils/tree-model");

describe("FinderList", () => {
  let treeModel;
  let provide;
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
            label: "Test 111"
          },
          {
            id: "test112",
            label: "Test 112"
          }
        ],
        isLeaf: false
      },
      {
        id: "test12",
        label: "Test 12",
        isLeaf: true
      }
    ]
  };
  beforeEach(() => {
    treeModel = new TreeModel(tree);
    provide = {
      virtualize: false,
      itemHeight: 45
    };
  });

  it("should match snapshot", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children
      },
      provide
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot if no item", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel
      },
      provide
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot if `dragEnabled` is true", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children,
        dragEnabled: true
      },
      provide
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot if `selectable` is true", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children,
        selectable: true
      },
      provide
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle focus with arrows up/down", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children
      },
      attachTo: document.body,
      provide
    });

    const firstItem = wrapper.findAll(".item").at(0);
    const secondItem = wrapper.findAll(".item").at(1);

    firstItem.element.focus();
    expect(document.activeElement).toBe(firstItem.element);

    // Up doesn't have any effect since the first item is focused
    firstItem.trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(firstItem.element);

    // Down navigates to the second item
    firstItem.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(secondItem.element);

    // Up navigates back to the first item
    secondItem.trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(firstItem.element);
  });

  it("should handle focus with arrows up/down when drag enabled", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children,
        dragEnabled: true
      },
      attachTo: document.body,
      provide
    });

    const firstItem = wrapper.findAll(".item").at(0);
    const secondItem = wrapper.findAll(".item").at(1);

    firstItem.element.focus();
    expect(document.activeElement).toBe(firstItem.element);

    // Up doesn't have any effect since the first item is focused
    firstItem.trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(firstItem.element);

    // Down navigates to the second item
    firstItem.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(secondItem.element);

    // Up navigates back to the first item
    secondItem.trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(firstItem.element);
  });

  it("should handle virtualize option", async () => {
    provide.virtualize = true;
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children,
        dragEnabled: true
      },
      attachTo: document.body,
      provide
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.vm.visibleStart).toBe(0);
    expect(wrapper.vm.visibleEnd).toBe(2);
  });
});
