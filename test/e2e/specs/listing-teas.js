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

  home: function(browser) {
    browser.expect.element('.tea-list').to.be.present;
    browser.elements('css selector', '.tea-list li', function(res) {
      this.expect(res.value.length).to.equal(5);
    });
  },

  end: function(browser) {
    browser.end();
  }
};
