<template>
  <div class="tea-editor">
    <b-form>
      <b-form-group id="teaEditorNameGroup"
                    label="Name:"
                    label-for="teaEditorNameInput">
        <b-form-input id="teaEditorNameInput"
                      name="teaEditorNameInput"
                      data-vv-as="name"
                      type="text"
                      v-model="form.name"
                      required
                      v-validate="'required'"
                      placeholder="Enter Tea Name">
        </b-form-input>
        <small class="text-danger" v-show="errors.has('teaEditorNameInput')">{{ errors.first('teaEditorNameInput') }}</small>
      </b-form-group>

      <b-form-group id="teaEditorCategoryGroup"
                    label="Type of Tea"
                    label-for="teaEditorCategorySelect">
        <b-form-select id="teaEditorCategorySelect"
                       v-model="form.category"
                       :options="categoryOptions" />
        <small class="text-danger" v-show="errors.has('teaEditorCategorySelect')">{{ errors.first('teaEditorCategorySelect') }}</small>
      </b-form-group>

      <b-form-group id="teaEditorDescriptionGroup"
                    label="Description:"
                    label-for="teaEditorDescriptionInput">
        <b-form-textarea id="teaEditorDescriptionInput"
                         name="teaEditorDescriptionInput"
                         :rows="3"
                         data-vv-as="description"
                         v-model="form.description"
                         placeholder="Enter Description">
        </b-form-textarea>
        <small class="text-danger" v-show="errors.has('teaEditorDescriptionInput')">{{ errors.first('teaEditorDescriptionInput') }}</small>
      </b-form-group>

      <b-form-group id="teaEditorInstructionsGroup"
                    label="Instructions:"
                    label-for="teaEditorInstructionsInput">
        <b-form-textarea id="teaEditorInstructionsInput"
                         name="teaEditorInstructionsInput"
                         :rows="3"
                         data-vv-as="brewing instructions"
                         v-model="form.instructionss"
                         placeholder="Enter Brewing Instructions">
        </b-form-textarea>
        <small class="text-danger" v-show="errors.has('teaEditorInstructionsInput')">{{ errors.first('teaEditorInstructionsInput') }}</small>
      </b-form-group>

      <b-form-group id="teaEditorRatingGroup"
                    label="Rating"
                    label-for="teaEditorRating">
        <b-form-radio-group id="teaEditorRating">
          <b-form-radio value="1">1</b-form-radio>
          <b-form-radio value="2">2</b-form-radio>
          <b-form-radio value="3">3</b-form-radio>
          <b-form-radio value="4">4</b-form-radio>
          <b-form-radio value="5">5</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <b-form-group id="teaEditorPurchaseLinkGroup"
                    label="Where to Purchase"
                    label-for="teaEditorPurchaseLinkInput">
        <b-form-input id="teaEditorPurchaseLinkInput"
                      name="teaEditorPurchaseLinkInput"
                      data-vv-as="purchase link"
                      type="url"
                      v-model="form.link"
                      v-validate="'url'"
                      placeholder="Enter a Valid Link">
        </b-form-input>
        <!-- <b-form-input id="teaEditorPurchasePriceInput"></b-form-input> -->
        <small class="text-danger" v-show="errors.has('teaEditorPurchaseLinkInput')">{{ errors.first('teaEditorPurchaseLinkInput') }}</small>
      </b-form-group>
    </b-form>
  </div>
</template>

<style lang="scss" scoped>
form {
  margin: 10px;
}
</style>


<script>
export default {
  computed: {
    categoryOptions: function() {
      // TODO: need to prepend with a blank option
      return this.categories.map(cat => ({ value: cat, text: cat.name }));
    }
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        instructions: '',
        category: {}
      },
      categories: [
        // Eventually obtained from the vuex store, pre-loaded at startup`.
        {
          id: 1,
          name: 'Green',
          description: 'Non - oxidized, mild tea'
        },
        {
          id: 2,
          name: 'Black',
          description: 'Oxidized tea'
        },
        {
          id: 3,
          name: 'Herbal',
          description: 'Not a tea'
        },
        {
          id: 4,
          name: 'Oolong',
          description: 'Chinese deliciousness'
        }
      ]
    };
  }
};
</script>
