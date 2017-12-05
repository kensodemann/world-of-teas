'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

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

describe('config: passport', function() {
  let passport;
  let users;

  beforeEach(function() {
    passport = new MockPassport();
    users = {
      get: sinon.stub(),
      passwordMatches: sinon.stub()
    };
    users.get.returns(Promise.resolve(undefined));
    users.passwordMatches.returns(Promise.resolve(false));
    const config = proxyquire('../../../server/config/passport', {
      passport: passport,
      'passport-local': { Strategy: MockLocalStrategy },
      '../services/users': users
    });
    config();
  });

  describe('authentication', function() {
    it('gets the user', function() {
      passport.strategy.authenticate(
        'kws@email.com',
        'secretSauc3',
        function() {}
      );
      expect(users.get.calledOnce).to.be.true;
      expect(users.get.calledWith('kws@email.com')).to.be.true;
    });

    describe('without a matching user', function() {
      it('does not check the password', function() {
        passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          function() {}
        );
        expect(users.passwordMatches.called).to.be.false;
      });

      it('calls the done callback with false', function(done) {
        passport.strategy.authenticate('kws@email.com', 'secretSauc3', function(
          err,
          value
        ) {
          expect(err).to.equal(null);
          expect(value).to.be.false;
          done();
        });
      });
    });

    describe('with a matching user', function() {
      let user;
      beforeEach(function() {
        user = {
          id: 1138,
          first_name: 'Karl',
          last_name: 'Smith'
        };
        users.get.returns(Promise.resolve(user));
      });

      it('checks the password', async function() {
        await passport.strategy.authenticate(
          'kws@email.com',
          'secretSauc3',
          function() {}
        );
        expect(users.passwordMatches.calledOnce).to.be.true;
        expect(users.passwordMatches.calledWith(1138, 'secretSauc3')).to.be
          .true;
      });

      it('calls done with false if the password does not match', function(
        done
      ) {
        passport.strategy.authenticate('kws@email.com', 'secretSauc3', function(
          err,
          value
        ) {
          expect(err).to.equal(null);
          expect(value).to.be.false;
          done();
        });
      });

      it('calls done with uesr if the password does match', function(
        done
      ) {
        users.passwordMatches.returns(Promise.resolve(true));
        passport.strategy.authenticate('kws@email.com', 'secretSauc3', function(
          err,
          value
        ) {
          expect(err).to.equal(null);
          expect(value).to.deep.equal(user);
          done();
        });
      });
    });
  });

  it('sets up the serializer', function() {
    expect(passport.serializer).to.exist;
  });
});
