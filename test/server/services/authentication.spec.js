'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('service: authentication', function() {
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
  }
  let mockResponse;

  beforeEach(function() {
    mockRequest = new MockRequest();
    mockResponse = new MockResponse();
    mockJWT = {};
  });

  describe('authenticate', function() {
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

    beforeEach(function() {
      mockPassport = new MockPassport();
      const Service = proxyquire('../../../server/services/authentication', {
        passport: mockPassport,
        jsonwebtoken: mockJWT
      });
      service = new Service();
    });

    it('calls passport authenticate', function() {
      sinon.spy(mockPassport, 'authenticate');
      service.authenticate();
      expect(mockPassport.authenticate.calledOnce).to.be.true;
      expect(mockPassport.type).to.equal('local');
      expect(mockPassport.callback).to.exist;
    });

    it('calls the generated auth function', function() {
      const mockNext = sinon.stub();
      service.authenticate(mockRequest, mockResponse, mockNext);
      expect(mockPassport.mockAuth.calledOnce).to.be.true;
      expect(
        mockPassport.mockAuth.calledWith(mockRequest, mockResponse, mockNext)
      ).to.be.true;
    });

    describe('callback', function() {
      it('passes any error to next', function() {
        let param;
        service.authenticate(mockRequest, mockResponse, p => {
          param = p;
        });
        mockPassport.callback('I am an error', null);
        expect(param).to.equal('I am an error');
      });

      it('responds false if there is no user', function() {
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

      it('sets up the login callback if there is a user', function() {
        sinon.spy(mockRequest, 'logIn');
        service.authenticate(mockRequest, mockResponse, p => {});
        mockPassport.callback(null, {
          id: 42,
          first_name: 'Jimmy',
          last_name: 'John'
        });
        expect(mockRequest.logIn.calledOnce).to.be.true;
        expect(mockRequest.user).to.deep.equal({
          id: 42,
          first_name: 'Jimmy',
          last_name: 'John'
        });
        expect(mockRequest.callback).to.exist;
      });

      describe('login callback', function() {
        it('passes any error on to next', function() {
          let param;
          service.authenticate(mockRequest, mockResponse, p => {
            param = p;
          });
          mockPassport.callback(null, {
            id: 42,
            first_name: 'Jimmy',
            last_name: 'John'
          });
          mockRequest.callback('I am a login error');
          expect(param).to.equal('I am a login error');
        });

        it('generates a token', function() {
          let param;
          process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificate';
          sinon.stub(mockJWT, 'sign');
          service.authenticate(mockRequest, mockResponse, p => {
            param = p;
          });
          mockPassport.callback(null, {
            id: 42,
            first_name: 'Jimmy',
            last_name: 'John'
          });
          mockRequest.callback();
          expect(param).to.be.undefined;
          expect(mockJWT.sign.calledOnce).to.be.true;
          expect(
            mockJWT.sign.calledWith(
              {
                id: 42,
                first_name: 'Jimmy',
                last_name: 'John'
              },
              process.env.JWT_PRIVATE_KEY,
              { expiresIn: '10d' }
            )
          ).to.be.true;
        });

        it('sends back the user and token', function() {
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
            first_name: 'Jimmy',
            last_name: 'John'
          });
          mockRequest.callback();
          expect(param).to.be.undefined;
          expect(mockResponse.send.calledOnce).to.be.true;
          expect(
            mockResponse.send.calledWith({
              success: true,
              user: { id: 42, first_name: 'Jimmy', last_name: 'John' },
              token: 'IAmAFakeToken'
            })
          ).to.be.true;
        });
      });
    });
  });

  describe('refresh', function() {
    let service;
    beforeEach(function() {
      const Service = proxyquire('../../../server/services/authentication', {
        jsonwebtoken: mockJWT
      });
      service = new Service();

      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(mockJWT, 'sign');
      sinon.stub(mockJWT, 'verify');
      sinon.stub(mockResponse, 'send');
    });

    it('verifies the current token', function() {
      service.refresh(mockRequest, mockResponse);
      expect(mockJWT.verify.calledOnce).to.be.true;
      expect(
        mockJWT.verify.calledWith(
          'thisisarandomtokenvalue',
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('sends a false response if the verify fails', function() {
      mockJWT.verify.throws(new Error('bad token'));
      service.refresh(mockRequest, mockResponse);
      expect(mockResponse.send.calledOnce).to.be.true;
      expect(mockResponse.send.calledWith({ success: false })).to.be.true;
    });

    it('generates a new toekn if the verify succeeds', function() {
      mockJWT.verify.returns({
        id: 1138,
        first_name: 'Ted',
        last_name: 'Senspeck'
      });
      service.refresh(mockRequest, mockResponse);
      expect(mockJWT.sign.calledOnce).to.be.true;
      expect(
        mockJWT.sign.calledWith(
          {
            id: 1138,
            first_name: 'Ted',
            last_name: 'Senspeck'
          },
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('strips the iat and exp props from the user', function() {
      mockJWT.verify.returns({
        id: 1138,
        first_name: 'Ted',
        last_name: 'Senspeck',
        iat: 'whatever',
        exp: 19930124509912485
      });
      service.refresh(mockRequest, mockResponse);
      expect(mockJWT.sign.calledOnce).to.be.true;
      expect(
        mockJWT.sign.calledWith(
          {
            id: 1138,
            first_name: 'Ted',
            last_name: 'Senspeck'
          },
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('sends back the new token', function() {
      mockJWT.verify.returns({
        id: 1138,
        first_name: 'Ted',
        last_name: 'Senspeck',
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
            first_name: 'Ted',
            last_name: 'Senspeck'
          },
          token: 'IAmANewlyRefreshedFakeToken'
        })
      ).to.be.true;
    });
  });

  describe('isAuthenticated', function() {
    let service;
    beforeEach(function() {
      const Service = proxyquire('../../../server/services/authentication', {
        jsonwebtoken: mockJWT
      });
      service = new Service();

      mockRequest.headers = {
        authorization: 'bearer thisisarandomtokenvalue'
      };
      process.env.JWT_PRIVATE_KEY = 'IAmAFakeCertificateForRefresh';
      sinon.stub(mockJWT, 'sign');
      sinon.stub(mockJWT, 'verify');
    });

    it('verifies the current token', function() {
      service.isAuthenticated(mockRequest);
      expect(mockJWT.verify.calledOnce).to.be.true;
      expect(
        mockJWT.verify.calledWith(
          'thisisarandomtokenvalue',
          'IAmAFakeCertificateForRefresh'
        )
      ).to.be.true;
    });

    it('returns false if the current token is not valid', function() {
      mockJWT.verify.throws(new Error('bad wolf'));
      expect(service.isAuthenticated(mockRequest)).to.be.false;
    });

    it('returns true if the current token is not valid', function() {
      mockJWT.verify.returns({
        id: 1138,
        first_name: 'Ted',
        last_name: 'Senspeck',
        iat: 'whatever',
        exp: 19930124509912485
      });
      expect(service.isAuthenticated(mockRequest)).to.be.true;
    });
  });
});
