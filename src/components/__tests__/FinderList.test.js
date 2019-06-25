import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderList from "../FinderList";

jest.mock("@/utils/tree-model");

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
  });

  it("should match snapshot", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot if no item", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot if `dragEnabled` is true", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children,
        dragEnabled: true
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot if `selectable` is true", () => {
    const wrapper = mount(FinderList, {
      propsData: {
        treeModel,
        items: tree.children,
        selectable: true
      }
    });
    expect(wrapper).toMatchSnapshot();
  });
});
