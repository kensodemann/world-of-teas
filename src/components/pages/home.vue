<template>
  <div class="home">
    <div class="page-title">Find Great Tea</div>
    <b-form>
      <div class="d-flex">
        <b-form-group id="searchInputGroup" class="mb-0">
          <b-form-input id="searchInput"
                        name="searchInput"
                        type="text"
                        v-model="search"
                        placeholder="Search for Tea">
          </b-form-input>
        </b-form-group>
        <b-button variant="primary" v-b-modal.teaEditor>+</b-button>
      </div>
    </b-form>

    <div class="list tea-list">
    </div>

    <tea-editor></tea-editor>
  </div>
</template>

<style lang="scss" scoped>
#searchInputGroup {
  flex-grow: 1;
  margin-right: 10px;
}
</style>


<script>
import TeaEditor from '@/components/tea-editor';

export default {
  components: {
    TeaEditor
  },
  data() {
    return {
      search: ''
    };
  }
};
</script>
