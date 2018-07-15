'use strict';

const expect = require('chai').expect;
const express = require('express');
const MockPool = require('../mocks/mock-pool');
const proxyquire = require('proxyquire');
const request = require('supertest');
const sinon = require('sinon');

describe('route: /api/teas', () => {
  let app;
  let auth;
  let mockJWT;
  let testData;

  let deleteCalled;
  let deleteCalledWith;
  let saveCalled;
  let saveCalledWith;
  class MockTeaService {
    getAll() {
      return Promise.resolve(testData);
    }

    get(id) {
      const value = testData.find(item => item.id.toString() === id.toString());
      return Promise.resolve(value);
    }

    save(tea) {
      saveCalled++;
      saveCalledWith = tea;

      if (tea.id && !testData.find(item => item.id === tea.id)) {
        return Promise.resolve();
      }
      const value = { ...{ id: 314159 }, ...tea };
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
        id: 10,
        name: 'Grassy Green',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'something about the tea',
        instructions: 'do something with the tea',
        rating: 2
      },
      {
        id: 20,
        name: 'Moldy Mushroom',
        teaCategoryId: 3,
        teaCategoryName: 'Pu-ehr',
        description:
          'A woody fermented tea with faint hints of mold and fungus',
        instructions: 'soak then brew',
        rating: 5
      },
      {
        id: 30,
        name: 'Earl Grey',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'flowery tea',
        instructions: 'do something with the tea',
        rating: 3
      },
      {
        id: 40,
        name: 'English Breakfast',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'Good basic tea',
        instructions: 'brew it hot',
        rating: 4
      },
      {
        id: 1138,
        name: 'Simple Sencha',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'Just a good basic green tea',
        instructions: 'do not over-brew',
        rating: 4
      }
    ];
    proxyquire('../../../server/routes/teas', {
      '../services/teas': MockTeaService
    })(app, auth, pool);
  });

  describe('get', () => {
    registerGetTests();

    describe('when not logged in', () => {
      beforeEach(() => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
      });

      registerGetTests();
    });
  });

  function registerGetTests() {
    it('returns the data', done => {
      request(app)
        .get('/api/teas')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });

    describe('with an id', () => {
      it('returns the data if the tea is found', done => {
        request(app)
          .get('/api/teas/30')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 30,
              name: 'Earl Grey',
              teaCategoryId: 2,
              teaCategoryName: 'Black',
              description: 'flowery tea',
              instructions: 'do something with the tea',
              rating: 3
            });
            done();
          });
      });

      it('returns 404 if the tea is not found', done => {
        request(app)
          .get('/api/teas/314159')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
  }

  describe('post', () => {
    beforeEach(() => {
      saveCalled = 0;
      saveCalledWith = null;
    });

    describe('without an id', () => {
      it('requires an API login', done => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
        request(app)
          .post('/api/teas')
          .send({
            name: 'Grassy Green',
            teaCategoryId: 1,
            teaCategoryName: 'Green',
            description: 'something about the tea',
            instructions: 'do something with the tea',
            rating: 2
          })
          .end((err, res) => {
            expect(saveCalled).to.equal(0);
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('saves the new tea', done => {
        request(app)
          .post('/api/teas')
          .send({
            id: 420,
            name: 'Grassy Green',
            teaCategoryId: 1,
            teaCategoryName: 'Green',
            description: 'something about the tea',
            instructions: 'do something with the tea',
            rating: 2
          })
          .end((err, res) => {
            expect(saveCalled).to.equal(1);
            expect(saveCalledWith).to.deep.equal({
              name: 'Grassy Green',
              teaCategoryId: 1,
              teaCategoryName: 'Green',
              description: 'something about the tea',
              instructions: 'do something with the tea',
              rating: 2
            });
            done();
          });
      });
    });

    describe('with an id', () => {
      it('requires an API login', done => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
        request(app)
          .post('/api/teas/30')
          .send({
            id: 30,
            name: 'Grassy Green',
            teaCategoryId: 1,
            teaCategoryName: 'Green',
            description: 'something about the tea',
            instructions: 'do something with the tea',
            rating: 2
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
          .post('/api/teas/30')
          .send({
            id: 30,
            name: 'Grassy Green',
            teaCategoryId: 1,
            teaCategoryName: 'Green',
            description: 'something about the tea',
            instructions: 'do something with the tea',
            rating: 2
          })
          .end((err, res) => {
            expect(saveCalled).to.equal(1);
            expect(saveCalledWith).to.deep.equal({
              id: 30,
              name: 'Grassy Green',
              teaCategoryId: 1,
              teaCategoryName: 'Green',
              description: 'something about the tea',
              instructions: 'do something with the tea',
              rating: 2
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
        .delete('/api/teas/30')
        .send({})
        .end((err, res) => {
          expect(deleteCalled).to.equal(0);
          expect(res.status).to.equal(401);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it('calls the delete', done => {
      request(app)
        .delete('/api/teas/30')
        .send({})
        .end((err, res) => {
          expect(deleteCalled).to.equal(1);
          expect(deleteCalledWith).to.equal(30);
          done();
        });
    });
  });
});
