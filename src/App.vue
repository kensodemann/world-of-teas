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

export default {
  name: 'app',
  components: {
    MainHeader,
    MainFooter
  }
};
</script>

<style lang="scss">
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
  color: #2c3e50;
  display: flex;
  flex-direction: column;
}

#main-header {
  flex: 0 0 auto;
  height: 48px;
}

#main-content {
  flex: 1 1 auto;
  position: relative; /* need this to position inner content */
  overflow-y: auto;
}

#main-footer {
  flex: 0 0 auto;
  height: 48px;
}
</style>
