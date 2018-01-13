<template>
  <div @submit.prevent="changePassword" class="change-password">
    <b-form>
      <b-form-group id="changePasswordCurrentPasswordGroup"
                    label="Current Password:"
                    label-for="changePasswordCurrentPasswordInput">
        <password-input id="changePasswordCurrentPasswordInput"
                        name="changePasswordCurrentPasswordInput"
                        data-vv-as="current password"
                        v-model="form.currentPassword"
                        required
                        v-validate="'required'"
                        :show-password="showPasswords"
                        placeholder="Enter Current Password">
        </password-input>
        <small class="text-danger" v-show="errors.has('changePasswordCurrentPasswordInput')">{{ errors.first('changePasswordCurrentPasswordInput') }}</small>
      </b-form-group>

      <b-form-group id="changePasswordNewPasswordGroup"
                    label="New Password:"
                    label-for="changePasswordNewPasswordInput">
        <password-input id="changePasswordNewPasswordInput"
                        name="changePasswordNewPasswordInput"
                        data-vv-as="new password"
                        v-model="form.newPassword"
                        required
                        v-validate="{required: true, min: 10}"
                        :show-password="showPasswords"
                        placeholder="Enter New Password">
        </password-input>
        <small class="text-danger" v-show="errors.has('changePasswordNewPasswordInput')">{{ errors.first('changePasswordNewPasswordInput') }}</small>
      </b-form-group>

      <b-form-group id="changePasswordVerifyPasswordGroup"
                    label="Verify Password:"
                    label-for="changePasswordVerifyPasswordInput">
        <password-input id="changePasswordVerifyPasswordInput"
                        name="changePasswordVerifyPasswordInput"
                        data-vv-as="verification password"
                        v-model="form.verifyPassword"
                        required
                        v-validate="{required: true, is: form.newPassword}"
                        :show-password="showPasswords"
                        placeholder="Verify New Password">
        </password-input>
        <small class="text-danger" v-show="errors.has('changePasswordVerifyPasswordInput')">{{ errors.first('changePasswordVerifyPasswordInput') }}</small>
      </b-form-group>

      <b-form-group id="showPasswordGroup">
        <b-form-checkbox v-model="showPasswords">Show Passwords</b-form-checkbox>
      </b-form-group>

      <div id="error-message" class="text-danger">{{errorMessage}}</div>

      <b-button type="submit"
                variant="primary"
                :disabled="!(form.currentPassword && form.newPassword && form.verifyPassword && errors.count() === 0)">Change Password</b-button>
    </b-form>
  </div>
</template>

<script>
import users from '@/api/users';
import PasswordInput from '@/components/password-input';

export default {
  components: {
    PasswordInput
  },

  data() {
    return {
      form: {
        currentPassword: '',
        newPassword: '',
        verifyPassword: ''
      },
      showPasswords: false,
      errorMessage: ''
    };
  },

  methods: {
    async changePassword() {
      try {
        await users.changePassword(
          this.$store.state.identity.user.id,
          this.form.currentPassword,
          this.form.newPassword
        );
        this.$router.replace('/profile');
      } catch (error) {
        this.errorMessage = error.body.reason;
      }
    }
  }
};
</script>
