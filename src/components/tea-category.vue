<template>
  <b-card :title="category.name"
          :img-src="imageUrl"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 30rem;"
          class="mb-2">
    <p class="card-text">
      {{category.description}}
    </p>
    <div slot="footer">
      <b-button href="#" variant="primary">List {{category.name}} Teas</b-button>
    </div>
  </b-card>
</template>

<style scoped>
.card-footer {
  border-top: 0;
  background: transparent;
  text-align: center;
}
</style>


<script>
export default {
  props: {
    category: Object
  },
  data() {
    return {
      imagePath: '/static/img/white.jpg'
    };
  },
  computed: {
    imageUrl: function() {
      return `/static/img/${this.category.name.toLowerCase()}.jpg`;
    }
  }
};
</script>
