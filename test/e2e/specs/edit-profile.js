module.exports = {
  start: function(browser) {
    const devServer = browser.globals.devServerURL;
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .click('a[href="#/login"]');
    browser.setValue('#loginEmailInput', 'test@testy.com');
    browser.setValue(
      '#loginPasswordInput input[type="password"]',
      'TheValidPa$$w0rd'
    );
    browser.click('button[type="submit"]');
    browser.expect
      .element('.dropdown-toggle')
      .text.to.equal('Testy McTersterson');
    browser.click('.dropdown-toggle');
    browser.click('a[href="#/profile"]');
    browser.expect.element('#profileFirstNameGroup').to.be.visible;
    browser.expect.element('#profileLastNameGroup').to.be.visible;
    browser.expect.element('#profileEmailAddressGroup').to.be.visible;
  },

  changePassword: function(browser) {
    browser.click('a[href="#/change-password"]');
    browser.expect.element('#changePasswordCurrentPasswordGroup').to.be.visible;
    browser.expect.element('#changePasswordNewPasswordGroup').to.be.visible;
    browser.expect.element('#changePasswordVerifyPasswordGroup').to.be.visible;
    browser.setValue('#changePasswordNewPasswordGroup input', 'something');
    browser.expect
      .element('#changePasswordNewPasswordGroup .text-danger')
      .text.to.equal('The new password field must be at least 10 characters.');
    browser.setValue('#changePasswordNewPasswordGroup input', 'a');
    browser.expect
      .element('#changePasswordNewPasswordGroup .text-danger')
      .text.to.equal('');
    browser.setValue(
      '#changePasswordVerifyPasswordGroup input',
      'something else'
    );
    browser.expect
      .element('#changePasswordVerifyPasswordGroup .text-danger')
      .text.to.equal('The verification password value is not valid.');
    browser.clearValue('#changePasswordVerifyPasswordGroup input');
    browser.setValue('#changePasswordVerifyPasswordGroup input', 'somethinga');
    browser.expect
      .element('#changePasswordVerifyPasswordGroup .text-danger')
      .text.to.equal('');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;
    browser.setValue(
      '#changePasswordCurrentPasswordGroup input',
      'something invalid'
    );
    browser.expect.element('button[type="submit"]').to.be.enabled;
    browser.click('button[type="submit"]');
    browser.expect
      .element('#error-message')
      .text.to.equal('Error: Invalid Password.');
    browser.clearValue('#changePasswordCurrentPasswordGroup input');
    browser.setValue(
      '#changePasswordCurrentPasswordGroup input',
      'TheValidPa$$w0rd'
    );
    browser.click('button[type="submit"]');
    browser.expect.element('#profileFirstNameGroup').to.be.visible;
  },

  updateProfile: function(browser) {
    browser.expect.element('#profileFirstNameInput').value.to.equal('Testy');
    browser.expect
      .element('#profileLastNameInput')
      .value.to.equal('McTersterson');
    browser.expect
      .element('#profileEmailAddressInput')
      .value.to.equal('test@testy.com');
    browser.clearValue('#profileFirstNameInput');
    browser.expect
      .element('#profileFirstNameGroup .text-danger')
      .text.to.equal('The first name field is required.');
    browser.clearValue('#profileEmailAddressInput');
    browser.expect
      .element('#profileEmailAddressGroup .text-danger')
      .text.to.equal('The email address field is required.');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;
    browser.setValue('#profileEmailAddressInput', 'sam');
    browser.expect
      .element('#profileEmailAddressGroup .text-danger')
      .text.to.equal('The email address field must be a valid email.');
    browser.setValue('#profileEmailAddressInput', '@hell.com');
    browser.expect
      .element('#profileEmailAddressGroup .text-danger')
      .text.to.equal('');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;
    browser.setValue('#profileFirstNameInput', 'Sam');
    browser.expect
      .element('#profileFirstNameGroup .text-danger')
      .text.to.equal('');
    browser.expect.element('button[type="submit"]').to.be.enabled;
    browser.click('button[type="submit"]');
    browser.expect
      .element('.dropdown-toggle')
      .text.to.equal('Sam McTersterson');
  },

  end: function(browser) {
    browser.end();
  }
};
