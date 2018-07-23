'use strict';

const expect = require('chai').expect;
const express = require('express');
const MockPool = require('../mocks/mock-pool');
const proxyquire = require('proxyquire');
const request = require('supertest');
const sinon = require('sinon');

describe('route: /api/tea-categories', () => {
  let app;
  let testData;

  class MockTeaCategoryService {
    getAll() {
      return Promise.resolve(testData);
    }
  }

  beforeEach(() => {
    const mockJWT = {};
    const AuthService = proxyquire('../../../server/services/authentication', {
      jsonwebtoken: mockJWT
    });
    sinon.stub(mockJWT, 'verify');
    mockJWT.verify.returns({
      id: 1138,
      firstName: 'Ted',
      lastName: 'Senspeck',
      roles: ['admin'],
      iat: 'whatever',
      exp: 19930124509912485
    });
    const auth = new AuthService();

    app = express();
    require('../../../server/config/express')(app);
    const pool = new MockPool();
    testData = [
      {
        id: 1,
        name: 'Green',
        description: 'Non - oxidized, mild tea'
      },
      {
        id: 2,
        name: 'Black',
        description: 'Oxidized tea'
      },
      {
        id: 3,
        name: 'Herbal',
        description: 'Not a tea'
      }
    ];
    proxyquire('../../../server/routes/tea-categories', {
      '../services/tea-categories': MockTeaCategoryService
    })(app, auth, pool);
  });

  describe('get', () => {
    it('returns the data', done => {
      request(app)
        .get('/api/tea-categories')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });
  });
});
