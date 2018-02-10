'use strict';

const expect = require('chai').expect;
const express = require('express');
const MockPool = require('../mocks/mock-pool');
const proxyquire = require('proxyquire');
const request = require('supertest');
const sinon = require('sinon');

describe('route: /api/teas-purchase-links', () => {
  let app;
  let auth;
  let mockJWT;
  let testData;

  let deleteCalled;
  let deleteCalledWith;
  let saveCalled;
  let saveCalledWith;
  class MockTeaPurchaseLinksService {
    getAll(teaId) {
      return Promise.resolve(
        testData.filter(t => t.teaId.toString() === teaId)
      );
    }

    save(link) {
      saveCalled++;
      saveCalledWith = link;

      if (link.id && !testData.find(item => item.id === link.id)) {
        return Promise.resolve();
      }
      const value = Object.assign({}, { id: 314159 }, link);
      return Promise.resolve(value);
    }

    delete(id) {
      deleteCalled++;
      deleteCalledWith = id;
      return Promise.resolve({});
    }
  }

  beforeEach(() => {
    mockJWT = {};
    const AuthService = proxyquire('../../../server/services/authentication', {
      jsonwebtoken: mockJWT
    });
    sinon.stub(mockJWT, 'verify');
    mockJWT.verify.returns({
      id: 1138,
      firstName: 'Ted',
      lastName: 'Senspeck',
      roles: ['user'],
      iat: 'whatever',
      exp: 19930124509912485
    });
    auth = new AuthService();

    app = express();
    require('../../../server/config/express')(app);
    const pool = new MockPool();
    testData = [
      {
        id: 1,
        teaId: 10,
        url: 'http://www.earlsteas.com/grassy-green',
        price: 35.99
      },
      {
        id: 2,
        teaId: 20,
        url: 'http://www.earlsteas.com/shroom',
        price: 75.25
      },
      {
        id: 3,
        teaId: 30,
        url: 'http://www.earlsteas.com/earl-grey',
        price: 25.5
      },
      {
        id: 4,
        teaId: 40,
        url: 'http://www.earlsteas.com/eng-bfast',
        price: 35.99
      },
      {
        id: 5,
        teaId: 1138,
        url: 'http://www.earlsteas.com/sencha',
        price: 55.22
      },
      {
        id: 6,
        teaId: 10,
        url: 'http://www.natures-nector.com/grassy-green',
        price: 37.5
      },
      {
        id: 7,
        teaId: 10,
        url: 'http://www.jaxxjyll.com/grassy-green',
        price: 34.75
      },
      {
        id: 8,
        teaId: 30,
        url: 'http://www.jaxxjyll.com/earl-grey',
        price: 19.99
      },
      {
        id: 9,
        teaId: 1138,
        url: 'http://www.jaxxjyll.com/sencha',
        price: 50.75
      },
      {
        id: 10,
        teaId: 1138,
        url: 'http://www.natures-nector.com/sencha',
        price: 65.23
      },
      {
        id: 11,
        teaId: 1138,
        url: 'http://www.backalley.com/sencha',
        price: 15.99
      }
    ];
    proxyquire('../../../server/routes/tea-purchase-links', {
      '../services/tea-purchase-links': MockTeaPurchaseLinksService
    })(app, auth, pool);
  });

  describe('get', () => {
    registerGetTest();

    describe('when not logged in', () => {
      beforeEach(() => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
      });

      registerGetTest();
    });
  });

  function registerGetTest() {
    it('returns the data', done => {
      request(app)
        .get('/api/teas/30/links')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData.filter(t => t.teaId === 30));
          done();
        });
    });
  }

  describe('post', () => {
    beforeEach(() => {
      saveCalled = 0;
      saveCalledWith = null;
    });

    describe('with an id', () => {
      it('requires an API login', done => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
        request(app)
          .post('/api/teas/1138/links/10')
          .send({
            id: 10,
            teaId: 1138,
            url: 'http://www.natures-nector.com/basic-sencha',
            price: 59.99
          })
          .end((err, res) => {
            expect(saveCalled).to.equal(0);
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('calls the save', done => {
        request(app)
          .post('/api/teas/1138/links/10')
          .send({
            id: 10,
            teaId: 1138,
            url: 'http://www.natures-nector.com/basic-sencha',
            price: 59.99
          })
          .end((err, res) => {
            expect(saveCalled).to.equal(1);
            expect(saveCalledWith).to.deep.equal({
              id: 10,
              teaId: 1138,
              url: 'http://www.natures-nector.com/basic-sencha',
              price: 59.99
            });
            done();
          });
      });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      deleteCalled = 0;
      deleteCalledWith = null;
    });

    it('requires an API login', done => {
      mockJWT.verify.throws(new Error('no loggy loggy'));
      request(app)
        .delete('/api/teas/1138/links/10')
        .send({})
        .end((err, res) => {
          expect(deleteCalled).to.equal(0);
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('calls the delete', done => {
      request(app)
        .delete('/api/teas/1138/links/10')
        .send({})
        .end((err, res) => {
          expect(deleteCalled).to.equal(1);
          expect(deleteCalledWith).to.equal(10);
          done();
        });
    });
  });
});
