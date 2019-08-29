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

  it("should match snapshot with expanded item", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });

    wrapper.find(".item").trigger("click");
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

  it("should match snapshot with filter", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });

    wrapper.setProps({
      filter: ({ id }) => id === "test12"
    });
    expect(wrapper).toMatchSnapshot();
  });
});
