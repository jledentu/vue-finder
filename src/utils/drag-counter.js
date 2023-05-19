export default class {
  constructor() {
    this.counter = 0;
    this.enteredDropzoneId = undefined;
  }

  /**
   * Add a given node in the set of nodes that are currently entered.
   *
   * @param {*} node
   * @returns `true` if the node was the first one to be entered
   */
  onDragEnter(dropzoneId) {
    this.counter++;
    this.enteredDropzoneId = dropzoneId;
  }

  /**
   * Remove a given node from the set of nodes that are currently entered.
   *
   * @param {*} node
   * @returns `true` if the node was the last one to be leaved
   */
  onDragLeave(dropzoneId) {
    if (dropzoneId !== this.enteredDropzoneId) {
      return;
    }

    this.counter--;

    if (this.counter === 0) {
      this.enteredDropzoneId = undefined;
    }
  }

  /**
   * Reset the set of nodes that are currently entered.
   */
  reset() {
    this.enteredDropzoneId = undefined;
    this.counter = 0;
  }
}
