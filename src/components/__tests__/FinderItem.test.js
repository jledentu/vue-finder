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

    it("should call treeModel.expandNode on focus", async () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node
        },
        attachTo: document.body
      });

      wrapper.find(".item").element.dispatchEvent(new FocusEvent("focus"));

      expect(treeModel.expandNode).toHaveBeenCalledWith("test111", "focus");
    });

    it("should call treeModel.expandNode on click", async () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node
        }
      });

      await wrapper.trigger("click");
      expect(treeModel.expandNode).toHaveBeenCalledWith("test111", "click");
    });

    it("should not call treeModel.expandNode on mousedown", async () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node
        }
      });

      await wrapper.trigger("mousedown");
      wrapper.element.focus();

      expect(treeModel.expandNode).not.toHaveBeenCalled();
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

    it("should call treeModel.selectNode on click on checkbox", async () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node,
          selectable: true
        }
      });

      await wrapper.find('input[type="checkbox"]').setChecked(true);
      expect(treeModel.selectNode).toHaveBeenCalledWith("test111", true);
    });

    it("should call treeModel.selectNode on click on checked checkbox", async () => {
      treeModel.isNodeSelected.mockReturnValue(true);
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node,
          selectable: true
        }
      });

      await wrapper.find('input[type="checkbox"]').setChecked(false);
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

    it("should match snapshot if dragEnabled is a function returning `false`", () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node,
          dragEnabled: node => node.id === "test111"
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it("should match snapshot if dragEnabled is a function returning `true`", () => {
      const wrapper = mount(FinderItem, {
        propsData: {
          treeModel,
          node,
          dragEnabled: node => node.id === "test"
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

      it("should call treeModel.startDrag if `dragEnabled` is a function returning `true`", async () => {
        const dataTransfer = {
          setDragImage: jest.fn(),
          setData: jest.fn()
        };
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: node => node.id === "test111"
          }
        });

        await wrapper.trigger("dragstart", {
          dataTransfer
        });

        expect(dataTransfer.setDragImage).not.toHaveBeenCalled();
        expect(dataTransfer.setData).toHaveBeenCalledWith(
          "text/plain",
          "test111"
        );
        expect(treeModel.startDrag).toHaveBeenCalledWith("test111");
      });

      it("should not call treeModel.startDrag if `dragEnabled` is false", async () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: false
          }
        });

        await wrapper.trigger("dragstart");
        expect(treeModel.startDrag).not.toHaveBeenCalled();
      });

      it("should not call treeModel.startDrag if `dragEnabled` is a function returning `false`", async () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: node => node.is === "test"
          }
        });

        await wrapper.trigger("dragstart");
        expect(treeModel.startDrag).not.toHaveBeenCalled();
      });

      it("should initialize drag image element if `dragImageComponent` is defined", async () => {
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

        await wrapper.trigger("dragstart", {
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

        await wrapper.trigger("dragenter");
        await wrapper.vm.$nextTick();
        jest.runAllTimers();

        expect(treeModel.expandNode).toHaveBeenCalledWith(
          "test111",
          "dragover"
        );
      });

      it("should not call treeModel.expandNode if cannot drop", async () => {
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

        await wrapper.trigger("dragenter");
        await wrapper.vm.$nextTick();
        jest.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });

      it("should not call treeModel.expandNode if node is a leaf", async () => {
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

        await wrapper.trigger("dragenter");

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });

      it("should not call treeModel.expandNode if dragleave", async () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        await wrapper.trigger("dragenter");
        await wrapper.trigger("dragleave");

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });

      it("should not call treeModel.expandNode if node has changed in the interval", async () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        await wrapper.trigger("dragenter");
        wrapper.setProps({
          node: {
            id: "test112"
          }
        });

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });
    });

    describe("dragover", () => {
      it("should set dataTransfer.dropEffect = `all` if can drop", async () => {
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

        await wrapper.trigger("dragover", {
          dataTransfer
        });

        expect(dataTransfer.dropEffect).toBe("move");
      });

      it("should set dataTransfer.dropEffect = `none` if can not drop", async () => {
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

        await wrapper.trigger("dragover", {
          dataTransfer
        });

        expect(dataTransfer.dropEffect).toBe("none");
      });

      it("should do nothing if drag not enabled", async () => {
        const dataTransfer = {};
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: false
          }
        });

        await wrapper.trigger("dragover", {
          dataTransfer
        });

        expect(dataTransfer.dropEffect).toBeUndefined();
      });
    });

    describe("dragend", () => {
      it("should call treeModel.stopDrag", async () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: true
          }
        });

        await wrapper.trigger("dragend");
        expect(treeModel.stopDrag).toHaveBeenCalled();
      });

      it("should not call treeModel.stopDrag if `dragEnabled` is false", async () => {
        const wrapper = mount(FinderItem, {
          propsData: {
            treeModel,
            node,
            dragEnabled: false
          }
        });

        await wrapper.trigger("dragend");
        expect(treeModel.stopDrag).not.toHaveBeenCalled();
      });

      it("should set `draggable = false` if `options.hasDragHandle` is true", async () => {
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

        await wrapper.find(".drag-handle").trigger("mousedown");
        expect(wrapper.vm.$el.getAttribute("draggable")).toBe("true");

        await wrapper.trigger("dragend");
        expect(wrapper.vm.$el.getAttribute("draggable")).toBe("false");
      });

      it("should remove ghost element if `dragImageComponent` is defined", async () => {
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

        await wrapper.trigger("dragstart", {
          dataTransfer
        });

        const ghost = wrapper.vm.ghost;

        await wrapper.trigger("dragend", {
          dataTransfer
        });

        expect(document.body.contains(ghost)).toBe(false);
        expect(wrapper.vm.ghost).toBeNull();
      });
    });
  });
});
