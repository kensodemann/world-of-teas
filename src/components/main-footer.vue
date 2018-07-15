<template>
  <div class="footer">
    <div class="footer-title">World of Teas - v{{version}} ({{name}})</div>
    <div class="footer-copyright">Copyright &copy; {{year}} - Kenneth W. Sodemann</div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/theme";

.footer {
  text-align: center;
  color: $primary;
  font-size: smaller;
}
</style>

<script>
import moment from 'moment';
import version from '../assets/version.json';

export default {
  data: function() {
    return {
      version: version.version,
      name: version.name,
      year: moment(version.date).format('YYYY')
    };
  }
};
</script>
