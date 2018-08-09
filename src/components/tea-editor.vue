<template>
  <b-modal id="teaEditor"
           ref="teaEditorModel"
           :ok-disabled=!canSave()
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
                        v-model="form.url"
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
    categoryOptions() {
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
    }
  },
  data() {
    return {
      tea: undefined,
      form: {
        name: '',
        description: '',
        instructions: '',
        rating: undefined,
        category: null,
        url: '',
        price: undefined
      }
    };
  },
  methods: {
    canSave() {
      return !!(
        this.isDirty() &&
        this.form.name &&
        this.form.category &&
        !this.errors.count()
      );
    },
    isDirty() {
      return (
        !this.tea ||
        this.tea.name !== this.form.name ||
        this.tea.teaCategoryId !== this.form.category.id ||
        this.tea.description !== this.form.description ||
        this.tea.instructions !== this.form.instructions ||
        this.tea.rating !== this.form.rating ||
        this.tea.url !== this.form.url ||
        parseFloat(this.tea.price || 0) !== parseFloat(this.form.price || 0)
      );
    },
    save(evt) {
      try {
        this.$store.dispatch('teas/save', {
          name: this.form.name,
          teaCategoryId: this.form.category.id,
          teaCategoryName: this.form.category.name,
          description: this.form.description,
          instructions: this.form.instructions,
          rating: this.form.rating,
          url: this.form.url,
          price: this.form.price
        });
      } catch (err) {
        this.errorMessage = err.body.reason;
      }
    },
    show(tea) {
      this.tea = tea;
      this.form.name = tea && tea.name;
      this.form.description = tea && tea.description;
      this.form.instructions = tea && tea.instructions;
      this.form.rating = tea && tea.rating;
      this.form.url = tea && tea.url;
      this.form.price = tea && tea.price;
      this.form.category = tea
        ? this.$store.state.teaCategories.hash[tea.teaCategoryId]
        : null;
      this.$refs.teaEditorModel.show();
    }
  }
};
</script>
