import { mount } from "@vue/test-utils";
import TreeModel from "@/utils/tree-model";
import FinderListDropZone from "../FinderListDropZone.vue";

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
    const wrapper = mount(FinderListDropZone, {
      props: {
        treeModel,
        node,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match if drag enter and is dragging", async () => {
    treeModel.isDragging.mockReturnValue(true);
    const wrapper = mount(FinderListDropZone, {
      props: {
        treeModel,
        node,
        dragEnabled: true,
      },
    });
    await wrapper.trigger("dragenter");

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match if drag leave and is dragging", async () => {
    treeModel.isDragging.mockReturnValue(true);
    const wrapper = mount(FinderListDropZone, {
      props: {
        treeModel,
        node,
        dragEnabled: true,
      },
    });
    await wrapper.trigger("dragenter");
    await wrapper.trigger("dragleave");

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match if drag enter and not dragging", async () => {
    treeModel.isDragging.mockReturnValue(false);
    const wrapper = mount(FinderListDropZone, {
      props: {
        treeModel,
        node,
      },
    });
    await wrapper.trigger("dragenter");

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match if drag leave and not dragging", async () => {
    treeModel.isDragging.mockReturnValue(false);
    const wrapper = mount(FinderListDropZone, {
      props: {
        treeModel,
        node,
      },
    });
    await wrapper.trigger("dragenter");
    await wrapper.trigger("dragleave");

    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("#onDrop", () => {
    it("should call `treeModel.dropOnNode`", async () => {
      treeModel.isDragging.mockReturnValue(true);
      const wrapper = mount(FinderListDropZone, {
        props: {
          treeModel,
          node,
          dragEnabled: true,
        },
      });
      await wrapper.trigger("drop");
      expect(treeModel.dropOnNode).toHaveBeenCalledWith("test111", undefined);
    });

    it("should call `treeModel.dropOnNode` with index", async () => {
      treeModel.isDragging.mockReturnValue(true);
      const wrapper = mount(FinderListDropZone, {
        props: {
          treeModel,
          node,
          dragEnabled: true,
          index: 5,
        },
      });
      await wrapper.trigger("drop");
      expect(treeModel.dropOnNode).toHaveBeenCalledWith("test111", 5);
    });

    it("should not call `treeModel.dropOnNode` if not dragging", async () => {
      treeModel.isDragging.mockReturnValue(false);
      const wrapper = mount(FinderListDropZone, {
        props: {
          treeModel,
          node,
          dragEnabled: true,
        },
      });
      await wrapper.trigger("drop");
      expect(treeModel.dropOnNode).not.toHaveBeenCalled();
    });
  });
});
