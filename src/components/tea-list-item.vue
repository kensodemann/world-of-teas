<template>
  <div>
    <div class="title-line">
      <div class="title">{{tea && tea.name}}</div>
      <div class="rating"></div>
    </div>
    <div class="description"></div>
  </div>
</template>

<style scoped>
</style>

<script>
export default {
  props: {
    tea: {}
  }
};
</script>

