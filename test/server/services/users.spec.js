'use strict';

const expect = require('chai').expect;
const MockPool = require('../mocks/mock-pool');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Servce = require('../../../server/services/users');

describe('service: users', function() {
  let pool;
  let testData;

  beforeEach(function() {
    pool = new MockPool();
    testData = [
      {
        id: 1,
        first_name: 'Kenneth',
        last_name: 'Sodemann',
        email: 'not.my.real.email@gmail.com'
      },
      {
        id: 2,
        first_name: 'Lisa',
        last_name: 'Buerger',
        email: 'another.fake.email@aol.com'
      }
    ];
  });

  describe('getAll', function() {
    let service;

    beforeEach(function() {
      service = new Servce(pool);
    });

    it('connects to the pool', function() {
      sinon.spy(pool, 'connect');
      service.getAll();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the users', async function() {
      sinon.spy(pool.test_client, 'query');
      await service.getAll();
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(pool.test_client.query.calledWith('select * from users')).to.be
        .true;
    });

    it('resolves the data', async function() {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: testData }));
      const data = await service.getAll();
      expect(data).to.deep.equal(testData);
    });

    it('releases the client', async function() {
      sinon.spy(pool.test_client, 'release');
      await service.getAll();
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('get', function() {
    let service;

    beforeEach(function() {
      service = new Servce(pool);
    });

    it('connects to the pool', function() {
      sinon.spy(pool, 'connect');
      service.get(42);
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the users for the user with the given ID', async function() {
      sinon.spy(pool.test_client, 'query');
      await service.get(42);
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(
        pool.test_client.query.calledWith('select * from users where id = $1', [
          42
        ])
      ).to.be.true;
    });

    it('queries the users for the user with the given ID string', async function() {
      sinon.spy(pool.test_client, 'query');
      await service.get('42');
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(
        pool.test_client.query.calledWith('select * from users where id = $1', [
          '42'
        ])
      ).to.be.true;
    });

    it('queries the users by email if the passed id has an "@" sign', async function() {
      sinon.spy(pool.test_client, 'query');
      await service.get('42@1138.73');
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(
        pool.test_client.query.calledWith(
          'select * from users where upper(email) = upper($1)',
          ['42@1138.73']
        )
      ).to.be.true;
    });

    it('resolves the data', async function() {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [
            {
              id: 42,
              first_name: 'Ford',
              last_name: 'Prefect',
              email: 'universe.traveler@compuserve.net'
            }
          ]
        })
      );
      const data = await service.get(42);
      expect(data).to.deep.equal({
        id: 42,
        first_name: 'Ford',
        last_name: 'Prefect',
        email: 'universe.traveler@compuserve.net'
      });
    });

    it('resolves undefined if not found', async function() {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: [] }));
      const data = await service.get(42);
      expect(data).to.be.undefined;
    });

    it('releases the client', async function() {
      sinon.spy(pool.test_client, 'release');
      await service.get(42);
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('password is valid', function() {
    let service;

    beforeEach(function() {
      const mockEncryption = {
        hash: sinon.stub()
      };
      mockEncryption.hash
        .withArgs('39949AAC43', 'IamPassw0rd')
        .returns('F00BA4');
      const ProxiedService = proxyquire('../../../server/services/users', {
        './encryption': mockEncryption
      });
      service = new ProxiedService(pool);
    });

    it('connects to the pool', function() {
      sinon.spy(pool, 'connect');
      service.passwordMatches(42, 'shhhhhIam$ecret');
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the user credentials', async function() {
      sinon.spy(pool.test_client, 'query');
      await service.passwordMatches(42, 'IamPassw0rd');
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(
        pool.test_client.query.calledWith(
          'select * from user_credentials where id = $1',
          [42]
        )
      ).to.be.true;
    });

    it('resolves false if the user has no credentials record', async function() {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: [] }));
      const match = await service.passwordMatches(42, 'IamPassw0rd');
      expect(match).to.be.false;
    });

    it('resolves false if the password hashes do not match', async function() {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [{ id: 42, salt: '39949AAC43', password: 'ABBA1357CDDF' }]
        })
      );
      const match = await service.passwordMatches(42, 'IamPassw0rd');
      expect(match).to.be.false;
    });

    it('resolves true if the password hashes do match', async function() {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [{ id: 42, salt: '39949AAC43', password: 'F00BA4' }]
        })
      );
      const match = await service.passwordMatches(42, 'IamPassw0rd');
      expect(match).to.be.true;
    });

    it('releases the client', async function() {
      sinon.spy(pool.test_client, 'release');
      await service.passwordMatches(73, 'coop3r');
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });
});
