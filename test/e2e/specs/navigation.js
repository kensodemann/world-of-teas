// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'start': function (browser) {
    const devServer = browser.globals.devServerURL
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.home')
      .assert.containsText('h1', 'Home is Wherever the Tea Is')
      .assert.cssClassPresent('a[href="#/"', 'active')
      .assert.cssClassNotPresent('a[href="#/categories"', 'active')
      .assert.cssClassNotPresent('a[href="#/links"', 'active')
      .assert.cssClassNotPresent('a[href="#/login"', 'active')
      .assert.cssClassNotPresent('a[href="#/ratings"', 'active')
  },

  'categories': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/categories"]')
      .assert.elementPresent('.browse-by-category')
      .assert.containsText('h1', 'I Like to Browse by Category')
      .assert.cssClassNotPresent('a[href="#/"', 'active')
      .assert.cssClassPresent('a[href="#/categories"', 'active')
      .assert.cssClassNotPresent('a[href="#/links"', 'active')
      .assert.cssClassNotPresent('a[href="#/login"', 'active')
      .assert.cssClassNotPresent('a[href="#/ratings"', 'active')
  },

  'links': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/links"]')
      .assert.elementPresent('.links')
      .assert.containsText('h1', 'Welcome to Your Vue.js App')
      .assert.cssClassNotPresent('a[href="#/"', 'active')
      .assert.cssClassNotPresent('a[href="#/categories"', 'active')
      .assert.cssClassPresent('a[href="#/links"', 'active')
      .assert.cssClassNotPresent('a[href="#/login"', 'active')
      .assert.cssClassNotPresent('a[href="#/ratings"', 'active')
  },

  'login': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/login"]')
      .assert.elementPresent('.login')
      .assert.containsText('h1', 'Login Page is Here')
      .assert.cssClassNotPresent('a[href="#/"', 'active')
      .assert.cssClassNotPresent('a[href="#/categories"', 'active')
      .assert.cssClassNotPresent('a[href="#/links"', 'active')
      .assert.cssClassPresent('a[href="#/login"', 'active')
      .assert.cssClassNotPresent('a[href="#/ratings"', 'active')
  },

  'ratings': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/ratings"]')
      .assert.elementPresent('.browse-by-rating')
      .assert.containsText('h1', 'I Like to Browse by Rating')
      .assert.cssClassNotPresent('a[href="#/"', 'active')
      .assert.cssClassNotPresent('a[href="#/categories"', 'active')
      .assert.cssClassNotPresent('a[href="#/links"', 'active')
      .assert.cssClassNotPresent('a[href="#/login"', 'active')
      .assert.cssClassPresent('a[href="#/ratings"', 'active')
  },

  'back home': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/"]')
      .assert.elementPresent('.home')
      .assert.containsText('h1', 'Home is Wherever the Tea Is')
      .assert.cssClassPresent('a[href="#/"', 'active')
      .assert.cssClassNotPresent('a[href="#/categories"', 'active')
      .assert.cssClassNotPresent('a[href="#/links"', 'active')
      .assert.cssClassNotPresent('a[href="#/login"', 'active')
      .assert.cssClassNotPresent('a[href="#/ratings"', 'active')
      .end()
  }
}
