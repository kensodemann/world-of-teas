'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('service: encryption', () => {
  let mockBuffer;
  let mockCrypto;
  let mockHmac;

  let Service;

  beforeEach(() => {
    mockBuffer = {};
    mockBuffer.toString = sinon.stub();

    mockHmac = sinon.stub({
      update: function() {},
      digest: function() {}
    });
    mockHmac.update.returns(mockHmac);

    mockCrypto = sinon.stub({
      randomBytes: function() {},
      createHmac: function() {}
    });
    mockCrypto.randomBytes.returns(mockBuffer);
    mockCrypto.createHmac.returns(mockHmac);

    Service = proxyquire('../../../server/services/encryption', {
      crypto: mockCrypto
    });
  });

  it('exists', () => {
    const service = new Service();
    expect(service).to.exist;
  });

  describe('salt', () => {
    it('gets 128 random bytes', () => {
      const service = new Service();
      service.salt();
      expect(mockCrypto.randomBytes.calledOnce).to.be.true;
      expect(mockCrypto.randomBytes.calledWith(128)).to.be.true;
    });

    it('converts the byte buffer to a string', () => {
      const service = new Service();
      service.salt();
      expect(mockBuffer.toString.calledOnce).to.be.true;
      expect(mockBuffer.toString.calledWith('base64')).to.be.true;
    });

    it('returns the salt string', () => {
      const service = new Service();
      mockBuffer.toString.returns('NaCl');
      expect(service.salt()).to.equal('NaCl');
    });
  });

  describe('hash', () => {
    it('creates a sha1 hmac', () => {
      const service = new Service();
      service.hash('NaCl', 'shhh secret');
      expect(mockCrypto.createHmac.calledOnce).to.be.true;
      expect(mockCrypto.createHmac.calledWith('sha1', 'NaCl')).to.be.true;
    });

    it('updates the hmac with the password', () => {
      const service = new Service();
      service.hash('NaCl', 'shhh secret');
      expect(mockHmac.update.calledOnce).to.be.true;
      expect(mockHmac.update.calledWith('shhh secret')).to.be.true;
    });

    it('returns a hex digest of the hmac', () => {
      mockHmac.digest.returns('8859AADEF095');
      const service = new Service();
      const hash = service.hash('NaCl', 'shhh secret');
      expect(mockHmac.digest.calledOnce).to.be.true;
      expect(mockHmac.digest.calledWith('hex')).to.be.true;
      expect(hash).to.equal('8859AADEF095');
    });
  });
});
