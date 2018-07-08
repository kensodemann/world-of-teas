<template>
  <div class="page">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center"  v-for="category in categories" :key="category.id">
          <tea-category :category=category></tea-category>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.col {
  margin-top: 1em;
}
</style>


<script>
import TeaCategory from '../tea-category';
export default {
  components: {
    TeaCategory
  },
  computed: {
    categories() {
      return this.$store.state.teaCategories.list;
    }
  }
};
</script>
