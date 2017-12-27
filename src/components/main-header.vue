<template>
<b-navbar toggleable="md" type="dark" variant="info">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-navbar-brand href="#/" v-bind:class="{active: $route.name === 'Home'}">World of Teas</b-navbar-brand>

  <b-collapse is-nav id="nav_collapse">
    <b-navbar-nav>
      <b-nav-item href="#/categories" v-bind:class="{active: $route.name === 'Categories'}">Categories</b-nav-item>
      <b-nav-item href="#/ratings" v-bind:class="{active: $route.name === 'Ratings'}">Ratings</b-nav-item>
      <b-nav-item href="#/links" v-bind:class="{active: $route.name === 'Links'}">Links</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-nav-item href="#/login" v-bind:class="{active: $route.name === 'Login'}">Login</b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</template>

<script>
export default {};
</script>
