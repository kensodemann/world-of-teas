'use strict';

const expect = require('chai').expect;
const express = require('express');
const MockPool = require('../mocks/mock-pool');
const proxyquire = require('proxyquire');
const request = require('supertest');
const sinon = require('sinon');

describe('route: /api/users', () => {
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
      const value = testData.find(item => item.id.toString() === id.toString());
      return Promise.resolve(value);
    }

    save(user) {
      saveCalled++;
      saveCalledWith = user;

      if (user.id && !testData.find(item => item.id === user.id)) {
        return Promise.resolve();
      }
      const value = { ...{ id: 314159 }, ...user };
      return Promise.resolve(value);
    }
  }

  let passwordCall;
  let passwordError;
  class MockPasswordService {
    change(id, password, currentPassword) {
      passwordCall.set('method', 'change');
      passwordCall.set('id', id);
      passwordCall.set('password', password);
      passwordCall.set('currentPassword', currentPassword);
      return passwordError
        ? Promise.reject(new Error(passwordError))
        : Promise.resolve();
    }

    reset(id, password, token) {
      passwordCall.set('method', 'reset');
      passwordCall.set('id', id);
      passwordCall.set('password', password);
      passwordCall.set('token', token);
      return passwordError
        ? Promise.reject(new Error(passwordError))
        : Promise.resolve();
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
      },
      {
        id: 1138,
        firstName: 'Teddy',
        lastName: 'Senspeck',
        roles: ['admin']
      }
    ];
    proxyquire('../../../server/routes/users', {
      '../services/password': MockPasswordService,
      '../services/users': MockUserService
    })(app, auth, pool);
  });

  describe('get', () => {
    it('requires an API login', done => {
      mockJWT.verify.throws(new Error('no loggy loggy'));
      request(app)
        .get('/api/users')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it('returns the data', done => {
      request(app)
        .get('/api/users')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });

    describe('with "current"', () => {
      it('requires an API login', done => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
        request(app)
          .get('/api/users/current')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('returns the current user', done => {
        request(app)
          .get('/api/users/current')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 1138,
              firstName: 'Teddy',
              lastName: 'Senspeck',
              roles: ['admin']
            });
            done();
          });
      });
    });

    describe('with an id', () => {
      it('requires an API login', done => {
        mockJWT.verify.throws(new Error('no loggy loggy'));
        request(app)
          .get('/api/users/30')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('returns the data if the current user is admin', done => {
        request(app)
          .get('/api/users/30')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 30,
              firstName: 'Barney',
              lastName: 'Rubble'
            });
            done();
          });
      });

      it('returns the data if the ids match', done => {
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
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 30,
              firstName: 'Barney',
              lastName: 'Rubble'
            });
            done();
          });
      });

      it('returns 403 if user not admin and ids do not match', done => {
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
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('returns 404 if the user is not found', done => {
        request(app)
          .get('/api/users/314159')
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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
          .end((err, res) => {
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

      it('clears the id if specified in the body', done => {
        request(app)
          .post('/api/users')
          .send({
            id: 42,
            firstName: 'Barney',
            lastName: 'Rubble',
            email: 'barney@rubble.kings.io'
          })
          .end((err, res) => {
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
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });
  });

  describe('post change password', () => {
    beforeEach(() => {
      passwordCall = new Map();
      passwordError = undefined;
    });

    it('requires an API login', done => {
      mockJWT.verify.throws(new Error('no loggy loggy'));
      request(app)
        .post('/api/users/30/password')
        .send({
          password: 'IamNewPa$$worD',
          currentPassword: 'iAmCurr3ntPassw0rd'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it('calls change', done => {
      request(app)
        .post('/api/users/30/password')
        .send({
          password: 'IamNewPa$$worD',
          currentPassword: 'iAmCurr3ntPassw0rd'
        })
        .end((err, res) => {
          expect(passwordCall.get('method')).to.equal('change');
          expect(passwordCall.get('id')).to.equal('30');
          expect(passwordCall.get('password')).to.equal('IamNewPa$$worD');
          expect(passwordCall.get('currentPassword')).to.equal(
            'iAmCurr3ntPassw0rd'
          );
          done();
        });
    });

    it('returns 200 on success', done => {
      request(app)
        .post('/api/users/30/password')
        .send({
          password: 'IamNewPa$$worD',
          currentPassword: 'iAmCurr3ntPassw0rd'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('returns 400 on current password invalid', done => {
      passwordError = 'Invalid password';
      request(app)
        .post('/api/users/30/password')
        .send({
          password: 'IamNewPa$$worD',
          currentPassword: 'iAmCurr3ntPassw0rd'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Invalid password');
          done();
        });
    });

    it('returns 500 on unknown failure', done => {
      passwordError = 'The database went stupid on us';
      request(app)
        .post('/api/users/30/password')
        .send({
          password: 'IamNewPa$$worD',
          currentPassword: 'iAmCurr3ntPassw0rd'
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.reason).to.equal('Unknown error');
          done();
        });
    });

    describe('with just a password', () => {
      it('calls nothing', done => {
        request(app)
          .post('/api/users/30/password')
          .send({
            password: 'IamNewPa$$worD'
          })
          .end((err, res) => {
            expect(passwordCall.get('method')).to.be.undefined;
            done();
          });
      });

      it('retuns 400', done => {
        request(app)
          .post('/api/users/30/password')
          .send({
            password: 'IamNewPa$$worD'
          })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
      });
    });

    describe('with just a current password', () => {
      it('calls nothing', done => {
        request(app)
          .post('/api/users/30/password')
          .send({
            currentPassword: 'iAmCurr3ntPassw0rd'
          })
          .end((err, res) => {
            expect(passwordCall.get('method')).to.be.undefined;
            done();
          });
      });

      it('retuns 400', done => {
        request(app)
          .post('/api/users/30/password')
          .send({
            currentPassword: 'iAmCurr3ntPassw0rd'
          })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
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
        .post('/api/users/42/password')
        .send({
          password: 'IamNewPa$$worD',
          currentPassword: 'iAmCurr3ntPassw0rd'
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });

  describe('post reset password', () => {
    beforeEach(() => {
      passwordCall = new Map();
      passwordError = undefined;
    });

    it('calls reset', done => {
      request(app)
        .post('/api/users/30/password/38849950394ADEF45CF')
        .send({
          password: 'IamNewPa$$worD'
        })
        .end((err, res) => {
          expect(passwordCall.get('method')).to.equal('reset');
          expect(passwordCall.get('id')).to.equal('30');
          expect(passwordCall.get('password')).to.equal('IamNewPa$$worD');
          expect(passwordCall.get('token')).to.equal('38849950394ADEF45CF');
          done();
        });
    });

    it('returns 200 on success', done => {
      request(app)
        .post('/api/users/30/password/38849950394ADEF45CF')
        .send({
          password: 'IamNewPa$$worD'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('returns 400 on invalid token', done => {
      passwordError = 'Invalid token';
      request(app)
        .post('/api/users/30/password/38849950394ADEF45CF')
        .send({
          password: 'IamNewPa$$worD'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('returns 400 on expired token', done => {
      passwordError = 'Expired token';
      request(app)
        .post('/api/users/30/password/38849950394ADEF45CF')
        .send({
          password: 'IamNewPa$$worD'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('returns 400 without password', done => {
      request(app)
        .post('/api/users/30/password/38849950394ADEF45CF')
        .send({})
        .end((err, res) => {
          expect(passwordCall.get('method')).to.be.undefined;
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('returns 500 on unknown failure', done => {
      passwordError = 'The database went stupid on us';
      request(app)
        .post('/api/users/30/password/38849950394ADEF45CF')
        .send({
          password: 'IamNewPa$$worD'
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          done();
        });
    });
  });
});
