<template>
<div class="header">
  <div class="items nav-items">
    <a href="#/" v-bind:class="{active: $route.name === 'Home'}">Home</a>
    <a href="#/categories" v-bind:class="{active: $route.name === 'Categories'}">Categories</a>
    <a href="#/ratings" v-bind:class="{active: $route.name === 'Ratings'}">Ratings</a>
    <a href="#/links" v-bind:class="{active: $route.name === 'Links'}">Links</a>
  </div>
  <div class="items admin-items">
    <a href="#/login" v-bind:class="{active: $route.name === 'Login'}">Login</a>
  </div>
</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '../scss/theme';

.header {
  display: flex;
  display: -webkit-flex;
  align-items: center;

  .items {
    display: flex;
    flex-grow: 1;
    padding-left: $standard-spacing;
    padding-right: $standard-spacing;
  }

  .nav-items {
    a {
      margin-right: ($standard-spacing * 2);
    }
  }

  .admin-items {
    justify-content: flex-end;
  }

  background: $primary;

  a {
    font-weight: bold;
    font-size: larger;
    text-decoration: none;
    outline: 0;
    color: $secondary;

    &.active,
    &:hover,
    &:active,
    &:focus {
      color: $secondary-highlight;
    }
  }
}
</style>
