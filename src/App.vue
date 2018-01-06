<template>
  <div id="app">
    <main-header id="main-header"></main-header>
    <router-view id="main-content"/>
    <main-footer id="main-footer"></main-footer>
  </div>
</template>

<script>
import MainHeader from './components/main-header';
import MainFooter from './components/main-footer';
import store from './store';

export default {
  name: 'app',
  components: {
    MainHeader,
    MainFooter
  },
  store: store
};
</script>

<style lang="scss">
@import './scss/theme';

html,
body,
#app {
  height: 100%;
}

body {
  overflow: hidden;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
  display: flex;
  flex-direction: column;
}

#main-header {
  flex: 0 0 auto;
}
#main-content {
  flex: 1 1 auto;
  overflow-y: auto;
  margin-left: $standard-spacing;
  margin-right: $standard-spacing;
}

#main-footer {
  flex: 0 0 auto;
  height: 48px;
}
</style>
