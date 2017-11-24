import teaCategories from './tea-categories';

// see here for more options: https://github.com/noru/vue-resource-mock
/* eslint-disable no-useless-computed-key */
export default {
  ['GET /api/tea-categories'](pathMatch, query, request) {
    let body = teaCategories;
    return {
      body: body,
      status: 200,
      statusText: 'OK'
    };
  }
};
