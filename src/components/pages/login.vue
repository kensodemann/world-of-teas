<template>
  <div @submit.prevent="login" class="login">
    <b-form>
      <b-form-group id="loginEmailGroup"
                    label="Email address:"
                    label-for="loginEmailInput">
        <b-form-input id="loginEmailInput"
                      name="loginEmailInput"
                      data-vv-as="email address"
                      type="email"
                      v-model="form.email"
                      required
                      v-validate="'required|email'"
                      placeholder="Enter email">
        </b-form-input>
        <small class="text-danger" v-show="errors.has('loginEmailInput')">{{ errors.first('loginEmailInput') }}</small>
      </b-form-group>

      <b-form-group id="loginPasswordGroup"
                    label="Password:"
                    label-for="loginPasswordInput"
                    v-show="!showPassword">
        <b-form-input id="loginPasswordInput"
                      name="loginPasswordInput"
                      data-vv-as="password"
                      type="password"
                      v-model="form.password"
                      required
                      v-validate="'required'"
                      placeholder="Password">
        </b-form-input>
        <small class="text-danger" v-show="errors.has('loginPasswordInput')">{{ errors.first('loginPasswordInput') }}</small>
      </b-form-group>

      <b-form-group id="loginPasswordShowGroup"
                    label="Password:"
                    label-for="loginPasswordShowInput"
                    v-show="showPassword">
        <b-form-input id="loginPasswordShowInput"
                      type="text"
                      v-model="form.password"
                      required
                      placeholder="Password">
        </b-form-input>
        <small class="text-danger" v-show="errors.has('loginPasswordInput')">{{ errors.first('loginPasswordInput') }}</small>
      </b-form-group>

      <b-form-group id="showPasswordGroup">
        <b-form-checkbox v-model="showPassword">Show Password</b-form-checkbox>
      </b-form-group>

      <b-button type="submit" variant="primary" :disabled="!(form.email && form.password && errors.count() === 0)">Login</b-button>
      <div id="error-message" class="text-danger">{{errorMessage}}</div>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false,
      errorMessage: ''
    };
  },

  methods: {
    async login() {
      const res = await this.$store.dispatch('identity/login', {
        username: this.form.email,
        password: this.form.password
      });
      if (res.success) {
        this.form.email = '';
        this.$router.replace('/');
      } else {
        this.errorMessage = 'Invalid email or password.';
      }
      this.form.password = '';
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  margin-top: 60px;
  margin-left: 60px;
  margin-right: 60px;
}
</style>
