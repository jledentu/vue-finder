import { mount } from "@vue/test-utils";
import Finder from "../Finder";

describe("Finder", () => {
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
        ]
      },
      {
        id: "test12",
        label: "Test 12"
      }
    ]
  };

  it("should match snapshot", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with no children", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree: {
          id: "root"
        }
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with a custom item component", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree,
        itemComponent: "span"
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with expanded item and emit event", async () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });

    wrapper
      .findAll(".item")
      .at(0)
      .trigger("focus");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().expand).toEqual([
      [{ expanded: ["test1", "test11"] }]
    ]);
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with initial filter", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree,
        filter() {
          return ({ id }) => id === "test12";
        }
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with filter", async () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });

    wrapper.setProps({
      filter: ({ id }) => id === "test12"
    });
    await wrapper.vm.$nextTick();

    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with sort", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree,
        sortBy: (item1, item2) =>
          item1.id > item2.id ? -1 : item1.id < item2.id ? 1 : 0
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with default expanded", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree,
        defaultExpanded: "test112"
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with an updated tree", async () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });
    wrapper.setProps({
      tree: {
        id: "test3",
        children: [
          {
            id: "test31",
            label: "Test 31",
            children: [
              {
                id: "test311",
                label: "Test 311"
              },
              {
                id: "test312",
                label: "Test 312",
                selected: true
              }
            ]
          }
        ]
      }
    });
    await wrapper.vm.$nextTick();

    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with custom theme", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree,
        theme: {
          primaryColor: "#41b883",
          arrowColor: "#555",
          separatorColor: "#eee",
          separatorWidth: "3px",
          dropZoneBgColor: "rgba(112, 195, 112, 0.3)",
          draggedItemBgColor: "rgba(112, 195, 112, 0.6)"
        }
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  describe("Selection", () => {
    it("should match snapshot", () => {
      const wrapper = mount(Finder, {
        propsData: {
          tree,
          selectable: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it("should emit a `select` event", async () => {
      const wrapper = mount(Finder, {
        propsData: {
          tree,
          selectable: true
        }
      });

      wrapper
        .findAll(".item > input[type=checkbox]")
        .at(1)
        .trigger("click");
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().select).toEqual([
        [{ selected: ["test11", "test12"] }]
      ]);
    });
  });

  describe("Drag & Drop", () => {
    it("should match snapshot", () => {
      const wrapper = mount(Finder, {
        propsData: {
          tree,
          dragEnabled: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it("should emit a `move` event", async () => {
      const wrapper = mount(Finder, {
        propsData: {
          tree,
          dragEnabled: true
        }
      });

      wrapper
        .findAll(".item")
        .at(0)
        .trigger("dragstart", {
          dataTransfer: {
            setData() {}
          }
        });

      await wrapper.vm.$nextTick();

      wrapper
        .findAll(".item")
        .at(1)
        .trigger("drop");

      expect(wrapper.emitted().move).toEqual([
        [{ moved: "test11", to: "test12" }]
      ]);
    });
  });

  describe("API", () => {
    describe("#expand", () => {
      it("should expand the given item and emit the `expand` event", async () => {
        const wrapper = mount(Finder, {
          propsData: {
            tree,
            selectable: true
          }
        });

        wrapper.vm.expand("test112");
        await wrapper.vm.$nextTick();

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.emitted().expand).toEqual([
          [
            {
              expanded: ["test1", "test11", "test112"]
            }
          ]
        ]);
      });
    });
  });
});
