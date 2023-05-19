import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderListDropZone from "../FinderListDropZone";

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

  it("should match if drag enter and is dragging", async () => {
    treeModel.startDrag("test12");
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node,
        dragEnabled: true
      }
    });

    wrapper.trigger("dragenter");
    expect(treeModel.dragCounter.counter).toBe(1);
    expect(treeModel.dragCounter.enteredDropzoneId).toBe("drop-zone-test111");
    expect(wrapper.vm.dropzoneId).toBe("drop-zone-test111");
    expect(treeModel.isDragging()).toBe(true);
    expect(wrapper.vm.canDrop).toBe(true);
    expect(wrapper.vm.dragOver).toBe(true);

    await wrapper.vm.$nextTick();

    expect(wrapper).toMatchSnapshot();
  });

  it("should match if drag leave and is dragging", async () => {
    treeModel.startDrag("test12");
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node,
        dragEnabled: true
      }
    });

    wrapper.trigger("dragenter");
    wrapper.trigger("dragleave");
    await wrapper.vm.$nextTick();

    expect(wrapper).toMatchSnapshot();
  });

  it("should match if drag enter and not dragging", async () => {
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node
      }
    });
    wrapper.trigger("dragenter");
    await wrapper.vm.$nextTick();

    expect(wrapper).toMatchSnapshot();
  });

  it("should match if drag leave and not dragging", async () => {
    const wrapper = mount(FinderListDropZone, {
      propsData: {
        treeModel,
        node
      }
    });
    wrapper.trigger("dragenter");
    wrapper.trigger("dragleave");
    await wrapper.vm.$nextTick();

    expect(wrapper).toMatchSnapshot();
  });

  describe("#onDrop", () => {
    beforeEach(() => {
      jest.spyOn(treeModel, "dropOnNode");
    });
    it("should call `treeModel.dropOnNode`", () => {
      treeModel.startDrag("test12");
      const wrapper = mount(FinderListDropZone, {
        propsData: {
          treeModel,
          node,
          dragEnabled: true
        }
      });
      wrapper.trigger("drop");
      expect(treeModel.dropOnNode).toHaveBeenCalledWith("test111", undefined);
    });

    it("should call `treeModel.dropOnNode` with index", () => {
      treeModel.startDrag("test12");

      const wrapper = mount(FinderListDropZone, {
        propsData: {
          treeModel,
          node,
          dragEnabled: true,
          index: 5
        }
      });
      wrapper.trigger("drop");
      expect(treeModel.dropOnNode).toHaveBeenCalledWith("test111", 5);
    });

    it("should not call `treeModel.dropOnNode` if not dragging", async () => {
      const wrapper = mount(FinderListDropZone, {
        propsData: {
          treeModel,
          node,
          dragEnabled: true
        }
      });
      await wrapper.trigger("drop");
      expect(treeModel.dropOnNode).not.toHaveBeenCalled();
    });
  });
});
