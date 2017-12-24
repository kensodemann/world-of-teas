'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const MockPool = require('../mocks/mock-pool');

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

let passwordMatches = false;
let matchesCalls;
let matchesId;
let matchesPassword;
class MockPassword {
  matches(id, password) {
    matchesCalls++;
    matchesId = id;
    matchesPassword = password;
    return Promise.resolve(passwordMatches);
  }
}

let returnedUser;
let getCalls;
let getCallArgs;
class MockUsers {
  get(u) {
    getCalls++;
    getCallArgs = u;
    return Promise.resolve(returnedUser);
  }
}

describe('config: passport', () => {
  let passport;

  beforeEach(() => {
    const pool = new MockPool();
    passport = new MockPassport();
    getCalls = 0;
    getCallArgs = undefined;
    matchesCalls = 0;
    const config = proxyquire('../../../server/config/passport', {
      passport: passport,
      'passport-local': { Strategy: MockLocalStrategy },
      '../services/password': MockPassword,
      '../services/users': MockUsers
    });
    config(pool);
  });

  describe('authentication', () => {
    it('gets the user', () => {
      passport.strategy.authenticate('kws@email.com', 'secretSauc3', () => {});
      expect(getCalls).to.equal(1);
      expect(getCallArgs).to.equal('kws@email.com');
    });

    describe('without a matching user', () => {
      it('does not check the password', () => {
        passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          () => {}
        );
        expect(matchesCalls).to.equal(0);
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
      beforeEach(() => {
        returnedUser = {
          id: 1138,
          firstName: 'Karl',
          lastName: 'Smith'
        };
      });

      it('checks the password', async () => {
        await passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          () => {}
        );
        expect(matchesCalls).to.equal(1);
        expect(matchesId).to.equal(1138);
        expect(matchesPassword).to.equal('secretSauc3');
      });

      it('calls done with false if the password does not match', done => {
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
        passwordMatches = true;
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
