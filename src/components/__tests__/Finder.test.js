import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Finder from "../Finder.vue";

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
            label: "Test 111",
          },
          {
            id: "test112",
            label: "Test 112",
            cssClass: "custom-class",
          },
        ],
      },
      {
        id: "test12",
        label: "Test 12",
      },
      {
        id: "test13",
        label: "Test 13",
        children: [
          {
            id: "test131",
            label: "Test 131",
            children: [
              {
                id: "test1311",
                label: "Test 1311",
              },
              {
                id: "test1312",
                label: "Test 1312",
              },
            ],
          },
          {
            id: "test132",
            label: "Test 132",
          },
        ],
      },
      {
        id: "test14",
        label: "Test 14",
        selected: true,
        children: [
          {
            id: "test141",
            label: "Test 141",
            selected: true,
            children: [
              {
                id: "test1411",
                label: "Test 1411",
                selected: true,
              },
              {
                id: "test1412",
                label: "Test 1412",
                selected: true,
              },
            ],
          },
          {
            id: "test142",
            label: "Test 142",
            selected: true,
          },
        ],
      },
    ],
  };

  it("should match snapshot", () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with no children", () => {
    const wrapper = mount(Finder, {
      props: {
        tree: {
          id: "root",
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with a custom item component", () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
        itemComponent: "span",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with a custom arrow component", () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
        arrowComponent: "span",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with expanded item and emit event", async () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
      },
      attachTo: document.body,
    });

    await wrapper.findAll(".item")[0].trigger("focus");

    expect(wrapper.emitted().expand).toEqual([
      [
        {
          expanded: ["test1", "test11"],
          sourceEvent: "focus",
          expandedItems: [
            {
              id: "test1",
            },
            { id: "test11", label: "Test 11" },
          ],
        },
      ],
    ]);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with initial filter", () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
        filter() {
          return ({ id }) => id === "test12";
        },
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with filter", async () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
      },
    });

    wrapper.setProps({
      filter: ({ id }) => id === "test12",
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with sort", () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
        sortBy: (item1, item2) =>
          item1.id > item2.id ? -1 : item1.id < item2.id ? 1 : 0,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with default expanded", () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
        defaultExpanded: "test112",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with an updated tree", async () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
      },
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
                label: "Test 311",
              },
              {
                id: "test312",
                label: "Test 312",
                selected: true,
              },
            ],
          },
        ],
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should match snapshot with custom theme", () => {
    const wrapper = mount(Finder, {
      props: {
        tree,
        theme: {
          primaryColor: "#41b883",
          arrowColor: "#555",
          separatorColor: "#eee",
          separatorWidth: "3px",
          dropZoneBgColor: "rgba(112, 195, 112, 0.3)",
          draggedItemBgColor: "rgba(112, 195, 112, 0.6)",
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("Selection", () => {
    it("should match snapshot", () => {
      const wrapper = mount(Finder, {
        props: {
          tree,
          selectable: true,
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should emit a 'select' event", async () => {
      const wrapper = mount(Finder, {
        props: {
          tree,
          selectable: true,
        },
        attachTo: document.body,
      });

      await wrapper.findAll(".item > input[type=checkbox]")[1].trigger("click");

      expect(wrapper.emitted().select).toEqual([
        [
          {
            selected: [
              "test11",
              "test14",
              "test141",
              "test1411",
              "test1412",
              "test142",
              "test12",
            ],
            selectedItems: [
              {
                id: "test11",
                label: "Test 11",
              },
              {
                id: "test14",
                label: "Test 14",
              },
              {
                id: "test141",
                label: "Test 141",
              },
              {
                id: "test1411",
                label: "Test 1411",
              },
              {
                id: "test1412",
                label: "Test 1412",
              },
              {
                id: "test142",
                label: "Test 142",
              },
              { id: "test12", label: "Test 12" },
            ],
          },
        ],
      ]);
    });

    it("should select descendants if 'autoSelectDescendants' is true", async () => {
      const wrapper = mount(Finder, {
        props: {
          tree,
          selectable: true,
          autoSelectDescendants: true,
        },
        attachTo: document.body,
      });

      await wrapper.findAll(".item > input[type=checkbox]")[2].trigger("click");

      expect(wrapper.emitted().select).toEqual([
        [
          {
            selected: [
              "test11",
              "test14",
              "test141",
              "test1411",
              "test1412",
              "test142",
              "test1311",
              "test1312",
              "test131",
              "test132",
              "test13",
            ],
            selectedItems: [
              {
                id: "test11",
                label: "Test 11",
              },
              {
                id: "test14",
                label: "Test 14",
              },
              {
                id: "test141",
                label: "Test 141",
              },
              {
                id: "test1411",
                label: "Test 1411",
              },
              {
                id: "test1412",
                label: "Test 1412",
              },
              {
                id: "test142",
                label: "Test 142",
              },
              {
                id: "test1311",
                label: "Test 1311",
              },
              {
                id: "test1312",
                label: "Test 1312",
              },
              {
                id: "test131",
                label: "Test 131",
              },
              {
                id: "test132",
                label: "Test 132",
              },
              { id: "test13", label: "Test 13" },
            ],
          },
        ],
      ]);
    });

    it("should deselect descendants if 'autoDeselectDescendants' is true", async () => {
      const wrapper = mount(Finder, {
        props: {
          tree,
          selectable: true,
          autoDeselectDescendants: true,
        },
        attachTo: document.body,
      });

      await wrapper.findAll(".item > input[type=checkbox]")[3].trigger("click");

      expect(wrapper.emitted().select).toEqual([
        [
          {
            selected: ["test11"],
            selectedItems: [
              {
                id: "test11",
                label: "Test 11",
              },
            ],
          },
        ],
      ]);
    });
  });

  describe("Drag & Drop", () => {
    it("should match snapshot", () => {
      const wrapper = mount(Finder, {
        props: {
          tree,
          dragEnabled: true,
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should emit a 'move' event", async () => {
      const wrapper = mount(Finder, {
        props: {
          tree,
          dragEnabled: true,
        },
      });

      await wrapper.findAll(".item")[0].trigger("dragstart", {
        dataTransfer: {
          setData() {},
        },
      });

      await wrapper.findAll(".item")[1].trigger("drop");

      expect(wrapper.emitted().move).toEqual([
        [{ moved: "test11", to: "test12" }],
      ]);
    });
  });

  describe("API", () => {
    describe("#expand", () => {
      it("should expand the given item and emit the 'expand' event", async () => {
        const wrapper = mount(Finder, {
          props: {
            tree,
            selectable: true,
          },
        });

        wrapper.vm.expand("test112");
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
        expect(wrapper.emitted().expand).toEqual([
          [
            {
              expanded: ["test1", "test11", "test112"],
              sourceEvent: "api",
              expandedItems: [
                {
                  id: "test1",
                },
                {
                  id: "test11",
                  label: "Test 11",
                },
                {
                  id: "test112",
                  label: "Test 112",
                  cssClass: "custom-class",
                },
              ],
            },
          ],
        ]);
      });

      it("should not emit the `expand` event when expanding the already expanded node", async () => {
        const wrapper = mount(Finder, {
          propsData: {
            tree,
            selectable: true,
            defaultExpanded: "test112",
          },
        });

        wrapper.vm.expand("test112");
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().expand).toBeFalsy();
      });

      it("should accept a 'sourceEvent' argument", async () => {
        const wrapper = mount(Finder, {
          props: {
            tree,
            selectable: true,
          },
        });

        wrapper.vm.expand("test112", "custom-event");
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toMatchSnapshot();
        expect(wrapper.emitted().expand).toEqual([
          [
            {
              expanded: ["test1", "test11", "test112"],
              sourceEvent: "custom-event",
              expandedItems: [
                {
                  id: "test1",
                },
                {
                  id: "test11",
                  label: "Test 11",
                },
                {
                  id: "test112",
                  label: "Test 112",
                  cssClass: "custom-class",
                },
              ],
            },
          ],
        ]);
      });
    });
  });
});
