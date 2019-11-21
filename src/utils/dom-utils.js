export function css(element, properties) {
  Object.entries(properties).forEach(([prop, value]) => {
    element.style[prop] = value;
  });
}
