export default class {
  constructor() {
    this.listeners = [];
  }

  on(eventName, handler) {
    this.listeners[eventName] = [...(this.listeners[eventName] || []), handler];
  }

  off(eventName, handler) {
    let handlers = this.listeners[eventName];

    if (handlers) {
      this.listeners[eventName] = this.handlers.filter(fn => fn === handler);
    }
  }

  trigger(eventName, ...args) {
    const handlers = this.listeners[eventName];

    if (handlers) {
      handlers.forEach(handler => handler.apply(...args));
    }
  }
}
