<template>
  <div>
    <rating></rating>
    <div class="title-line">
      <div class="title">{{tea.name}}</div>
      <div class="rating">
        <rating v-model=tea.rating></rating>
      </div>
    </div>
    <div class="description">{{tea.description}}</div>
  </div>
</template>

<style scoped>
</style>

<script>
import Rating from './rating';

export default {
  components: [Rating],
  props: {
    tea: {}
  }
};
</script>

