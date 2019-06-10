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
  height: 1em;
  transition: height 0.1s ease;

  &.drop-active {
    background-color: lightgray;
    height: 2em;
  }
}
</style>
