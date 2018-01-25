<template>
  <div class="home">
    <div class="page-title">Find Great Tea</div>
    <b-form inline>
      <b-form-group id="searchInputGroup">
        <b-form-input id="searchInput"
                      name="searchInput"
                      type="text"
                      v-model="search"
                      placeholder="Search for Tea">
        </b-form-input>
      </b-form-group>
      <b-button variant="primary">+</b-button>
    </b-form>

    <div class="list tea-list">
    </div>
  </div>
</template>

<style lang="scss" scoped>
#searchInputGroup {
  flex-grow: 1;
  margin-right: 10px;
}

#searchInput {
  width: 100%;
}
</style>


<script>
export default {
  data() {
    return {
      search: ''
    };
  }
};
</script>
