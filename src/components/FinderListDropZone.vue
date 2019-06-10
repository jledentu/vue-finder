<template>
  <div
    class="drop-zone"
    :class="{ 'drop-active': dragOver }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  />
</template>

<script>
export default {
  name: "FinderListDropZone",
  data: () => ({
    dragOver: false
  }),
  methods: {
    onDragOver() {
      this.dragOver = true;
    },
    onDragLeave() {
      this.dragOver = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.drop-zone {
  transition: height 0.1s ease;
  height: 1em;
  margin-bottom: -0.5em;
  overflow: hidden;

  &.drop-active {
    background-color: lightgray;
    opacity: 0.5;
    margin-bottom: 0;
    height: 2em;
  }
}
</style>
