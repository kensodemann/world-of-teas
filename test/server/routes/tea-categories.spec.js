'use strict';

const auth = require('../../../server/services/authentication');
const expect = require('chai').expect;
const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const teaCategories = require('../../../server/services/tea-categories');

describe('route: /api/tea-categories', () => {
  const app = express();
  require('../../../server/config/express')(app);
  require('../../../server/config/routes')(app);
  let testData;

  beforeEach(() => {
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
    sinon.stub(auth, 'isAuthenticated').returns(true);
  });

  afterEach(() => {
    auth.isAuthenticated.restore();
  });

  describe('get', () => {
    beforeEach(() => {
      sinon.stub(teaCategories, 'getAll').resolves(testData);
    });

    afterEach(() => {
      teaCategories.getAll.restore();
    });

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
