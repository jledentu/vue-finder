import Vue from "vue";
import Finder from "../Finder";

describe("Finder.vue", () => {
  const Constructor = Vue.extend(Finder);
  const vm = new Constructor().$mount();
  test("should render correct contents", () => {
    expect(vm.$el.querySelector(".hello h1").textContent).toEqual(
      "Welcome to Your Vue.js Library"
    );
  });
  test("should match the snapshot", () => {
    expect(vm.$el).toMatchSnapshot();
  });
});
