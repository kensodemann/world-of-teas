module.exports = function startWithLogin(browser) {
  const devServer = browser.globals.devServerURL;
  return browser
    .url(devServer)
    .waitForElementVisible('#app', 5000)
    .click('a[href="#/login"]')
    .setValue('#loginEmailInput', 'test@testy.com')
    .setValue('#loginPasswordInput input[type="password"]', 'TheValidPa$$w0rd')
    .click('button[type="submit"]');
};
