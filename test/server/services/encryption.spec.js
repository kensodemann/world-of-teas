'use strict';

const crypto = require('crypto');
const expect = require('chai').expect;
const service = require('../../../server/services/encryption');
const sinon = require('sinon');

describe('service: encryption', () => {
  let mockBuffer;
  let mockHmac;

  beforeEach(() => {
    mockBuffer = {};
    mockBuffer.toString = sinon.stub();

    mockHmac = sinon.stub({
      update: function() {},
      digest: function() {}
    });
    mockHmac.update.returns(mockHmac);

    sinon.stub(crypto, 'randomBytes').returns(mockBuffer);
    sinon.stub(crypto, 'createHmac').returns(mockHmac);
  });

  afterEach(() => {
    crypto.randomBytes.restore();
    crypto.createHmac.restore();
  });

  it('exists', () => {
    expect(service).to.exist;
  });

  describe('salt', () => {
    it('gets 128 random bytes', () => {
      service.salt();
      expect(crypto.randomBytes.calledOnce).to.be.true;
      expect(crypto.randomBytes.calledWith(128)).to.be.true;
    });

    it('converts the byte buffer to a string', () => {
      service.salt();
      expect(mockBuffer.toString.calledOnce).to.be.true;
      expect(mockBuffer.toString.calledWith('base64')).to.be.true;
    });

    it('returns the salt string', () => {
      mockBuffer.toString.returns('NaCl');
      expect(service.salt()).to.equal('NaCl');
    });
  });

  describe('hash', () => {
    it('creates a sha1 hmac', () => {
      service.hash('NaCl', 'shhh secret');
      expect(crypto.createHmac.calledOnce).to.be.true;
      expect(crypto.createHmac.calledWith('sha1', 'NaCl')).to.be.true;
    });

    it('updates the hmac with the password', () => {
      service.hash('NaCl', 'shhh secret');
      expect(mockHmac.update.calledOnce).to.be.true;
      expect(mockHmac.update.calledWith('shhh secret')).to.be.true;
    });

    it('returns a hex digest of the hmac', () => {
      mockHmac.digest.returns('8859AADEF095');
      const hash = service.hash('NaCl', 'shhh secret');
      expect(mockHmac.digest.calledOnce).to.be.true;
      expect(mockHmac.digest.calledWith('hex')).to.be.true;
      expect(hash).to.equal('8859AADEF095');
    });
  });
});
