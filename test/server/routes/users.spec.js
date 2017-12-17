'use strict';

const expect = require('chai').expect;
const express = require('express');
const MockPool = require('../mocks/mock-pool');
const proxyquire = require('proxyquire');
const request = require('supertest');
const sinon = require('sinon');

describe('route: /api/users', function() {
  let app;
  let auth;
  let mockJWT;
  let testData;

  let saveCalled;
  let saveCalledWith;
  class MockUserService {
    getAll() {
      return Promise.resolve(testData);
    }

    get(id) {
      const value = testData.find(item => item.id.toString() === id);
      return Promise.resolve(value);
    }

    save(user) {
      saveCalled++;
      saveCalledWith = user;
      if (user.id && !testData.find(item => item.id === user.id)) {
        return Promise.resolve();
      }
      const value = Object.assign({}, { id: 314159 }, user);
      return Promise.resolve(value);
    }
  }

  beforeEach(function() {
    mockJWT = {};
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
    auth = new AuthService();

    app = express();
    require('../../../server/config/express')(app);
    const pool = new MockPool();
    testData = [
      {
        id: 10,
        firstName: 'Fred',
        lastName: 'Flintstone'
      },
      {
        id: 20,
        firstName: 'Wilma',
        lastName: 'Flintstone'
      },
      {
        id: 30,
        firstName: 'Barney',
        lastName: 'Rubble'
      },
      {
        id: 40,
        firstName: 'Betty',
        lastName: 'Rubble'
      }
    ];
    proxyquire('../../../server/routes/users', {
      '../services/users': MockUserService
    })(app, auth, pool);
  });

  describe('get', function() {
    it('requires an API login', function(done) {
      mockJWT.verify.throws(new Error('no loggy loggy'));
      request(app)
        .get('/api/users')
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it('returns the data', function(done) {
      request(app)
        .get('/api/users')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });

    describe('with an id', function() {
      it('requires an API login', function(done) {
        mockJWT.verify.throws(new Error('no loggy loggy'));
        request(app)
          .get('/api/users/30')
          .end(function(err, res) {
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('returns the data if the current user is admin', function(done) {
        request(app)
          .get('/api/users/30')
          .end(function(err, res) {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 30,
              firstName: 'Barney',
              lastName: 'Rubble'
            });
            done();
          });
      });

      it('returns the data if the ids match', function(done) {
        mockJWT.verify.returns({
          id: 30,
          firstName: 'Barney',
          lastName: 'Rubble',
          roles: ['user'],
          iat: 'whatever',
          exp: 19930124509912485
        });
        request(app)
          .get('/api/users/30')
          .end(function(err, res) {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 30,
              firstName: 'Barney',
              lastName: 'Rubble'
            });
            done();
          });
      });

      it('returns 403 if user not admin and ids do not match', function(done) {
        mockJWT.verify.returns({
          id: 10,
          firstName: 'Fred',
          lastName: 'Flintstone',
          roles: ['user'],
          iat: 'whatever',
          exp: 19930124509912485
        });
        request(app)
          .get('/api/users/30')
          .end(function(err, res) {
            expect(res.status).to.equal(403);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('returns 404 if the user is not found', function(done) {
        request(app)
          .get('/api/users/314159')
          .end(function(err, res) {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
  });

  describe('post', () => {
    beforeEach(() => {
      saveCalled = 0;
      saveCalledWith = null;
    });

    describe('with an id', () => {
      it('requires an API login', done => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
        request(app)
          .post('/api/users/30')
          .send({
            id: 30,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('calls the save if admin', done => {
        request(app)
          .post('/api/users/30')
          .send({
            id: 30,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(saveCalled).to.equal(1);
            expect(saveCalledWith).to.deep.equal({
              id: 30,
              firstName: 'Barney',
              lastName: 'Rubble',
              email: 'barney@rubble.kings.io'
            });
            done();
          });
      });

      it('calls the save if own user', done => {
        mockJWT.verify.returns({
          id: 30,
          firstName: 'Barney',
          lastName: 'Rubble',
          roles: ['user'],
          iat: 'whatever',
          exp: 19930124509912485
        });
        request(app)
          .post('/api/users/30')
          .send({
            id: 30,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(saveCalled).to.equal(1);
            expect(saveCalledWith).to.deep.equal({
              id: 30,
              firstName: 'Barney',
              lastName: 'Rubble',
              email: 'barney@rubble.kings.io'
            });
            done();
          });
      });

      it('returns the saved data', done => {
        request(app)
          .post('/api/users/30')
          .send({
            id: 30,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 30,
              firstName: 'Barney',
              lastName: 'Rubble',
              email: 'barney@rubble.kings.io'
            });
            done();
          });
      });

      it('uses the id from the route', done => {
        request(app)
          .post('/api/users/30')
          .send({
            id: 42,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(saveCalled).to.equal(1);
            expect(saveCalledWith).to.deep.equal({
              id: 30,
              firstName: 'Barney',
              lastName: 'Rubble',
              email: 'barney@rubble.kings.io'
            });
            done();
          });
      });

      it('returns 404 if saving a user that does not exist', done => {
        request(app)
          .post('/api/users/42')
          .send({
            id: 42,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('returns 403 if not admin and not own user', done => {
        mockJWT.verify.returns({
          id: 10,
          firstName: 'Fred',
          lastName: 'Flintstone',
          roles: ['user'],
          iat: 'whatever',
          exp: 19930124509912485
        });
        request(app)
          .post('/api/users/42')
          .send({
            id: 42,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(403);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });

    describe('without an id', () => {
      it('requires an API login', done => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
        request(app)
          .post('/api/users')
          .send({
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('calls the save if admin', done => {
        request(app)
          .post('/api/users')
          .send({
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(saveCalled).to.equal(1);
            expect(saveCalledWith).to.deep.equal({
              firstName: 'Barney',
              lastName: 'Rubble',
              email: 'barney@rubble.kings.io'
            });
            done();
          });
      });

      it('returns the saved data', done => {
        request(app)
          .post('/api/users')
          .send({
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 314159,
              firstName: 'Barney',
              lastName: 'Rubble',
              email: 'barney@rubble.kings.io'
            });
            done();
          });
      });

      it('clears the id if specified in the body', (done) => {
        request(app)
          .post('/api/users')
          .send({
            id: 42,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(saveCalled).to.equal(1);
            expect(saveCalledWith).to.deep.equal({
              firstName: 'Barney',
              lastName: 'Rubble',
              email: 'barney@rubble.kings.io'
            });
            done();
          });
      });

      it('returns 403 if not admin', done => {
        mockJWT.verify.returns({
          id: 10,
          firstName: 'Fred',
          lastName: 'Flintstone',
          roles: ['user'],
          iat: 'whatever',
          exp: 19930124509912485
        });
        request(app)
          .post('/api/users')
          .send({
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(403);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });
  });
});
