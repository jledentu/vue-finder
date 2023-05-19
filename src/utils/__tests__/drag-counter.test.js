import DragCounter from "../drag-counter";

describe("DragCounter", () => {
  let dragCounter;

  beforeEach(() => {
    dragCounter = new DragCounter();
  });

  describe("#constructor", () => {
    it("should initialize the instance", () => {
      expect(dragCounter.counter).toBe(0);
      expect(dragCounter.enteredDropzoneId).toBeUndefined();
    });
  });

  describe("#onDragEnter", () => {
    it("should increment counter", () => {
      dragCounter.onDragEnter("myDropzoneId");

      expect(dragCounter.counter).toBe(1);
      expect(dragCounter.enteredDropzoneId).toBe("myDropzoneId");

      dragCounter.onDragEnter("myDropzoneId");

      expect(dragCounter.counter).toBe(2);
      expect(dragCounter.enteredDropzoneId).toBe("myDropzoneId");
    });
  });

  describe("#onDragLeave", () => {
    it("should decrement counter", () => {
      dragCounter.counter = 2;
      dragCounter.enteredDropzoneId = "myDropzoneId";

      dragCounter.onDragLeave("myDropzoneId");

      expect(dragCounter.counter).toBe(1);
      expect(dragCounter.enteredDropzoneId).toBe("myDropzoneId");

      dragCounter.onDragLeave("myDropzoneId");

      expect(dragCounter.counter).toBe(0);
      expect(dragCounter.enteredDropzoneId).toBeUndefined();

      dragCounter.onDragLeave("myDropzoneId");

      expect(dragCounter.counter).toBe(0);
      expect(dragCounter.enteredDropzoneId).toBeUndefined();
    });

    it("should not set counter < 0", () => {
      dragCounter.counter = 1;
      dragCounter.enteredDropzoneId = "myDropzoneId";

      dragCounter.onDragLeave("myDropzoneId");
      dragCounter.onDragLeave("myDropzoneId");

      expect(dragCounter.counter).toBe(0);
      expect(dragCounter.enteredDropzoneId).toBeUndefined();
    });
  });

  describe("#reset", () => {
    it("should reset the instance", () => {
      dragCounter.counter = 3;
      dragCounter.enteredDropzoneId = "myDropzoneId";

      dragCounter.reset();

      expect(dragCounter.counter).toBe(0);
      expect(dragCounter.enteredDropzoneId).toBeUndefined();
    });
  });
});
