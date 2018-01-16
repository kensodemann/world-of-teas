<template>
  <div @submit.prevent="save" class="prfile">
    <div class="page-title">My Profile</div>
    <b-form>
      <b-form-group id="profileFirstNameGroup"
                    label="First Name:"
                    label-for="profileFirstNameInput">
        <b-form-input id="profileFirstNameInput"
                        name="profileFirstNameInput"
                        data-vv-as="first name"
                        v-model="form.firstName"
                        required
                        v-validate="'required'"
                        placeholder="Enter First Name">
        </b-form-input>
        <small class="text-danger" v-show="errors.has('profileFirstNameInput')">{{ errors.first('profileFirstNameInput') }}</small>
      </b-form-group>

      <b-form-group id="profileLastNameGroup"
                    label="Last Name:"
                    label-for="profileLastNameInput">
        <b-form-input id="profileLastNameInput"
                      name="profileLastNameInput"
                      data-vv-as="last name"
                      v-model="form.lastName"
                      placeholder="Enter Last Name">
        </b-form-input>
        <small class="text-danger" v-show="errors.has('profileLastNameInput')">{{ errors.first('profileLastNameInput') }}</small>
      </b-form-group>

      <b-form-group id="profileEmailAddressGroup"
                    label="Email Address:"
                    label-for="profileEmailAddressInput">
        <b-form-input id="profileEmailAddressInput"
                      name="profileEmailAddressInput"
                      data-vv-as="email address"
                      v-model="form.email"
                      required
                      v-validate="'required|email'"
                      placeholder="Enter Email Address">
        </b-form-input>
        <small class="text-danger" v-show="errors.has('profileEmailAddressInput')">{{ errors.first('profileEmailAddressInput') }}</small>
      </b-form-group>

      <div id="error-message" class="text-danger">{{errorMessage}}</div>

      <b-button type="submit"
                variant="primary"
                :disabled="!(form.firstName && form.email && errors.count() === 0)">Update</b-button>
      <b-button href="#/change-password">Change Password</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  created: function() {
    const vm = this;

    if (vm.$store.state.identity.user && vm.$store.state.identity.user.id) {
      assignUser(vm.$store.state.identity.user);
    } else {
      this.$watch(function() {
        return vm.$store.state.identity.user;
      }, assignUser);
    }

    function assignUser(user) {
      vm.form.id = user.id;
      vm.form.firstName = user.firstName;
      vm.form.lastName = user.lastName;
      vm.form.email = user.email;
    }
  },
  data() {
    return {
      form: {
        id: '',
        firstName: '',
        lastName: '',
        email: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    async save() {
      try {
        await this.$store.dispatch('identity/save', this.form);
      } catch (err) {
        this.errorMessage = err.body.reason;
      }
    }
  }
};
</script>
