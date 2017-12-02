'use strict';

const expect = require('chai').expect;
const express = require('express');
const MockPool = require('../mocks/mock-pool');
const proxyquire = require('proxyquire');
const request = require('supertest');

describe('route: /api/tea-categories', function() {
  let app;
  let testData;

  class MockTeaCategoryService {
    getAll() {
      return Promise.resolve(testData);
    }
  }

  beforeEach(function() {
    app = express();
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
    })(app, pool);
  });

  describe('get', function() {
    it('returns the data', function(done) {
      request(app)
        .get('/api/tea-categories')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });
  });
});
