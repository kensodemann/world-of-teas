module.exports = {
  start: function(browser) {
    const devServer = browser.globals.devServerURL;
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .expect.element('.home').to.be.present;
    browser.expect.element('.page-title').text.to.equal('Find Great Tea');
    browser.expect
      .element('a[href="#/"]')
      .to.have.attribute('class')
      .which.contains('active');
    browser.expect.element('.active > .nav-link').to.not.be.present;
  },

  categories: function(browser) {
    browser
      .click('a[href="#/categories"]')
      .expect.element('.page').to.be.present;
    browser.expect
      .element('a[href="#/"]')
      .to.have.attribute('class')
      .which.not.contains('active');
    browser.expect.element('.active > .nav-link').text.to.equal('Categories');
  },

  links: function(browser) {
    browser.click('a[href="#/links"]').expect.element('.links').to.be.present;
    browser.expect.element('.page-title').text.to.equal('Tea Related Information');
    browser.expect
      .element('a[href="#/"]')
      .to.have.attribute('class')
      .which.not.contains('active');
    browser.expect.element('.active > .nav-link').text.to.equal('Links');
  },

  login: function(browser) {
    browser.click('a[href="#/login"]').expect.element('.login').to.be.present;
    browser.expect.element('.page-title').text.to.equal('Login');
    browser.expect.element('.active > .nav-link').text.to.equal('Login');
  },

  ratings: function(browser) {
    browser.click('a[href="#/ratings"]').expect.element('.browse-by-rating').to
      .be.present;
    browser.expect.element('.page-title').text.to.equal('Teas by Rating');
    browser.expect
      .element('a[href="#/"]')
      .to.have.attribute('class')
      .which.not.contains('active');
    browser.expect.element('.active > .nav-link').text.to.equal('Ratings');
  },

  'back home': function(browser) {
    browser.click('a[href="#/"]').expect.element('.home').to.be.present;
    browser.expect
      .element('a[href="#/"]')
      .to.have.attribute('class')
      .which.contains('active');
    browser.expect.element('.active > .nav-link').to.not.be.present;
    browser.end();
  }
};
