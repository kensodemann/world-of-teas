module.exports = {
  start: function(browser) {
    require('../util/start-with-login')(browser)
      .expect.element('.dropdown-toggle')
      .text.to.equal('Testy McTersterson');
    browser
      .click('.dropdown-toggle')
      .click('a[href="#/profile"]')
      .expect.element('#profileFirstNameGroup').to.be.visible;
    browser.expect.element('#profileLastNameGroup').to.be.visible;
    browser.expect.element('#profileEmailAddressGroup').to.be.visible;
  },

  changePassword: function(browser) {
    browser
      .click('a[href="#/change-password"]')
      .expect.element('#changePasswordCurrentPasswordGroup').to.be.visible;
    browser.expect.element('#changePasswordNewPasswordGroup').to.be.visible;
    browser.expect.element('#changePasswordVerifyPasswordGroup').to.be.visible;
    browser
      .setValue('#changePasswordNewPasswordGroup input', 'something')
      .expect.element('#changePasswordNewPasswordGroup .text-danger')
      .text.to.equal('The new password field must be at least 10 characters.');
    browser
      .setValue('#changePasswordNewPasswordGroup input', 'a')
      .expect.element('#changePasswordNewPasswordGroup .text-danger')
      .text.to.equal('');
    browser
      .setValue('#changePasswordVerifyPasswordGroup input', 'something else')
      .expect.element('#changePasswordVerifyPasswordGroup .text-danger')
      .text.to.equal('The verification password value is not valid.');
    browser
      .clearValue('#changePasswordVerifyPasswordGroup input')
      .setValue('#changePasswordVerifyPasswordGroup input', 'somethinga')
      .expect.element('#changePasswordVerifyPasswordGroup .text-danger')
      .text.to.equal('');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;
    browser
      .setValue(
        '#changePasswordCurrentPasswordGroup input',
        'something invalid'
      )
      .expect.element('button[type="submit"]').to.be.enabled;
    browser
      .click('button[type="submit"]')
      .expect.element('#error-message')
      .text.to.equal('Error: Invalid Password.');
    browser
      .clearValue('#changePasswordCurrentPasswordGroup input')
      .setValue('#changePasswordCurrentPasswordGroup input', 'TheValidPa$$w0rd')
      .click('button[type="submit"]')
      .expect.element('#profileFirstNameGroup').to.be.visible;
  },

  updateProfile: function(browser) {
    browser.expect.element('#profileFirstNameInput').value.to.equal('Testy');
    browser.expect
      .element('#profileLastNameInput')
      .value.to.equal('McTersterson');
    browser.expect
      .element('#profileEmailAddressInput')
      .value.to.equal('test@testy.com');
    browser
      .clearValue('#profileFirstNameInput')
      .expect.element('#profileFirstNameGroup .text-danger')
      .text.to.equal('The first name field is required.');
    browser
      .clearValue('#profileEmailAddressInput')
      .expect.element('#profileEmailAddressGroup .text-danger')
      .text.to.equal('The email address field is required.');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;
    browser
      .setValue('#profileEmailAddressInput', 'sam')
      .expect.element('#profileEmailAddressGroup .text-danger')
      .text.to.equal('The email address field must be a valid email.');
    browser
      .setValue('#profileEmailAddressInput', '@hell.com')
      .expect.element('#profileEmailAddressGroup .text-danger')
      .text.to.equal('');
    browser.expect.element('button[type="submit"]').to.not.be.enabled;
    browser
      .setValue('#profileFirstNameInput', 'Sam')
      .expect.element('#profileFirstNameGroup .text-danger')
      .text.to.equal('');
    browser.expect.element('button[type="submit"]').to.be.enabled;
    browser
      .click('button[type="submit"]')
      .expect.element('.dropdown-toggle')
      .text.to.equal('Sam McTersterson');
  },

  end: function(browser) {
    browser.end();
  }
};
