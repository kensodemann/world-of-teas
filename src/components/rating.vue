<template>
  <div class="rating">
    <span class="fa"
          :class="{'fa-star-o': !stars, 'fa-star': stars > 0}"
          @click="updateValue(1)"></span>
    <span class="fa"
          :class="{'fa-star-o': !stars || stars === 1, 'fa-star': stars > 1}"
          @click="updateValue(2)"></span>
    <span class="fa"
          :class="{'fa-star-o': !stars || stars < 3, 'fa-star': stars > 2}"
          @click="updateValue(3)"></span>
    <span class="fa"
          :class="{'fa-star-o': !stars || stars < 4, 'fa-star': stars > 3}"
          @click="updateValue(4)"></span>
    <span class="fa"
          :class="{'fa-star-o': !stars || stars < 5, 'fa-star': stars === 5}"
          @click="updateValue(5)"></span>
  </div>
</template>

<script>
export default {
  props: {
    value: Number
  },
  data() {
    return {
      stars: this.value
    };
  },
  methods: {
    updateValue: function(v) {
      this.stars = v;
      this.$emit('input', v);
    }
  }
};
</script>
