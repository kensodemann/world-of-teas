'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const MockPool = require('../mocks/mock-pool');

let Password;

let mockHash = sinon.stub();
let mockSalt = sinon.stub();

class MockEncryption {
  constructor() {
    this.salt = mockSalt;
    this.hash = mockHash;
  }
}

describe('service: password', () => {
  let password;
  let pool;
  beforeEach(() => {
    mockHash.reset();
    mockSalt.reset();
    pool = new MockPool();
    Password = proxyquire('../../../server/services/password', {
      './encryption': MockEncryption
    });
    password = new Password(pool);
  });

  it('exists', () => {
    expect(password).to.exist;
  });

  describe('initialize', () => {
    beforeEach(() => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: [] }));
    });

    it('rejects if no user ID is given', async () => {
      try {
        await password.initialize(undefined, 'ThisIsAPassword');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Missing Parameter: id');
      }
    });

    it('rejects if no new password is given', async () => {
      try {
        await password.initialize(1138);
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Missing Parameter: password');
      }
    });

    it('connects to the pool', async () => {
      sinon.spy(pool, 'connect');
      await password.initialize(42, 'shhhhhIam$ecret');
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('rejects if a password row exists for the user', async () => {
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [
            {
              user_rid: 42,
              password: '1994003959384',
              salt: 'ABC188939475FED'
            }
          ]
        })
      );
      try {
        await password.initialize(42, 'IamPassw0rd');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Password already initialized');
      }
    });

    it('salts and encrypts the password', async () => {
      mockSalt.returns('ABD349968NACL456');
      await password.initialize(42, 'IamPassw0rd');
      expect(mockSalt.calledOnce).to.be.true;
      expect(mockHash.calledOnce).to.be.true;
      expect(mockHash.calledWith('ABD349968NACL456', 'IamPassw0rd')).to.be.true;
    });

    it('inserts the salted encrypted password', async () => {
      mockSalt.returns('ABD349968NACL456');
      mockHash
        .withArgs('ABD349968NACL456', 'IamPassw0rd')
        .returns('19934009599234095');
      await password.initialize(42, 'IamPassw0rd');
      expect(pool.test_client.query.calledTwice).to.be.true;
      expect(
        /insert into user_credentials.*user_rid, password, salt/.test(
          pool.test_client.query.args[1][0]
        )
      ).to.be.true;
      expect(pool.test_client.query.args[1][1]).to.deep.equal([
        42,
        '19934009599234095',
        'ABD349968NACL456'
      ]);
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await password.initialize(73, 'coop3r');
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('change', () => {
    beforeEach(() => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [{ id: 42, salt: '39949AAC43', password: 'ABBA1357CDDF' }]
        })
      );
      mockHash.withArgs('39949AAC43', 'IamPassw0rd').returns('ABBA1357CDDF');
    });

    it('thows an error if no user ID is given', async () => {
      try {
        await password.change(undefined, 'ThisIsAPassword', 'oldPa$$w0rD');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Missing Parameter: id');
      }
    });

    it('throws an error if no new password is given', async () => {
      try {
        await password.change(73, undefined, 'oldPa$$w0rD');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Missing Parameter: password');
      }
    });

    it('connects to the pool', async () => {
      sinon.spy(pool, 'connect');
      await password.change(42, 'shhhhhIam$ecret', 'IamPassw0rd');
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('throws an error if the current password is not valid', async () => {
      mockHash.withArgs('39949AAC43', 'IamPassw0rd').returns('188492985AB34');
      try {
        await password.change(73, 'newpassword', 'IamPassw0rd');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Invalid password');
      }
    });

    it('salts and encrypts the password', async () => {
      mockSalt.returns('3848859ADNACL456');
      await password.change(42, 'shhhhhIam$ecret', 'IamPassw0rd');
      expect(mockSalt.calledOnce).to.be.true;
      expect(mockHash.calledTwice).to.be.true; // first time is current password check
      expect(mockHash.calledWith('3848859ADNACL456', 'shhhhhIam$ecret')).to.be
        .true;
    });

    it('updates to the salted encrypted password', async () => {
      mockSalt.returns('3848859ADNACL456');
      mockHash
        .withArgs('3848859ADNACL456', 'shhhhhIam$ecret')
        .returns('AFED9948577FFED');
      await password.change(42, 'shhhhhIam$ecret', 'IamPassw0rd');
      expect(pool.test_client.query.calledTwice).to.be.true;
      expect(
        /on conflict \(user_rid\) do update/.test(
          pool.test_client.query.args[1][0]
        )
      ).to.be.true;
      expect(pool.test_client.query.args[1][1]).to.deep.equal([
        42,
        'AFED9948577FFED',
        '3848859ADNACL456'
      ]);
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await password.change(73, 'coop3r', 'IamPassw0rd');
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('reset', () => {
    const now = 1514035945341;
    let clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers(now);
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [{ user_rid: 1138, token: '39949AAC43', timestamp: now }]
        })
      );
    });

    afterEach(() => {
      clock.restore();
    });

    it('thows an error if no user ID is given', async () => {
      try {
        await password.reset(undefined, 'ThisIsAPassword', 'IAmToken');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Missing Parameter: id');
      }
    });

    it('throws an error if no new password is given', async () => {
      try {
        await password.reset(1138, undefined, 'IAmToken');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Missing Parameter: password');
      }
    });

    it('connects to the pool', async () => {
      sinon.spy(pool, 'connect');
      await password.reset(42, 'shhhhhIam$ecret', '39949AAC43');
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('throws an error if there is no token for the user', async () => {
      pool.test_client.query.returns(Promise.resolve([]));
      clock.tick(113945);
      try {
        await password.reset(1138, 'IAmNewPassword', 'IAmToken');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Invalid password reset token');
      }
    });

    it('throws an error if the token is not valid', async () => {
      clock.tick(113945);
      try {
        await password.reset(1138, 'IAmNewPassword', 'IAmToken');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Invalid password reset token');
      }
    });

    it('throws an error if the token is expired', async () => {
      clock.tick(1800000);
      await password.reset(1138, 'IAmNewPassword', '39949AAC43');
      try {
        clock.tick(1);
        await password.reset(1138, 'IAmNewPassword', '39949AAC43');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Expired password reset token');
      }
    });

    it('salts and encrypts the password', async () => {
      mockSalt.returns('3848859ADNACL456');
      clock.tick(188495);
      await password.reset(1138, 'IAmNewPassword', '39949AAC43');
      expect(mockSalt.calledOnce).to.be.true;
      expect(mockHash.calledOnce).to.be.true;
      expect(mockHash.calledWith('3848859ADNACL456', 'IAmNewPassword')).to.be
        .true;
    });

    it('updates to the salted encrypted password', async () => {
      mockSalt.returns('3848859ADNACL456');
      mockHash
        .withArgs('3848859ADNACL456', 'IAmNewPassword')
        .returns('AFED9948577FFED');
      await password.reset(1138, 'IAmNewPassword', '39949AAC43');
      expect(pool.test_client.query.calledTwice).to.be.true;
      expect(
        /on conflict \(user_rid\) do update/.test(
          pool.test_client.query.args[1][0]
        )
      ).to.be.true;
      expect(pool.test_client.query.args[1][1]).to.deep.equal([
        1138,
        'AFED9948577FFED',
        '3848859ADNACL456'
      ]);
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await password.reset(73, 'coop3r', '39949AAC43');
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('matches', () => {
    beforeEach(() => {
      mockHash.withArgs('39949AAC43', 'IamPassw0rd').returns('F00BA4');
    });

    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      password.matches(42, 'shhhhhIam$ecret');
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the user credentials', async () => {
      sinon.spy(pool.test_client, 'query');
      await password.matches(42, 'IamPassw0rd');
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(
        pool.test_client.query.calledWith(
          'select * from user_credentials where user_rid = $1',
          [42]
        )
      ).to.be.true;
    });

    it('resolves false if the user has no credentials record', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: [] }));
      const match = await password.matches(42, 'IamPassw0rd');
      expect(match).to.be.false;
    });

    it('resolves false if the password hashes do not match', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [{ id: 42, salt: '39949AAC43', password: 'ABBA1357CDDF' }]
        })
      );
      const match = await password.matches(42, 'IamPassw0rd');
      expect(match).to.be.false;
    });

    it('resolves true if the password hashes do match', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [{ id: 42, salt: '39949AAC43', password: 'F00BA4' }]
        })
      );
      const match = await password.matches(42, 'IamPassw0rd');
      expect(match).to.be.true;
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await password.matches(73, 'coop3r');
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });
});
