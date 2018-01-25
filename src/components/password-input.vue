<template>
<div>
  <b-form-input :placeholder="placeholder"
                type="password"
                v-bind:value="value"
                v-on:input="$emit('input', $event)"
                v-show="!showPassword">
  </b-form-input>
  <b-form-input :placeholder="placeholder"
                type="text"
                v-bind:value="value"
                v-on:input="$emit('input', $event)"
                v-show="showPassword">
  </b-form-input>
</div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    showPassword: Boolean,
    value: String
  }
};
</script>

<style lang="scss" scoped>

</style>

