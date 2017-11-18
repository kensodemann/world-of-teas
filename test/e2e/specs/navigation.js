module.exports = {
  'start': function (browser) {
    const devServer = browser.globals.devServerURL
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.home')
      .assert.containsText('h1', 'Home is Wherever the Tea Is')
  },

  'categories': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/categories"]')
      .assert.elementPresent('.browse-by-category')
      .assert.containsText('h1', 'I Like to Browse by Category')
  },

  'links': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/links"]')
      .assert.elementPresent('.links')
      .assert.containsText('h1', 'Welcome to Your Vue.js App')
  },

  'login': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/login"]')
      .assert.elementPresent('.login')
      .assert.containsText('h1', 'Login Page is Here')
  },

  'ratings': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/ratings"]')
      .assert.elementPresent('.browse-by-rating')
      .assert.containsText('h1', 'I Like to Browse by Rating')
  },

  'back home': function(browser) {
    const devServer = browser.globals.devServerURL
    browser
      .click('a[href="#/"]')
      .assert.elementPresent('.home')
      .assert.containsText('h1', 'Home is Wherever the Tea Is')
      .end()
  }
}
