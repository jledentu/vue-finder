import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderItem from "../FinderItem";

jest.mock("@/utils/tree-model");
jest.useFakeTimers();

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

    it("should call treeModel.expandNode on focus", () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node
        }
      });

      wrapper.trigger("focus");
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
        const dataTransfer = {
          setDragImage: jest.fn(),
          setData: jest.fn()
        };
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        wrapper.trigger("dragstart", {
          dataTransfer
        });

        expect(dataTransfer.setDragImage).not.toHaveBeenCalled();
        expect(dataTransfer.setData).toHaveBeenCalledWith(
          "text/plain",
          "test111"
        );
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

      it("should initialize drag image element if `dragImageComponent` is defined", () => {
        const dataTransfer = {
          setDragImage: jest.fn(),
          setData: jest.fn()
        };
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              dragImageComponent: {
                render(createElement) {
                  return createElement("div", "Dragging 1 item...");
                }
              }
            }
          }
        });

        wrapper.trigger("dragstart", {
          dataTransfer
        });

        const ghost = wrapper.vm.ghost;

        expect(ghost).toBeDefined();
        expect(document.body.contains(ghost)).toBe(true);
        expect(dataTransfer.setDragImage).toHaveBeenCalledWith(ghost, 0, 0);
      });
    });

    describe("dragenter", () => {
      beforeEach(() => {
        treeModel.isDragging.mockReturnValue(true);
      });

      it("should call treeModel.expandNode", async () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        wrapper.trigger("dragenter");
        await wrapper.vm.$nextTick();
        jest.runAllTimers();

        expect(treeModel.expandNode).toHaveBeenCalledWith("test111");
      });

      it("should not call treeModel.expandNode if cannot drop", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              canDrop: () => false
            }
          }
        });

        wrapper.trigger("dragenter");
        jest.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });

      it("should not call treeModel.expandNode if node is a leaf", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node: {
              ...node,
              isLeaf: true
            },
            dragEnabled: true
          }
        });

        wrapper.trigger("dragenter");
        jest.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });

      it("should not call treeModel.expandNode if dragleave", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        wrapper.trigger("dragenter");
        wrapper.trigger("dragleave");
        jest.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });

      it("should not call treeModel.expandNode if node has changed in the interval", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        wrapper.trigger("dragenter");
        wrapper.setProps({
          node: {
            id: "test112"
          }
        });
        jest.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });
    });

    describe("dragover", () => {
      it("should set dataTransfer.dropEffect = `all` if can drop", () => {
        const dataTransfer = {};
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              canDrop: () => true
            }
          }
        });

        wrapper.trigger("dragover", {
          dataTransfer
        });

        expect(dataTransfer.dropEffect).toBe("move");
      });

      it("should set dataTransfer.dropEffect = `none` if can not drop", () => {
        const dataTransfer = {};
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              canDrop: () => false
            }
          }
        });

        wrapper.trigger("dragover", {
          dataTransfer
        });

        expect(dataTransfer.dropEffect).toBe("none");
      });

      it("should do nothing if drag not enabled", () => {
        const dataTransfer = {};
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: false
          }
        });

        wrapper.trigger("dragover", {
          dataTransfer
        });

        expect(dataTransfer.dropEffect).toBeUndefined();
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

      it("should set `draggable = false` if `options.hasDragHandle` is true", () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              hasDragHandle: true
            }
          }
        });

        wrapper.find(".drag-handle").trigger("mousedown");
        expect(wrapper.vm.draggable).toBe(true);

        wrapper.trigger("dragend");
        expect(wrapper.vm.draggable).toBe(false);
      });

      it("should remove ghost element if `dragImageComponent` is defined", () => {
        const dataTransfer = {
          setDragImage: jest.fn(),
          setData: jest.fn()
        };
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              dragImageComponent: {
                render(createElement) {
                  return createElement("div", "Dragging 1 item...");
                }
              }
            }
          }
        });

        wrapper.trigger("dragstart", {
          dataTransfer
        });

        const ghost = wrapper.vm.ghost;

        wrapper.trigger("dragend", {
          dataTransfer
        });

        expect(document.body.contains(ghost)).toBe(false);
        expect(wrapper.vm.ghost).toBeNull();
      });
    });
  });
});
