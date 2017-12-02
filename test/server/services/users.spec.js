'use strict';

const expect = require('chai').expect;
const MockPool = require('../mocks/mock-pool');
const sinon = require('sinon');
const Servce = require('../../../server/services/users');

describe('service: users', function() {
  let pool;
  let service;
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
    service = new Servce(pool);
  });

  describe('getAll', function() {
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

    it('returns the data', async function() {
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
        pool.test_client.query.calledWith('select * from users where email = $1', [
          '42@1138.73'
        ])
      ).to.be.true;
    });

    it('returns the data', async function() {
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

    it('returns undefined if not found', async function() {
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
});
