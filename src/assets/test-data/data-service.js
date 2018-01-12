'use strict';

import logger from './data-service-logger';

import login from './login';
import teaCategories from './tea-categories';
import users from './users';

// see here for more options: https://github.com/noru/vue-resource-mock
/* eslint-disable no-useless-computed-key */
export default {
  ['GET /api/tea-categories'](pathMatch, query, request) {
    logger.log(pathMatch, query, request);
    const body = teaCategories;
    return {
      body: body,
      status: 200,
      statusText: 'OK'
    };
  },
  ['POST /api/login'](pathMatch, query, request) {
    let body;
    logger.log(pathMatch, query, request);
    if (request.body && request.body.password === 'TheValidPa$$w0rd') {
      body = JSON.parse(JSON.stringify(login.success));
      body.user.email = request.body.username;
    } else {
      body = login.failure;
    }
    return {
      body: body,
      status: 200,
      statusText: 'OK'
    };
  },
  ['GET /api/users/current'](pathMatch, query, request) {
    const body = users.current;
    logger.log(pathMatch, query, request);
    return {
      body: body,
      status: body ? 200 : 404,
      statusText: 'OK'
    };
  }
};
