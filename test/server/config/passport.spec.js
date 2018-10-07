'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const password = require('../../../server/services/password');
const users = require('../../../server/services/users');

class MockLocalStrategy {
  constructor(cb) {
    this.authenticate = cb;
  }
}

class MockPassport {
  use(s) {
    this.strategy = s;
  }

  serializeUser(cb) {
    this.serializer = cb;
  }
}

describe('config: passport', () => {
  let passport;

  beforeEach(() => {
    passport = new MockPassport();
    const config = proxyquire('../../../server/config/passport', {
      passport: passport,
      'passport-local': { Strategy: MockLocalStrategy }
    });
    sinon.stub(users, 'get').resolves();
    sinon.stub(password, 'matches').resolves(false);
    config();
  });

  afterEach(() => {
    users.get.restore();
    password.matches.restore();
  });

  describe('authentication', () => {
    it('gets the user', () => {
      passport.strategy.authenticate('kws@email.com', 'secretSauc3', () => {});
      expect(users.get.calledOnce).to.be.true;
      expect(users.get.calledWith('kws@email.com')).to.be.true;
    });

    describe('without a matching user', () => {
      it('does not check the password', () => {
        passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          () => {}
        );
        expect(password.matches.called).to.be.false;
      });

      it('calls the done callback with false', done => {
        passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          (err, value) => {
            expect(err).to.equal(null);
            expect(value).to.be.false;
            done();
          }
        );
      });
    });

    describe('with a matching user', () => {
      let returnedUser;
      beforeEach(() => {
        returnedUser = {
          id: 1138,
          firstName: 'Karl',
          lastName: 'Smith'
        };
        users.get.resolves({ ...returnedUser });
      });

      it('checks the password', async () => {
        await passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          () => {}
        );
        await users.get();
        expect(password.matches.calledOnce).to.be.true;
        expect(password.matches.calledWith(1138, 'secretSauc3')).to.be.true;
      });

      it('calls done with false if the password does not match', done => {
        password.matches.resolves(false);
        passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          (err, value) => {
            expect(err).to.equal(null);
            expect(value).to.be.false;
            done();
          }
        );
      });

      it('calls done with uesr if the password does match', done => {
        password.matches.resolves(true);
        passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          (err, value) => {
            expect(err).to.equal(null);
            expect(value).to.deep.equal(returnedUser);
            done();
          }
        );
      });
    });
  });

  it('sets up the serializer', () => {
    expect(passport.serializer).to.exist;
  });
});
