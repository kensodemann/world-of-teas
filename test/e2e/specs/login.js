module.exports = {
  start: function(browser) {
    const devServer = browser.globals.devServerURL;
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .click('a[href="#/login"]');
    browser.expect.element('#loginEmailInput').to.be.visible;
    browser.expect.element('#loginPasswordInput').to.be.visible;
    browser.expect.element('#loginPasswordShowInput').to.not.be.visible;
    browser.expect.element('#loginEmailGroup .text-danger').to.not.be.visible;
    browser.expect.element('#loginPasswordGroup .text-danger').to.not.be
      .visible;
    browser.expect.element('button[type="submit"').to.not.be.enabled;
  },

  'show password': function(browser) {
    browser.click('#showPasswordGroup label');
    browser.expect.element('#loginPasswordInput').to.not.be.visible;
    browser.expect.element('#loginPasswordShowInput').to.be.visible;
    browser.click('#showPasswordGroup label');
    browser.expect.element('#loginPasswordInput').to.be.visible;
    browser.expect.element('#loginPasswordShowInput').to.not.be.visible;
  },

  validations: function(browser) {
    browser.click('#loginEmailInput').click('#loginPasswordInput');
    browser.expect.element('#loginEmailGroup .text-danger').to.be.visible;
    browser.expect
      .element('#loginEmailGroup .text-danger')
      .text.to.equal('The email address field is required.');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;

    browser.click('#loginEmailInput');
    browser.expect.element('#loginPasswordGroup .text-danger').to.be.visible;
    browser.expect
      .element('#loginPasswordGroup .text-danger')
      .text.to.equal('The password field is required.');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;

    browser.setValue('#loginEmailInput', 'test');
    browser.expect.element('#loginEmailGroup .text-danger').to.be.visible;
    browser.expect
      .element('#loginEmailGroup .text-danger')
      .text.to.equal('The email address field must be a valid email.');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;

    browser.setValue('#loginEmailInput', 'test@testy.com');
    browser.expect.element('#loginEmailGroup .text-danger').to.not.be.visible;
    browser.expect.element('button[type="submit"]').to.not.be.enabled;

    browser.setValue('#loginPasswordInput', 'mypassword');
    browser.expect.element('#loginPasswordGroup .text-danger').to.not.be
      .visible;
    browser.expect.element('button[type="submit"]').to.be.enabled;
  },

  submit: function(browser) {
    browser.setValue('#loginPasswordInput', 'NotTheValidPa$$w0rd');
    browser.click('button[type="submit"]');
    browser.expect
      .element('#error-message')
      .text.to.equal('Invalid email or password.');
    browser.setValue('#loginPasswordInput', 'TheValidPa$$w0rd');
    browser.click('button[type="submit"]');
    browser.expect.element('.home').to.be.present;
  },

  end: function(browser) {
    browser.end();
  }
};
