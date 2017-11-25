'use strict';

const expect = require('chai').expect;
const express = require('express');
const MockPool = require('./mocks/mock-pool');
const request = require('supertest');
const sinon = require('sinon');

describe('/api/tea-categories', function() {
  let app;
  let pool;
  let testData;

  beforeEach(function() {
    app = express();
    pool = new MockPool();
    testData = [
      ({
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
        })
    ];
    require('../../server/tea-categories')(app, pool);
  });

  describe('get', function() {
    it('connects to the pool', function(done) {
      sinon.spy(pool, 'connect');
      request(app)
        .get('/api/tea-categories')
        .end(function(err, res) {
          expect(pool.connect.calledOnce).to.be.true;
          done();
        });
    });

    it('queries the tea categories', function(done) {
      sinon.spy(pool.test_client, 'query');
      request(app)
        .get('/api/tea-categories')
        .end(function(err, res) {
          expect(pool.test_client.query.calledOnce).to.be.true;
          expect(
            pool.test_client.query.calledWith('select * from tea_categories')
          ).to.be.true;
          done();
        });
    });

    it('returns the data', function(done) {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: testData }));
      request(app)
        .get('/api/tea-categories')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });

    it('releases the client', function(done) {
      sinon.spy(pool.test_client, 'release');
      request(app)
        .get('/api/tea-categories')
        .end(function(err, res) {
          expect(pool.test_client.release.calledOnce).to.be.true;
          done();
        });
    });
  });
});
