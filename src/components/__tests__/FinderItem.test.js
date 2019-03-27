import { mount } from "@vue/test-utils";
import FinderItem from "../FinderItem";

describe("Tree Utils", () => {
  it("should match snapshot", () => {
    const wrapper = mount(FinderItem);
    expect(wrapper.element).toMatchSnapshot();
  });

  it("should match snapshot if expanded", () => {
    const wrapper = mount(FinderItem, {
      propsData: {
        expanded: true
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
