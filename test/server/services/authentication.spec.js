'use strict';

const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const proxyquire = require('proxyquire');
const sessions = require('../../../server/services/sessions');
const sinon = require('sinon');

describe('service: authentication', () => {
  class MockRequest {
    logIn(u, cb) {
      this.user = u;
      this.callback = cb;
    }
  }
  let mockRequest;

  class MockResponse {
    send(opt) {}
    status(s) {}
    end() {}
  }
  let mockResponse;

  class MockPassport {
    constructor() {
      this.mockAuth = sinon.stub();
    }

    authenticate(t, cb) {
      this.type = t;
      this.callback = cb;
      return this.mockAuth;
    }
  }
  let mockPassport;
  let service;

  beforeEach(() => {
    mockRequest = new MockRequest();
    mockResponse = new MockResponse();
    mockPassport = new MockPassport();
    service = proxyquire('../../../server/services/authentication', {
      passport: mockPassport
    });
  });

  describe('authenticate', () => {
    it('calls passport authenticate', () => {
      sinon.spy(mockPassport, 'authenticate');
      service.authenticate();
      expect(mockPassport.authenticate.calledOnce).to.be.true;
      expect(mockPassport.type).to.equal('local');
      expect(mockPassport.callback).to.exist;
    });

    it('calls the generated auth function', () => {
      const next = sinon.stub();
      service.authenticate(mockRequest, mockResponse, next);
      expect(mockPassport.mockAuth.calledOnce).to.be.true;
      expect(
        mockPassport.mockAuth.calledWith(mockRequest, mockResponse, next)
      ).to.be.true;
    });

    describe('callback', () => {
      it('passes any error to next', () => {
        let param;
        service.authenticate(mockRequest, mockResponse, p => {
          param = p;
        });
        mockPassport.callback('I am an error', null);
        expect(param).to.equal('I am an error');
      });

      it('responds false if there is no user', () => {
        let param;
        sinon.spy(mockResponse, 'send');
        service.authenticate(mockRequest, mockResponse, p => {
          param = p;
        });
        mockPassport.callback(null, null);
        expect(param).to.be.undefined;
        expect(mockResponse.send.calledOnce).to.be.true;
        expect(mockResponse.send.calledWith({ success: false })).to.be.true;
      });

      it('sets up the login callback if there is a user', () => {
        sinon.spy(mockRequest, 'logIn');
        service.authenticate(mockRequest, mockResponse, p => {});
        mockPassport.callback(null, {
          id: 42,
          firstName: 'Jimmy',
          lastName: 'John'
        });
        expect(mockRequest.logIn.calledOnce).to.be.true;
        expect(mockRequest.user).to.deep.equal({
          id: 42,
          firstName: 'Jimmy',
          lastName: 'John'
        });
        expect(mockRequest.callback).to.exist;
      });

      describe('login callback', () => {
        it('passes any error on to next', () => {
          let param;
          service.authenticate(mockRequest, mockResponse, p => {
            param = p;
          });
          mockPassport.callback(null, {
            id: 42,
            firstName: 'Jimmy',
            lastName: 'John'
          });
          mockRequest.callback('I am a login error');
          expect(param).to.equal('I am a login error');
        });

        it('generates a token', () => {
          let param;
          process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificate';
          sinon.stub(jwt, 'sign');
          service.authenticate(mockRequest, mockResponse, p => {
            param = p;
          });
          mockPassport.callback(null, {
            id: 42,
            firstName: 'Jimmy',
            lastName: 'John'
          });
          mockRequest.callback();
          expect(param).to.be.undefined;
          expect(jwt.sign.calledOnce).to.be.true;
          expect(
            jwt.sign.calledWith(
              {
                id: 42,
                firstName: 'Jimmy',
                lastName: 'John'
              },
              process.env.JWT_PRIVATE_KEY,
              { expiresIn: '10d' }
            )
          ).to.be.true;
          jwt.sign.restore();
        });

        it('sends back the user and token', () => {
          let param;
          process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificate';
          sinon.spy(mockResponse, 'send');
          sinon.stub(jwt, 'sign');
          jwt.sign.returns('IAmAFakeToken');
          service.authenticate(mockRequest, mockResponse, p => {
            param = p;
          });
          mockPassport.callback(null, {
            id: 42,
            firstName: 'Jimmy',
            lastName: 'John'
          });
          mockRequest.callback();
          expect(param).to.be.undefined;
          expect(mockResponse.send.calledOnce).to.be.true;
          expect(
            mockResponse.send.calledWith({
              success: true,
              user: { id: 42, firstName: 'Jimmy', lastName: 'John' },
              token: 'IAmAFakeToken'
            })
          ).to.be.true;
          jwt.sign.restore();
        });
      });
    });
  });

  describe('deauthenticate', () => {
    let next;
    beforeEach(() => {
      next = sinon.stub();
      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(jwt, 'verify');
      sinon.stub(mockResponse, 'send');
      sinon.stub(sessions, 'end');
    });

    afterEach(() => {
      jwt.verify.restore();
      sessions.end.restore();
    });

    it('verifies the current token', () => {
      service.deauthenticate(mockRequest, mockResponse, next);
      expect(jwt.verify.calledOnce).to.be.true;
      expect(
        jwt.verify.calledWith(
          'thisisarandomtokenvalue',
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    describe('when logged in', () => {
      beforeEach(() => {
        jwt.verify.returns({
          id: 1138,
          firstName: 'Ted',
          lastName: 'Senspeck',
          sessionId: 314159
        });
      });

      it('ends the session', async () => {
        await service.deauthenticate(mockRequest, mockResponse, next);
        expect(sessions.end.calledOnce).to.be.true;
        expect(sessions.end.calledWith(314159)).to.be.true;
      });

      it('goes on to next', async () => {
        await service.deauthenticate(mockRequest, mockResponse, next);
        expect(next.calledOnce).to.be.true;
      });
    });

    describe('when not logged in', () => {
      it('does not end the session', async () => {
        await service.deauthenticate(mockRequest, mockResponse, next);
        expect(sessions.end.called).to.be.false;
      });

      it('goes on to next', async () => {
        await service.deauthenticate(mockRequest, mockResponse, next);
        expect(next.calledOnce).to.be.true;
      });
    });
  });

  describe('refresh', () => {
    beforeEach(() => {
      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(jwt, 'sign');
      sinon.stub(jwt, 'verify');
      sinon.stub(mockResponse, 'send');
      sinon.stub(sessions, 'verify').resolves(true);
    });

    afterEach(() => {
      jwt.sign.restore();
      jwt.verify.restore();
      sessions.verify.restore();
    });

    it('verifies the user', () => {
      service.refresh(mockRequest, mockResponse);
      expect(jwt.verify.calledOnce).to.be.true;
      expect(
        jwt.verify.calledWith(
          'thisisarandomtokenvalue',
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('sends a false response if the user verify fails', () => {
      jwt.verify.throws(new Error('bad token'));
      service.refresh(mockRequest, mockResponse);
      expect(mockResponse.send.calledOnce).to.be.true;
      expect(mockResponse.send.calledWith({ success: false })).to.be.true;
    });

    describe('with a valid user', () => {
      beforeEach(() => {
        jwt.verify.returns({
          id: 1138,
          firstName: 'Ted',
          lastName: 'Senspeck',
          iat: 'whatever',
          exp: 19930124509912485,
          sessionId: 420
        });
      });

      it('verifies the session', () => {
        service.refresh(mockRequest, mockResponse);
        expect(sessions.verify.calledOnce).to.be.true;
        expect(sessions.verify.calledWith(1138, 420)).to.be.true;
      });

      it('sends a false resposne if the session is not verified', async () => {
        sessions.verify.resolves(false);
        await service.refresh(mockRequest, mockResponse);
        expect(mockResponse.send.calledOnce).to.be.true;
        expect(mockResponse.send.calledWith({ success: false })).to.be.true;
      });

      it('generates a new token if the user and session are both verified', async () => {
        await service.refresh(mockRequest, mockResponse);
        expect(jwt.sign.calledOnce).to.be.true;
      });

      it('strips the iat and exp props from the user', async () => {
        await service.refresh(mockRequest, mockResponse);
        expect(jwt.sign.calledOnce).to.be.true;
        expect(
          jwt.sign.calledWith(
            {
              id: 1138,
              firstName: 'Ted',
              lastName: 'Senspeck',
              sessionId: 420
            },
            'IAmAFakeCertificateForRefresh'
          )
        ).to.be.true;
      });

      it('sends back the new token', async () => {
        jwt.sign.returns('IAmANewlyRefreshedFakeToken');
        await service.refresh(mockRequest, mockResponse);
        expect(mockResponse.send.calledOnce).to.be.true;
        expect(
          mockResponse.send.calledWith({
            success: true,
            user: {
              id: 1138,
              firstName: 'Ted',
              lastName: 'Senspeck',
              sessionId: 420
            },
            token: 'IAmANewlyRefreshedFakeToken'
          })
        ).to.be.true;
      });
    });
  });

  describe('isAuthenticated', () => {
    beforeEach(() => {
      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(jwt, 'verify').returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        roles: ['admin', 'user'],
        iat: 'whatever',
        exp: 19930124509912485,
        sessionId: 4885994
      });
      sinon.stub(sessions, 'verify');
    });

    afterEach(() => {
      jwt.verify.restore();
      sessions.verify.restore();
    });

    it('verifies the current token', () => {
      service.isAuthenticated(mockRequest);
      expect(jwt.verify.calledOnce).to.be.true;
      expect(
        jwt.verify.calledWith(
          'thisisarandomtokenvalue',
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    describe('with invalid token', () => {
      it('resolves false', async () => {
        jwt.verify.throws(new Error('bad wolf'));
        expect(await service.isAuthenticated(mockRequest)).to.be.false;
      });

      it('does not attempt to verify the session', async () => {
        jwt.verify.throws(new Error('bad wolf'));
        await service.isAuthenticated(mockRequest);
        expect(sessions.verify.called).to.be.false;
      });
    });

    describe('with valid token', () => {
      it('verifies the session', async () => {
        await service.isAuthenticated(mockRequest);
        expect(sessions.verify.calledOnce).to.be.true;
        expect(sessions.verify.calledWith(1138, 4885994)).to.be.true;
      });

      it('resolves false if the session is invalid', async () => {
        sessions.verify.resolves(false);
        expect(await service.isAuthenticated(mockRequest)).to.be.false;
      });

      it('resolves true if the session is valid', async () => {
        sessions.verify.resolves(true);
        expect(await service.isAuthenticated(mockRequest)).to.be.true;
      });
    });
  });

  describe('requireApiLogin', () => {
    let next;
    beforeEach(() => {
      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(jwt, 'verify');
      sinon.stub(sessions, 'verify');
      sinon.stub(mockResponse, 'send');
      sinon.stub(mockResponse, 'status');
      sinon.stub(mockResponse, 'end');
      next = sinon.stub();
    });

    afterEach(() => {
      jwt.verify.restore();
      sessions.verify.restore();
    });

    it('goes on to next if the user is logged in', async () => {
      jwt.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        roles: ['admin', 'user'],
        iat: 'whatever',
        exp: 19930124509912485,
        sessionId: 42
      });
      sessions.verify.resolves(true);
      await service.requireApiLogin(mockRequest, mockResponse, next);
      expect(next.calledOnce).to.be.true;
      expect(mockResponse.send.called).to.be.false;
      expect(mockResponse.status.called).to.be.false;
      expect(mockResponse.end.called).to.be.false;
    });

    it('sends a 401 if the token is not valid', async () => {
      jwt.verify.throws(new Error('bad wolf'));
      await service.requireApiLogin(mockRequest, mockResponse, next);
      expect(next.called).to.be.false;
      expect(mockResponse.status.calledOnce).to.be.true;
      expect(mockResponse.status.calledWith(401)).to.be.true;
      expect(mockResponse.end.calledOnce).to.be.true;
    });

    it('sends a 401 if the session is invalid', async () => {
      jwt.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        roles: ['admin', 'user'],
        iat: 'whatever',
        exp: 19930124509912485,
        sessionId: 42
      });
      sessions.verify.resolves(false);
      await service.requireApiLogin(mockRequest, mockResponse, next);
      expect(next.called).to.be.false;
      expect(mockResponse.status.calledOnce).to.be.true;
      expect(mockResponse.status.calledWith(401)).to.be.true;
      expect(mockResponse.end.calledOnce).to.be.true;
    });
  });

  describe('requireRole', () => {
    let next;
    beforeEach(() => {
      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(jwt, 'verify');
      jwt.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        roles: ['admin', 'user'],
        iat: 'whatever',
        exp: 19930124509912485
      });
      sinon.stub(mockResponse, 'send');
      sinon.stub(mockResponse, 'status');
      sinon.stub(mockResponse, 'end');
      next = sinon.stub();
    });

    afterEach(() => jwt.verify.restore());

    it('goes on to next if the user is in the specified role', () => {
      service.requireRole('admin')(mockRequest, mockResponse, next);
      expect(next.calledOnce).to.be.true;
      expect(mockResponse.send.called).to.be.false;
      expect(mockResponse.status.called).to.be.false;
      expect(mockResponse.end.called).to.be.false;
    });

    it('sends a 403 if the user is not in the specified role', () => {
      service.requireRole('bogus')(mockRequest, mockResponse, next);
      expect(next.called).to.be.false;
      expect(mockResponse.status.calledOnce).to.be.true;
      expect(mockResponse.status.calledWith(403)).to.be.true;
      expect(mockResponse.end.calledOnce).to.be.true;
    });
  });

  describe('requireRoleOrId', () => {
    let next;
    beforeEach(() => {
      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(jwt, 'verify');
      jwt.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        roles: ['admin', 'user'],
        iat: 'whatever',
        exp: 19930124509912485
      });
      sinon.stub(mockResponse, 'send');
      sinon.stub(mockResponse, 'status');
      sinon.stub(mockResponse, 'end');
      next = sinon.stub();
    });

    afterEach(() => jwt.verify.restore());

    it('goes on to next if the user is in the specified role', () => {
      mockRequest.params = {
        id: '4298'
      };
      service.requireRoleOrId('admin')(mockRequest, mockResponse, next);
      expect(next.calledOnce).to.be.true;
      expect(mockResponse.send.called).to.be.false;
      expect(mockResponse.status.called).to.be.false;
      expect(mockResponse.end.called).to.be.false;
    });

    it('goes on to next if the user id matches the specified id', () => {
      mockRequest.params = {
        id: '1138'
      };
      service.requireRoleOrId('bogus')(mockRequest, mockResponse, next);
      expect(next.calledOnce).to.be.true;
      expect(mockResponse.send.called).to.be.false;
      expect(mockResponse.status.called).to.be.false;
      expect(mockResponse.end.called).to.be.false;
    });

    it('sends a 403 if the ids do not match and the user is not in the specified role', () => {
      mockRequest.params = {
        id: '42'
      };
      service.requireRoleOrId('bogus')(mockRequest, mockResponse, next);
      expect(next.called).to.be.false;
      expect(mockResponse.status.calledOnce).to.be.true;
      expect(mockResponse.status.calledWith(403)).to.be.true;
      expect(mockResponse.end.calledOnce).to.be.true;
    });
  });
});
