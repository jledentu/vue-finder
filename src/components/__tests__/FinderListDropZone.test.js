import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderListDropZone from "../FinderListDropZone";

jest.mock("@/utils/tree-model");

describe("FinderListDropZone", () => {
  let treeModel;
  let node;
  const tree = {
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
  beforeEach(() => {
    treeModel = new TreeModel(tree);
    node = {
      id: "test111"
    };
  });

  it("should match snapshot", () => {
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match if drag enter and is dragging", () => {
    treeModel.isDragging.mockReturnValue(true);
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node,
        dragEnabled: true
      }
    });
    wrapper.trigger("dragenter");
    expect(wrapper).toMatchSnapshot();
  });

  it("should match if drag leave and is dragging", () => {
    treeModel.isDragging.mockReturnValue(true);
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node,
        dragEnabled: true
      }
    });
    wrapper.trigger("dragenter");
    wrapper.trigger("dragleave");
    expect(wrapper).toMatchSnapshot();
  });

  it("should match if drag enter and not dragging", () => {
    treeModel.isDragging.mockReturnValue(false);
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node
      }
    });
    wrapper.trigger("dragenter");
    expect(wrapper).toMatchSnapshot();
  });

  it("should match if drag leave and not dragging", () => {
    treeModel.isDragging.mockReturnValue(false);
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node
      }
    });
    wrapper.trigger("dragenter");
    wrapper.trigger("dragleave");
    expect(wrapper).toMatchSnapshot();
  });

  describe("#onDrop", () => {
    it("should call `treeModel.dropOnNode`", () => {
      treeModel.isDragging.mockReturnValue(true);
      const wrapper = mount(FinderListDropZone, {
        propsData: {
          treeModel,
          node,
          dragEnabled: true
        }
      });
      wrapper.trigger("drop");
      expect(treeModel.dropOnNode).toHaveBeenCalledWith("test111");
    });

    it("should not call `treeModel.dropOnNode` if not dragging", () => {
      treeModel.isDragging.mockReturnValue(false);
      const wrapper = mount(FinderListDropZone, {
        propsData: {
          treeModel,
          node,
          dragEnabled: true
        }
      });
      wrapper.trigger("drop");
      expect(treeModel.dropOnNode).not.toHaveBeenCalled();
    });
  });
});
