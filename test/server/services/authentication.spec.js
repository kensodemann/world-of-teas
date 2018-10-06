'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('service: authentication', () => {
  let mockJWT;

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

  beforeEach(() => {
    mockRequest = new MockRequest();
    mockResponse = new MockResponse();
    mockJWT = {};
  });

  describe('authenticate', () => {
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
      mockPassport = new MockPassport();
      service = proxyquire('../../../server/services/authentication', {
        passport: mockPassport,
        jsonwebtoken: mockJWT
      });
    });

    it('calls passport authenticate', () => {
      sinon.spy(mockPassport, 'authenticate');
      service.authenticate();
      expect(mockPassport.authenticate.calledOnce).to.be.true;
      expect(mockPassport.type).to.equal('local');
      expect(mockPassport.callback).to.exist;
    });

    it('calls the generated auth function', () => {
      const mockNext = sinon.stub();
      service.authenticate(mockRequest, mockResponse, mockNext);
      expect(mockPassport.mockAuth.calledOnce).to.be.true;
      expect(
        mockPassport.mockAuth.calledWith(mockRequest, mockResponse, mockNext)
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
          sinon.stub(mockJWT, 'sign');
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
          expect(mockJWT.sign.calledOnce).to.be.true;
          expect(
            mockJWT.sign.calledWith(
              {
                id: 42,
                firstName: 'Jimmy',
                lastName: 'John'
              },
              process.env.JWT_PRIVATE_KEY,
              { expiresIn: '10d' }
            )
          ).to.be.true;
        });

        it('sends back the user and token', () => {
          let param;
          process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificate';
          sinon.spy(mockResponse, 'send');
          sinon.stub(mockJWT, 'sign');
          mockJWT.sign.returns('IAmAFakeToken');
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
        });
      });
    });
  });

  describe('refresh', () => {
    let service;
    beforeEach(() => {
      service = proxyquire('../../../server/services/authentication', {
        jsonwebtoken: mockJWT
      });

      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(mockJWT, 'sign');
      sinon.stub(mockJWT, 'verify');
      sinon.stub(mockResponse, 'send');
    });

    it('verifies the current token', () => {
      service.refresh(mockRequest, mockResponse);
      expect(mockJWT.verify.calledOnce).to.be.true;
      expect(
        mockJWT.verify.calledWith(
          'thisisarandomtokenvalue',
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('sends a false response if the verify fails', () => {
      mockJWT.verify.throws(new Error('bad token'));
      service.refresh(mockRequest, mockResponse);
      expect(mockResponse.send.calledOnce).to.be.true;
      expect(mockResponse.send.calledWith({ success: false })).to.be.true;
    });

    it('generates a new toekn if the verify succeeds', () => {
      mockJWT.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck'
      });
      service.refresh(mockRequest, mockResponse);
      expect(mockJWT.sign.calledOnce).to.be.true;
      expect(
        mockJWT.sign.calledWith(
          {
            id: 1138,
            firstName: 'Ted',
            lastName: 'Senspeck'
          },
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('strips the iat and exp props from the user', () => {
      mockJWT.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        iat: 'whatever',
        exp: 19930124509912485
      });
      service.refresh(mockRequest, mockResponse);
      expect(mockJWT.sign.calledOnce).to.be.true;
      expect(
        mockJWT.sign.calledWith(
          {
            id: 1138,
            firstName: 'Ted',
            lastName: 'Senspeck'
          },
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('sends back the new token', () => {
      mockJWT.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        iat: 'whatever',
        exp: 19930124509912485
      });
      mockJWT.sign.returns('IAmANewlyRefreshedFakeToken');
      service.refresh(mockRequest, mockResponse);
      expect(mockResponse.send.calledOnce).to.be.true;
      expect(
        mockResponse.send.calledWith({
          success: true,
          user: {
            id: 1138,
            firstName: 'Ted',
            lastName: 'Senspeck'
          },
          token: 'IAmANewlyRefreshedFakeToken'
        })
      ).to.be.true;
    });
  });

  describe('isAuthenticated', () => {
    let service;
    beforeEach(() => {
      service = proxyquire('../../../server/services/authentication', {
        jsonwebtoken: mockJWT
      });

      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(mockJWT, 'sign');
      sinon.stub(mockJWT, 'verify');
    });

    it('verifies the current token', () => {
      service.isAuthenticated(mockRequest);
      expect(mockJWT.verify.calledOnce).to.be.true;
      expect(
        mockJWT.verify.calledWith(
          'thisisarandomtokenvalue',
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('returns false if the current token is not valid', () => {
      mockJWT.verify.throws(new Error('bad wolf'));
      expect(service.isAuthenticated(mockRequest)).to.be.false;
    });

    it('returns true if the current token is not valid', () => {
      mockJWT.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        roles: ['admin', 'user'],
        iat: 'whatever',
        exp: 19930124509912485
      });
      expect(service.isAuthenticated(mockRequest)).to.be.true;
    });
  });

  describe('requireApiLogin', () => {
    let service;
    let mockNext;
    beforeEach(() => {
      service = proxyquire('../../../server/services/authentication', {
        jsonwebtoken: mockJWT
      });

      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(mockJWT, 'verify');
      sinon.stub(mockResponse, 'send');
      sinon.stub(mockResponse, 'status');
      sinon.stub(mockResponse, 'end');
      mockNext = sinon.stub();
    });

    it('goes on to next if the user is logged in', () => {
      mockJWT.verify.returns({
        id: 1138,
        firstName: 'Ted',
        lastName: 'Senspeck',
        roles: ['admin', 'user'],
        iat: 'whatever',
        exp: 19930124509912485
      });
      service.requireApiLogin(mockRequest, mockResponse, mockNext);
      expect(mockNext.calledOnce).to.be.true;
      expect(mockResponse.send.called).to.be.false;
      expect(mockResponse.status.called).to.be.false;
      expect(mockResponse.end.called).to.be.false;
    });

    it('sends a 401 if the user is not logged in', () => {
      mockJWT.verify.throws(new Error('bad wolf'));
      service.requireApiLogin(mockRequest, mockResponse, mockNext);
      expect(mockNext.called).to.be.false;
      expect(mockResponse.status.calledOnce).to.be.true;
      expect(mockResponse.status.calledWith(401)).to.be.true;
      expect(mockResponse.end.calledOnce).to.be.true;
    });
  });

  describe('requireRole', () => {
    let service;
    let mockNext;
    beforeEach(() => {
      service = proxyquire('../../../server/services/authentication', {
        jsonwebtoken: mockJWT
      });

      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(mockJWT, 'verify');
      mockJWT.verify.returns({
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
      mockNext = sinon.stub();
    });

    it('goes on to next if the user is in the specified role', () => {
      service.requireRole('admin')(mockRequest, mockResponse, mockNext);
      expect(mockNext.calledOnce).to.be.true;
      expect(mockResponse.send.called).to.be.false;
      expect(mockResponse.status.called).to.be.false;
      expect(mockResponse.end.called).to.be.false;
    });

    it('sends a 403 if the user is not in the specified role', () => {
      service.requireRole('bogus')(mockRequest, mockResponse, mockNext);
      expect(mockNext.called).to.be.false;
      expect(mockResponse.status.calledOnce).to.be.true;
      expect(mockResponse.status.calledWith(403)).to.be.true;
      expect(mockResponse.end.calledOnce).to.be.true;
    });
  });

  describe('requireRoleOrId', () => {
    let service;
    let mockNext;
    beforeEach(() => {
      service = proxyquire('../../../server/services/authentication', {
        jsonwebtoken: mockJWT
      });

      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(mockJWT, 'verify');
      mockJWT.verify.returns({
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
      mockNext = sinon.stub();
    });

    it('goes on to next if the user is in the specified role', () => {
      mockRequest.params = {
        id: '4298'
      };
      service.requireRoleOrId('admin')(mockRequest, mockResponse, mockNext);
      expect(mockNext.calledOnce).to.be.true;
      expect(mockResponse.send.called).to.be.false;
      expect(mockResponse.status.called).to.be.false;
      expect(mockResponse.end.called).to.be.false;
    });

    it('goes on to next if the user id matches the specified id', () => {
      mockRequest.params = {
        id: '1138'
      };
      service.requireRoleOrId('bogus')(mockRequest, mockResponse, mockNext);
      expect(mockNext.calledOnce).to.be.true;
      expect(mockResponse.send.called).to.be.false;
      expect(mockResponse.status.called).to.be.false;
      expect(mockResponse.end.called).to.be.false;
    });

    it('sends a 403 if the ids do not match and the user is not in the specified role', () => {
      mockRequest.params = {
        id: '42'
      };
      service.requireRoleOrId('bogus')(mockRequest, mockResponse, mockNext);
      expect(mockNext.called).to.be.false;
      expect(mockResponse.status.calledOnce).to.be.true;
      expect(mockResponse.status.calledWith(403)).to.be.true;
      expect(mockResponse.end.calledOnce).to.be.true;
    });
  });
});
