'use strict';

const expect = require('chai').expect;
const MockPool = require('../mocks/mock-pool');
const sinon = require('sinon');
const Service = require('../../../server/services/tea-categories');

describe('service: tea-categories', () => {
  let pool;
  let service;
  let testData;

  beforeEach(() => {
    pool = new MockPool();
    testData = [
      {
        id: 1,
        name: 'Green',
        description: 'Non - oxidized, mild tea'
      },
      {
        id: 2,
        name: 'Black',
        description: 'Oxidized tea'
      },
      {
        id: 3,
        name: 'Herbal',
        description: 'Not a tea'
      }
    ];
    service = new Service(pool);
  });

  describe('getAll', () => {
    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.getAll();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the tea categories', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.getAll();
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(pool.test_client.query.calledWith('select * from tea_categories'))
        .to.be.true;
    });

    it('returns the data', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: testData }));
      const data = await service.getAll();
      expect(data).to.deep.equal(testData);
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.getAll();
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });
});
