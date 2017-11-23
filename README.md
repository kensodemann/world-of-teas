[![Build Status][travis-badge]][travis-badge-url]

# world-of-teas

A Catalog of Teas I Have Tried.

## Development Notes

This application consists of two parts: a data service under the `server/` folder and the web UI under the `src/` folder. The data service is a NodeJS Express application. In production it serves both the UI and the data for the UI. The UI is a Vue.js application based off of the Vue.js webpack template.

In development the `webpage-dev-server` is used to serve the UI instead of the NodeJS server. This allows for hot-reloading during development and is integrated in with the testing. This also means that in order to develop the data service needs to be started and that extra setup is required in order to facilitate proxying the data service calls.

If the proxy setup ever needs to be modified, see the following files:

- `build/webpack.dev.conf.js` - minor plugin option change
- `config/index.js` - the bulk of the proxy setup is here


## Build Scripts

These are the most commonly used build scripts. For a complete list see the `package.json` file.

``` bash
# install dependencies
npm install

# start data services on port 5000, serve UI with hot reload at localhost:8080
heroku local web
npm run dev

# run lint
npm run lint

# run unit tests (server only, UI only, both w/ lint)
npm run unitsrv
npm run unitweb
npm test

# run e2e tests
npm run e2e

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the following documentation:

- [Vui.js webpack template guide](http://vuejs-templates.github.io/webpack/)
- [vue-loader docs](http://vuejs.github.io/vue-loader)
- [vuex docs](https://vuex.vuejs.org/en/)
- [Heroku Docs](https://devcenter.heroku.com/categories/nodejs)


[travis-badge]: https://travis-ci.org/kensodemann/world-of-teas.svg?branch=master
[travis-badge-url]: https://travis-ci.org/kensodemann/world-of-teas
