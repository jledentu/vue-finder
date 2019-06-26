import { mount } from "@vue/test-utils";
import Finder from "../Finder";

describe("FinderList", () => {
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
        ],
        isLeaf: false
      },
      {
        id: "test12",
        label: "Test 12",
        isLeaf: true
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
});
