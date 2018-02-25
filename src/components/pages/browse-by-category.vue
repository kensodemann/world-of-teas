<template>
  <div class="browse-by-category">
    <div class="page-title">Types of Tea</div>
    <div>A list of categories will eventually be here</div>
    <div class="category-title" v-for="category in categories" :key="category.id">{{category.name}}</div>
  </div>
</template>

<script>
export default {
  computed: {
    categories() {
      return this.$store.state.teaCategories.list;
    }
  }
};
</script>
