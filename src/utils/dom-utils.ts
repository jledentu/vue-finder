export function css(
  element: HTMLElement,
  properties: { [name: string]: string }
) {
  Object.entries(properties).forEach(([prop, value]) => {
    element.style[prop] = value;
  });
}
