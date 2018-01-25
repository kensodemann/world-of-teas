const start = require('../util/start-with-login');

module.exports = {
  start: function(browser) {
    start(browser);
  },

  openCloseWithoutChange: function(browser) {
    browser
      .click('.form-inline button')
      .waitForElementVisible('#teaEditor', 2000)
      .click('#teaEditor .close')
      .waitForElementNotVisible('#teaEditor', 2000)
      .click('.form-inline button')
      .waitForElementVisible('#teaEditor', 2000)
      .click('#teaEditor .btn-secondary')
      .waitForElementNotVisible('#teaEditor', 2000);
  },

  end: function(browser) {
    browser.end();
  }
};
