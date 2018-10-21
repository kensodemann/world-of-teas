'use strict';

const auth = require('../../../server/services/authentication');
const expect = require('chai').expect;
const express = require('express');
const password = require('../../../server/services/password');
const request = require('supertest');
const sinon = require('sinon');
const users = require('../../../server/services/users');

describe('route: /api/users', () => {
  const app = express();
  require('../../../server/config/express')(app);
  require('../../../server/config/routes')(app);

  let testData;

  beforeEach(() => {
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
    sinon.stub(auth, 'isAuthenticated').returns(true);
    sinon.stub(auth, 'verifyToken').returns({
      id: 1138,
      firstName: 'Teddy',
      lastName: 'Senspeck',
      roles: ['admin'],
      iat: 'whatever',
      exp: 19930124509912485
    });
    sinon.stub(users, 'getAll').resolves(testData);
    sinon
      .stub(users, 'get')
      .withArgs(1138)
      .returns(
        Promise.resolve({
          id: 1138,
          firstName: 'Teddy',
          lastName: 'Senspeck',
          roles: ['admin']
        })
      );
    users.get.withArgs('30').resolves({
      id: 30,
      firstName: 'Barney',
      lastName: 'Rubble'
    });
    sinon.stub(users, 'save');
  });

  afterEach(() => {
    auth.isAuthenticated.restore();
    auth.verifyToken.restore();
    users.getAll.restore();
    users.get.restore();
    users.save.restore();
  });

  describe('get', () => {
    it('requires an API login', done => {
      auth.isAuthenticated.returns(false);
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
        auth.isAuthenticated.returns(false);
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
        auth.isAuthenticated.returns(false);
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
        auth.verifyToken.returns({
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
        auth.verifyToken.returns({
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
    describe('with an id', () => {
      it('requires an API login', done => {
        auth.isAuthenticated.returns(false);
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
            expect(users.save.calledOnce).to.be.true;
            expect(
              users.save.calledWith({
                id: 30,
                firstName: 'Barney',
                lastName: 'Rubble',
                email: 'barney@rubble.kings.io'
              })
            ).to.be.true;
            done();
          });
      });

      it('calls the save if own user', done => {
        auth.verifyToken.returns({
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
            expect(users.save.calledOnce).to.be.true;
            expect(
              users.save.calledWith({
                id: 30,
                firstName: 'Barney',
                lastName: 'Rubble',
                email: 'barney@rubble.kings.io'
              })
            ).to.be.true;
            done();
          });
      });

      it('returns the saved data', done => {
        users.save.resolves({
          id: 30,
          firstName: 'Barney',
          lastName: 'Rubble',
          email: 'barney@rubble.kings.io'
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
            expect(users.save.calledOnce).to.be.true;
            expect(
              users.save.calledWith({
                id: 30,
                firstName: 'Barney',
                lastName: 'Rubble',
                email: 'barney@rubble.kings.io'
              })
            ).to.be.true;
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
        auth.verifyToken.returns({
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
        auth.isAuthenticated.returns(false);
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
            expect(users.save.calledOnce).to.be.true;
            expect(
              users.save.calledWith({
                firstName: 'Barney',
                lastName: 'Rubble',
                email: 'barney@rubble.kings.io'
              })
            ).to.be.true;
            done();
          });
      });

      it('returns the saved data', done => {
        users.save.resolves({
          id: 314159,
          firstName: 'Barney',
          lastName: 'Rubble',
          email: 'barney@rubble.kings.io'
        });
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
            expect(users.save.calledOnce).to.be.true;
            expect(
              users.save.calledWith({
                firstName: 'Barney',
                lastName: 'Rubble',
                email: 'barney@rubble.kings.io'
              })
            ).to.be.true;
            done();
          });
      });

      it('returns 403 if not admin', done => {
        auth.verifyToken.returns({
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
      sinon.stub(password, 'change');
    });

    afterEach(() => {
      password.change.restore();
    });

    it('requires an API login', done => {
      auth.isAuthenticated.returns(false);
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
          expect(password.change.calledOnce).to.be.true;
          expect(
            password.change.calledWith(
              '30',
              'IamNewPa$$worD',
              'iAmCurr3ntPassw0rd'
            )
          ).to.be.true;
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
      password.change.rejects(new Error('Invalid password'));
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
      password.change.rejects(new Error('The database went stupid on us'));
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
            expect(password.change.called).to.be.false;
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
            expect(password.change.called).to.be.false;
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
      auth.verifyToken.returns({
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
});
