import mockTeaCategories from './mock-tea-categories';

// see here for more options: https://github.com/noru/vue-resource-mock
export default {
  ['GET /api/tea-categories'](pathMatch, query, request) {
    let body = mockTeaCategories;
    return {
      body: body,
      status: 200,
      statusText: 'OK'
    };
  }
};
