module.exports = {
  start: function(browser) {
    const devServer = browser.globals.devServerURL;
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .click('a[href="#/login"]')
      .expect.element('#loginEmailInput').to.be.visible;
    browser.expect.element('#loginPasswordInput').to.be.visible;
    browser.expect.element('#loginEmailGroup .text-danger').to.not.be.visible;
    browser.expect.element('#loginPasswordGroup .text-danger').to.not.be
      .visible;
    browser.expect.element('button[type="submit"]').to.not.be.enabled;
  },

  'show password': function(browser) {
    browser
      .click('#showPasswordGroup label')
      .expect.element('#loginPasswordInput input[type="password"]').to.not.be
      .visible;
    browser.expect.element('#loginPasswordInput input[type="text"]').to.be
      .visible;
    browser
      .click('#showPasswordGroup label')
      .expect.element('#loginPasswordInput input[type="password"]').to.be
      .visible;
    browser.expect.element('#loginPasswordInput input[type="text"]').to.not.be
      .visible;
  },

  validations: function(browser) {
    browser
      .click('#loginEmailInput')
      .setValue('#loginEmailInput', 'test')
      .clearValue('#loginEmailInput')
      .click('#loginPasswordInput')
      .expect.element('#loginEmailGroup .text-danger').to.be.visible;
    browser.expect
      .element('#loginEmailGroup .text-danger')
      .text.to.equal('The email address field is required.');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;

    browser
      .setValue('#loginEmailInput', 'test')
      .expect.element('#loginEmailGroup .text-danger').to.be.visible;
    browser.expect
      .element('#loginEmailGroup .text-danger')
      .text.to.equal('The email address field must be a valid email.');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;

    browser
      .setValue('#loginEmailInput', 'test@testy.com')
      .expect.element('#loginEmailGroup .text-danger').to.not.be.visible;
    browser.expect.element('button[type="submit"]').to.not.be.enabled;

    browser
      .setValue('#loginPasswordInput input[type="password"]', 'test')
      .clearValue('#loginPasswordInput input[type="password"]')
      .expect.element('#loginPasswordGroup .text-danger').to.be.visible;
    browser.expect
      .element('#loginPasswordGroup .text-danger')
      .text.to.equal('The password field is required.');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;

    browser
      .setValue('#loginPasswordInput input[type="password"]', 'mypassword')
      .expect.element('#loginPasswordGroup .text-danger').to.not.be.visible;
    browser.expect.element('button[type="submit"]').to.be.enabled;
  },

  submit: function(browser) {
    browser.expect.element('a[href="#/login"]').to.be.present;
    browser.setValue(
      '#loginPasswordInput input[type="password"]',
      'NotTheValidPa$$w0rd'
    );
    browser.click('button[type="submit"]');
    browser.expect
      .element('#error-message')
      .text.to.equal('Invalid email or password.');
    browser.setValue(
      '#loginPasswordInput input[type="password"]',
      'TheValidPa$$w0rd'
    );
    browser.click('button[type="submit"]');
    browser.expect.element('.home').to.be.present;
    browser.expect
      .element('.dropdown-toggle')
      .text.to.equal('Testy McTersterson');
    browser.expect.element('a[href="#/login"]').to.not.be.present;
  },

  logout: function(browser) {
    browser
      .click('.dropdown-toggle')
      .click('#logout-button')
      .waitForElementVisible('a[href="#/login"]', 2000);
  },

  end: function(browser) {
    browser.end();
  }
};
