<template>
  <div class="login">
    <h1>Login Page is Here</h1>
  </div>
</template>

<script>
export default {
  data() {
    this.$http.get('/api/tea-categories').then(
      response => {
        console.log(response);
      },
      err => {
        console.log(err);
      }
    );
    return {
      msg: 42
    };
  }
};
</script>
