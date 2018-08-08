<template>
  <b-modal id="teaEditor"
           :ok-disabled=!canSave
           @ok="save"
           size="lg"
           title="Tea">
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
                         v-model="form.instructions"
                         placeholder="Enter Brewing Instructions">
        </b-form-textarea>
        <small class="text-danger" v-show="errors.has('teaEditorInstructionsInput')">{{ errors.first('teaEditorInstructionsInput') }}</small>
      </b-form-group>

      <b-form-group id="teaEditorRatingGroup"
                    label="Rating"
                    label-for="teaEditorRating">
        <rating id="teaEditorRating" name="teaEditorRating" v-model="form.rating"></rating>
      </b-form-group>

      <div class="d-flex">
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
          <small class="text-danger" v-show="errors.has('teaEditorPurchaseLinkInput')">{{ errors.first('teaEditorPurchaseLinkInput') }}</small>
        </b-form-group>

        <b-form-group id="teaEditorPurchasePriceGroup"
                      label="Price"
                      label-for="teaEditorPurchasePriceInput">
          <b-form-input id="teaEditorPurchasePriceInput"
                        name="teaEditorPurchasePriceInput"
                        data-vv-as="purchase price"
                        type="number"
                        v-model="form.price"
                        placeholder="Per 100g">
          </b-form-input>
          <small class="text-danger" v-show="errors.has('teaEditorPurchasePriceInput')">{{ errors.first('teaEditorPurchasePriceInput') }}</small>
        </b-form-group>
      </div>
    </b-form>
  </b-modal>
</template>

<style lang="scss" scoped>
form {
  margin: 10px;
}

#teaEditorPurchaseLinkGroup {
  flex-grow: 1;
  margin-right: 10px;
}
</style>


<script>
import Rating from './rating';

export default {
  components: {
    Rating
  },
  computed: {
    categoryOptions: function() {
      const cats = [{ value: null, text: 'Please select a category' }];
      if (this.$store.state.teaCategories.list) {
        Array.prototype.push.apply(
          cats,
          this.$store.state.teaCategories.list.map(cat => ({
            value: cat,
            text: cat.name
          }))
        );
      }
      return cats;
    },
    canSave: function() {
      return !!(this.form.name && this.form.category && !this.errors.count());
    }
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        instructions: '',
        rating: undefined,
        category: null,
        link: '',
        price: undefined
      }
    };
  },
  methods: {
    save(evt) {
      try {
        this.$store.dispatch('teas/save', {
          name: this.form.name,
          teaCategoryId: this.form.category.id,
          teaCategoryName: this.form.category.name,
          description: this.form.description,
          instructions: this.form.instructions,
          rating: this.form.rating,
          url: this.form.link,
          price: this.form.price
        });
      } catch (err) {
        this.errorMessage = err.body.reason;
      }
    }
  }
};
</script>
