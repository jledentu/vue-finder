import { vi, describe, it, beforeEach, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderItem from "../FinderItem.vue";

vi.useFakeTimers();

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
            id: "test111",
          },
          {
            id: "test112",
          },
        ],
      },
      {
        id: "test12",
      },
    ],
  };
  beforeEach(() => {
    treeModel = new TreeModel(tree);
    node = {
      id: "test111",
    };
  });

  it("should match snapshot", () => {
    const wrapper = mount(FinderItem, {
      props: {
        treeModel,
        node,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("Expand", () => {
    it("should match snapshot if expanded", () => {
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
        },
      });
      treeModel.expandNode("test1");
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should call treeModel.expandNode on focus", async () => {
      vi.spyOn(treeModel, "expandNode");
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
        },
        attrs: {
          tabindex: -1,
        },
        attachTo: document.body,
      });

      wrapper.find(".item").element.focus();

      expect(treeModel.expandNode).toHaveBeenCalledWith("test111", "focus");
    });

    it("should call treeModel.expandNode on click", async () => {
      vi.spyOn(treeModel, "expandNode");
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
        },
      });

      await wrapper.find(".item").trigger("click");
      expect(treeModel.expandNode).toHaveBeenCalledWith("test111", "click");
    });

    it("should not call treeModel.expandNode on mousedown", async () => {
      vi.spyOn(treeModel, "expandNode");
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
        },
        attrs: {
          tabindex: -1,
        },
        attachTo: document.body,
      });

      await wrapper.find(".item").trigger("mousedown");
      wrapper.element.focus();

      expect(treeModel.expandNode).not.toHaveBeenCalled();
    });
  });

  describe("Selection", () => {
    it("should match snapshot if selectable", () => {
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
          selectable: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should call treeModel.selectNode on click on checkbox", async () => {
      vi.spyOn(treeModel, "selectNode");
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
          selectable: true,
        },
        attachTo: document.body,
      });

      await wrapper.find('input[type="checkbox"]').trigger("click");
      expect(treeModel.selectNode).toHaveBeenCalledWith("test111", true);
    });

    it("should call treeModel.selectNode on click on checked checkbox", async () => {
      treeModel.selectNode("test111", true);
      vi.spyOn(treeModel, "selectNode");
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
          selectable: true,
        },
        attachTo: document.body,
      });

      await wrapper.find('input[type="checkbox"]').trigger("click");
      expect(treeModel.selectNode).toHaveBeenCalledWith("test111", false);
    });
  });

  describe("Drag & drop", () => {
    it("should match snapshot if dragEnabled is `true`", () => {
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
          dragEnabled: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot if dragEnabled is a function returning `false`", () => {
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
          dragEnabled: (node) => node.id === "test111",
        },
      });
      expect(wrapper).toMatchSnapshot();
    });

    it("should match snapshot if dragEnabled is a function returning `true`", () => {
      const wrapper = mount(FinderItem, {
        props: {
          treeModel,
          node,
          dragEnabled: (node) => node.id === "test",
        },
      });
      expect(wrapper).toMatchSnapshot();
    });

    describe("dragstart", () => {
      it("should call treeModel.startDrag", async () => {
        const dataTransfer = {
          setDragImage: vi.fn(),
          setData: vi.fn(),
        };
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
          },
        });
        vi.spyOn(treeModel, "startDrag");

        await wrapper.find(".item").trigger("dragstart", {
          dataTransfer,
        });

        expect(dataTransfer.setDragImage).not.toHaveBeenCalled();
        expect(dataTransfer.setData).toHaveBeenCalledWith(
          "text/plain",
          "test111",
        );
        expect(treeModel.startDrag).toHaveBeenCalledWith("test111");
      });

      it("should call treeModel.startDrag if `dragEnabled` is a function returning `true`", async () => {
        const dataTransfer = {
          setDragImage: vi.fn(),
          setData: vi.fn(),
        };
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: (node) => node.id === "test111",
          },
        });
        vi.spyOn(treeModel, "startDrag");

        await wrapper.find(".item").trigger("dragstart", {
          dataTransfer,
        });

        expect(dataTransfer.setDragImage).not.toHaveBeenCalled();
        expect(dataTransfer.setData).toHaveBeenCalledWith(
          "text/plain",
          "test111",
        );
        expect(treeModel.startDrag).toHaveBeenCalledWith("test111");
      });

      it("should not call treeModel.startDrag if `dragEnabled` is false", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: false,
          },
        });
        vi.spyOn(treeModel, "startDrag");

        await wrapper.find(".item").trigger("dragstart");
        expect(treeModel.startDrag).not.toHaveBeenCalled();
      });

      it("should not call treeModel.startDrag if `dragEnabled` is a function returning `false`", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: (node) => node.is === "test",
          },
        });
        vi.spyOn(treeModel, "startDrag");

        await wrapper.find(".item").trigger("dragstart");
        expect(treeModel.startDrag).not.toHaveBeenCalled();
      });

      it("should initialize drag image element if dragImageComponent is defined", async () => {
        const dataTransfer = {
          setDragImage: vi.fn(),
          setData: vi.fn(),
        };
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
            options: {},
          },
          slots: {
            "drag-image": `<div>Dragging 1 item...</div>`,
          },
        });

        await wrapper.find(".item").trigger("dragstart", {
          dataTransfer,
        });

        const ghost = wrapper.find({ ref: "ghost" });

        expect(ghost.isVisible()).toBe(true);
        expect(dataTransfer.setDragImage).toHaveBeenCalledWith(
          ghost.element,
          0,
          0,
        );
      });
    });

    describe("dragenter", () => {
      beforeEach(() => {
        treeModel.startDrag("test12");
        vi.spyOn(treeModel, "expandNode");
      });

      it("should call treeModel.expandNode", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
          },
        });

        await wrapper.find(".item").trigger("dragenter");
        vi.runAllTimers();

        expect(treeModel.expandNode).toHaveBeenCalledWith(
          "test111",
          "dragover",
        );
      });

      it("should not call treeModel.expandNode if cannot drop", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              canDrop: () => false,
            },
          },
        });

        await wrapper.find(".item").trigger("dragenter");
        vi.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });

      it("should not call treeModel.expandNode if node is a leaf", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node: {
              ...node,
              isLeaf: true,
            },
            dragEnabled: true,
          },
        });

        await wrapper.find(".item").trigger("dragenter");
        vi.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });

      it("should not call treeModel.expandNode if dragleave", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
          },
        });

        await wrapper.find(".item").trigger("dragenter");
        await wrapper.find(".item").trigger("dragleave");
        vi.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });
      it("should not call treeModel.expandNode if node has changed in the interval", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
          },
        });

        await wrapper.trigger("dragenter");
        wrapper.setProps({
          node: {
            id: "test112",
          },
        });
        await wrapper.vm.$nextTick();
        vi.runAllTimers();

        expect(treeModel.expandNode).not.toHaveBeenCalled();
      });
    });

    describe("dragover", () => {
      it("should set dataTransfer.dropEffect = `all` if can drop", async () => {
        const dataTransfer = {};
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              canDrop: () => true,
            },
          },
        });

        await wrapper.find(".item").trigger("dragover", {
          dataTransfer,
        });

        expect(dataTransfer.dropEffect).toBe("move");
      });

      it("should set dataTransfer.dropEffect = `none` if can not drop", async () => {
        const dataTransfer = {};
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              canDrop: () => false,
            },
          },
        });

        await wrapper.find(".item").trigger("dragover", {
          dataTransfer,
        });

        expect(dataTransfer.dropEffect).toBe("none");
      });

      it("should do nothing if drag not enabled", async () => {
        const dataTransfer = {};
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: false,
          },
        });

        await wrapper.find(".item").trigger("dragover", {
          dataTransfer,
        });

        expect(dataTransfer.dropEffect).toBeUndefined();
      });
    });

    describe("dragend", () => {
      beforeEach(() => {
        vi.spyOn(treeModel, "stopDrag");
      });

      it("should call treeModel.stopDrag", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
          },
        });

        await wrapper.find(".item").trigger("dragend");
        expect(treeModel.stopDrag).toHaveBeenCalled();
      });

      it("should not call treeModel.stopDrag if `dragEnabled` is false", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: false,
          },
        });

        await wrapper.find(".item").trigger("dragend");
        expect(treeModel.stopDrag).not.toHaveBeenCalled();
      });

      it("should set draggable class if 'options.hasDragHandle' is true", async () => {
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
            options: {
              hasDragHandle: true,
            },
          },
        });

        await wrapper.find(".drag-handle").trigger("mousedown");
        expect(wrapper.find(".item").attributes("draggable")).toBe("true");

        await wrapper.find(".drag-handle").trigger("mouseup");
        expect(wrapper.find(".item").attributes("draggable")).toBe("false");
      });

      it("should remove ghost element if 'dragImageComponent' is defined", async () => {
        const dataTransfer = {
          setDragImage: vi.fn(),
          setData: vi.fn(),
        };
        const wrapper = mount(FinderItem, {
          props: {
            treeModel,
            node,
            dragEnabled: true,
            options: {},
          },
          slots: {
            "drag-image": `<div>Dragging 1 item...</div>`,
          },
        });

        await wrapper.find(".item").trigger("dragstart", {
          dataTransfer,
        });

        await wrapper.find(".item").trigger("dragend", {
          dataTransfer,
        });

        expect(wrapper.find({ ref: "ghost" }).isVisible()).toBe(false);
      });
    });
  });
});
