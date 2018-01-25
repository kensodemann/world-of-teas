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
      <b-button variant="primary" v-b-modal.teaEditor>+</b-button>
    </b-form>

    <div class="list tea-list">
    </div>

    <b-modal id="teaEditor"
             size="lg"
             title="Tea">
      <tea-editor></tea-editor>
    </b-modal>
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
