<template>
  <div class="browse-by-category">
    <h1>I Like to Browse by Category</h1>
    <div>A list of categories will eventually be here</div>
    <div class="category-title" v-for="category in categories" :key="category.id">{{category.name}}</div>
  </div>
</template>

<script>
import teaCategories from '@/api/tea-categories';

export default {
  data: function() {
    return {
      categories: []
    };
  },
  created: function() {
    teaCategories.getAll().then(res => {
      this.categories = res;
    });
  }
};
</script>
