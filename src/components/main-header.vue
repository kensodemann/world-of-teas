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

    <b-navbar-nav class="ml-auto" v-if="identity">
      <b-nav-item-dropdown :text="identity">
        <b-dropdown-item href="#/profile" v-bind:class="{active: $route.name === 'My Profile'}">My Profile</b-dropdown-item>
        <b-dropdown-item href="#">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto" v-else>
      <b-nav-item href="#/login" v-bind:class="{active: $route.name === 'Login'}">Login</b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: mapGetters({
    identity: 'identity/name'
  })
};
</script>
