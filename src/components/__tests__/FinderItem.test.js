import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderItem from "../FinderItem";

jest.mock("@/utils/tree-model");

describe("FinderItem", () => {
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
    const wrapper = mount(FinderItem, {
      propsData: {
        treeModel,
        node
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  describe("Expand", () => {
    it("should match snapshot if expanded", () => {
      treeModel.isNodeExpanded.mockReturnValue(true);
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it("should call treeModel.expandNode on click", () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node
        }
      });

      wrapper.trigger("click");
      expect(treeModel.expandNode).toHaveBeenCalledWith("test111");
    });
  });

  describe("Selection", () => {
    it("should match snapshot if selectable", () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node,
          selectable: true
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it("should call treeModel.selectNode on click on checkbox", () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node,
          selectable: true
        }
      });

      wrapper.find('input[type="checkbox"]').trigger("click");
      expect(treeModel.selectNode).toHaveBeenCalledWith("test111", true);
    });

    it("should call treeModel.selectNode on click on checked checkbox", () => {
      treeModel.isNodeSelected.mockReturnValue(true);
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node,
          selectable: true
        }
      });

      wrapper.find('input[type="checkbox"]').trigger("click");
      expect(treeModel.selectNode).toHaveBeenCalledWith("test111", false);
    });
  });

  describe("Drag & drop", () => {
    it("should match snapshot if dragEnabled is `true`", () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node,
          dragEnabled: true
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    describe("dragstart", () => {
      it("should call treeModel.startDrag", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        wrapper.trigger("dragstart", {
          dataTransfer: {
            setData: jest.fn()
          }
        });
        expect(treeModel.startDrag).toHaveBeenCalledWith("test111");
      });

      it("should not call treeModel.startDrag if `dragEnabled` is false", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: false
          }
        });

        wrapper.trigger("dragstart");
        expect(treeModel.startDrag).not.toHaveBeenCalled();
      });
    });

    describe("dragover", () => {
      it("should call treeModel.expandNode", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        wrapper.trigger("dragover");
        expect(treeModel.expandNode).toHaveBeenCalledWith("test111");
      });

      it("should not call treeModel.expandNode if `dragEnabled` is false", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: false
          }
        });

        wrapper.trigger("dragover");
        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });
    });

    describe("dragend", () => {
      it("should call treeModel.stopDrag", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        wrapper.trigger("dragend");
        expect(treeModel.stopDrag).toHaveBeenCalled();
      });

      it("should not call treeModel.stopDrag if `dragEnabled` is false", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: false
          }
        });

        wrapper.trigger("dragend");
        expect(treeModel.stopDrag).not.toHaveBeenCalled();
      });
    });
  });
});
