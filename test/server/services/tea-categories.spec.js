'use strict';

const database = require('../../../server/config/database');
const expect = require('chai').expect;
const MockClient = require('../mocks/mock-client');
const sinon = require('sinon');
const service = require('../../../server/services/tea-categories');

describe('service: tea-categories', () => {
  let client;
  let testData;

  beforeEach(() => {
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
    client = new MockClient();
    sinon.stub(database, 'connect').resolves(client);
  });

  afterEach(() => {
    database.connect.restore();
  });

  describe('getAll', () => {
    it('connects to the database', () => {
      service.getAll();
      expect(database.connect.calledOnce).to.be.true;
    });

    it('queries the tea categories', async () => {
      sinon.spy(client, 'query');
      await service.getAll();
      expect(client.query.calledOnce).to.be.true;
      expect(client.query.calledWith('select * from tea_categories')).to.be
        .true;
    });

    it('returns the data', async () => {
      sinon.stub(client, 'query');
      client.query.returns(Promise.resolve({ rows: testData }));
      const data = await service.getAll();
      expect(data).to.deep.equal(testData);
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await service.getAll();
      expect(client.release.calledOnce).to.be.true;
    });
  });
});
