import { vi, describe, it, beforeEach, expect } from "vitest";
import EventManager from "../event-manager";

describe("EventManager", () => {
  let eventManager;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  describe("#constructor", () => {
    it("should initialize the instance", () => {
      expect(eventManager.listeners).toEqual({});
    });
  });

  describe("#on", () => {
    it("should add a listener", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      eventManager.on("myEvent", handler1);
      eventManager.on("myEvent", handler2);
      expect(eventManager.listeners).toEqual({
        myEvent: [handler1, handler2],
      });
    });
  });

  describe("#off", () => {
    it("should remove listeners", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      eventManager.on("myEvent", handler1);
      eventManager.on("myEvent", handler2);
      eventManager.off("myEvent", handler1);
      eventManager.off("anotherEvent", handler1);
      expect(eventManager.listeners).toEqual({
        myEvent: [handler1],
      });
    });
  });

  describe("#trigger", () => {
    it("should call listeners", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      eventManager.on("myEvent", handler1);
      eventManager.on("myEvent", handler2);
      eventManager.trigger("myEvent", "param1", "param2");

      expect(handler1).toHaveBeenCalledWith("param1", "param2");
      expect(handler2).toHaveBeenCalledWith("param1", "param2");
    });

    it("should do nothing if we trigger another listener", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      eventManager.on("myEvent", handler1);
      eventManager.on("myEvent", handler2);
      eventManager.trigger("anotherEvent", "param1", "param2");

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });
});
