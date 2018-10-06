'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const MockClient = require('../mocks/mock-client');

const database = require('../../../server/config/database');
const encryption = require('../../../server/services/encryption');
const password = require('../../../server/services/password');

describe('service: password', () => {
  let client;
  beforeEach(() => {
    sinon.stub(encryption, 'hash');
    sinon.stub(encryption, 'salt');
    client = new MockClient();
    sinon.stub(database, 'connect');
    database.connect.returns(Promise.resolve(client));
  });

  afterEach(() => {
    encryption.hash.restore();
    encryption.salt.restore();
    database.connect.restore();
  });

  it('exists', () => {
    expect(password).to.exist;
  });

  describe('initialize', () => {
    beforeEach(() => {
      sinon.stub(client, 'query');
      client.query.returns(Promise.resolve({ rows: [] }));
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

    it('connects to the database', async () => {
      await password.initialize(42, 'shhhhhIam$ecret');
      expect(database.connect.calledOnce).to.be.true;
    });

    it('rejects if a password row exists for the user', async () => {
      client.query.returns(
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
      encryption.salt.returns('ABD349968NACL456');
      await password.initialize(42, 'IamPassw0rd');
      expect(encryption.salt.calledOnce).to.be.true;
      expect(encryption.hash.calledOnce).to.be.true;
      expect(encryption.hash.calledWith('ABD349968NACL456', 'IamPassw0rd')).to.be.true;
    });

    it('inserts the salted encrypted password', async () => {
      encryption.salt.returns('ABD349968NACL456');
      encryption.hash
        .withArgs('ABD349968NACL456', 'IamPassw0rd')
        .returns('19934009599234095');
      await password.initialize(42, 'IamPassw0rd');
      expect(client.query.calledTwice).to.be.true;
      expect(
        /insert into user_credentials.*user_rid, password, salt/.test(
          client.query.args[1][0]
        )
      ).to.be.true;
      expect(client.query.args[1][1]).to.deep.equal([
        42,
        '19934009599234095',
        'ABD349968NACL456'
      ]);
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await password.initialize(73, 'coop3r');
      expect(client.release.calledOnce).to.be.true;
    });
  });

  describe('change', () => {
    beforeEach(() => {
      sinon.stub(client, 'query');
      client.query.returns(
        Promise.resolve({
          rows: [{ id: 42, salt: '39949AAC43', password: 'ABBA1357CDDF' }]
        })
      );
      encryption.hash.withArgs('39949AAC43', 'IamPassw0rd').returns('ABBA1357CDDF');
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

    it('connects to the database', async () => {
      await password.change(42, 'shhhhhIam$ecret', 'IamPassw0rd');
      expect(database.connect.calledOnce).to.be.true;
    });

    it('throws an error if the current password is not valid', async () => {
      encryption.hash.withArgs('39949AAC43', 'IamPassw0rd').returns('188492985AB34');
      try {
        await password.change(73, 'newpassword', 'IamPassw0rd');
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Invalid password');
      }
    });

    it('salts and encrypts the password', async () => {
      encryption.salt.returns('3848859ADNACL456');
      await password.change(42, 'shhhhhIam$ecret', 'IamPassw0rd');
      expect(encryption.salt.calledOnce).to.be.true;
      expect(encryption.hash.calledTwice).to.be.true; // first time is current password check
      expect(encryption.hash.calledWith('3848859ADNACL456', 'shhhhhIam$ecret')).to.be
        .true;
    });

    it('updates to the salted encrypted password', async () => {
      encryption.salt.returns('3848859ADNACL456');
      encryption.hash
        .withArgs('3848859ADNACL456', 'shhhhhIam$ecret')
        .returns('AFED9948577FFED');
      await password.change(42, 'shhhhhIam$ecret', 'IamPassw0rd');
      expect(client.query.calledTwice).to.be.true;
      expect(
        /on conflict \(user_rid\) do update/.test(
          client.query.args[1][0]
        )
      ).to.be.true;
      expect(client.query.args[1][1]).to.deep.equal([
        42,
        'AFED9948577FFED',
        '3848859ADNACL456'
      ]);
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await password.change(73, 'coop3r', 'IamPassw0rd');
      expect(client.release.calledOnce).to.be.true;
    });
  });

  describe('reset', () => {
    const now = 1514035945341;
    let clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers(now);
      sinon.stub(client, 'query');
      client.query.returns(
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

    it('connects to the database', async () => {
      await password.reset(42, 'shhhhhIam$ecret', '39949AAC43');
      expect(database.connect.calledOnce).to.be.true;
    });

    it('throws an error if there is no token for the user', async () => {
      client.query.returns(Promise.resolve([]));
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
      encryption.salt.returns('3848859ADNACL456');
      clock.tick(188495);
      await password.reset(1138, 'IAmNewPassword', '39949AAC43');
      expect(encryption.salt.calledOnce).to.be.true;
      expect(encryption.hash.calledOnce).to.be.true;
      expect(encryption.hash.calledWith('3848859ADNACL456', 'IAmNewPassword')).to.be
        .true;
    });

    it('updates to the salted encrypted password', async () => {
      encryption.salt.returns('3848859ADNACL456');
      encryption.hash
        .withArgs('3848859ADNACL456', 'IAmNewPassword')
        .returns('AFED9948577FFED');
      await password.reset(1138, 'IAmNewPassword', '39949AAC43');
      expect(client.query.calledTwice).to.be.true;
      expect(
        /on conflict \(user_rid\) do update/.test(
          client.query.args[1][0]
        )
      ).to.be.true;
      expect(client.query.args[1][1]).to.deep.equal([
        1138,
        'AFED9948577FFED',
        '3848859ADNACL456'
      ]);
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await password.reset(73, 'coop3r', '39949AAC43');
      expect(client.release.calledOnce).to.be.true;
    });
  });

  describe('matches', () => {
    beforeEach(() => {
      encryption.hash.withArgs('39949AAC43', 'IamPassw0rd').returns('F00BA4');
    });

    it('connects to the database', () => {
      password.matches(42, 'shhhhhIam$ecret');
      expect(database.connect.calledOnce).to.be.true;
    });

    it('queries the user credentials', async () => {
      sinon.spy(client, 'query');
      await password.matches(42, 'IamPassw0rd');
      expect(client.query.calledOnce).to.be.true;
      expect(
        client.query.calledWith(
          'select * from user_credentials where user_rid = $1',
          [42]
        )
      ).to.be.true;
    });

    it('resolves false if the user has no credentials record', async () => {
      sinon.stub(client, 'query');
      client.query.returns(Promise.resolve({ rows: [] }));
      const match = await password.matches(42, 'IamPassw0rd');
      expect(match).to.be.false;
    });

    it('resolves false if the password hashes do not match', async () => {
      sinon.stub(client, 'query');
      client.query.returns(
        Promise.resolve({
          rows: [{ id: 42, salt: '39949AAC43', password: 'ABBA1357CDDF' }]
        })
      );
      const match = await password.matches(42, 'IamPassw0rd');
      expect(match).to.be.false;
    });

    it('resolves true if the password hashes do match', async () => {
      sinon.stub(client, 'query');
      client.query.returns(
        Promise.resolve({
          rows: [{ id: 42, salt: '39949AAC43', password: 'F00BA4' }]
        })
      );
      const match = await password.matches(42, 'IamPassw0rd');
      expect(match).to.be.true;
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await password.matches(73, 'coop3r');
      expect(client.release.calledOnce).to.be.true;
    });
  });
});
