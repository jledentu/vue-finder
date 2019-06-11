<template>
  <div
    class="drop-zone"
    :class="{ 'drag-over': dragOver }"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
  />
</template>

<script>
export default {
  name: "FinderListDropZone",
  data: () => ({
    dragCounter: 0
  }),
  computed: {
    dragOver() {
      return this.dragCounter > 0;
    }
  },
  methods: {
    onDragEnter(event) {
      event.preventDefault();
      this.dragCounter++;
    },
    onDragLeave() {
      event.preventDefault();
      this.dragCounter--;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/colors";

.drop-zone {
  transition: height 0.1s ease;
  height: 1em;
  margin-bottom: -0.5em;
  overflow: hidden;

  &.drag-over {
    opacity: 0.5;
    margin-bottom: 0;
    height: 2em;
    border: dashed 3px $primaryColor;
    background-color: change-color($primaryColor, $alpha: 0.2);
  }
}
</style>
