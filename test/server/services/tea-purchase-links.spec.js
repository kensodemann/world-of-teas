'use strict';

const expect = require('chai').expect;
const MockPool = require('../mocks/mock-pool');
const sinon = require('sinon');
const Service = require('../../../server/services/tea-purchase-links');

describe('service: tea purchase links', () => {
  let pool;
  let service;
  let testData;

  beforeEach(() => {
    pool = new MockPool();
    testData = [
      {
        id: 1,
        teaId: 10,
        url: 'http://www.earlsteas.com/grassy-green',
        price: 35.99
      },
      {
        id: 2,
        teaId: 20,
        url: 'http://www.earlsteas.com/shroom',
        price: 75.25
      },
      {
        id: 3,
        teaId: 30,
        url: 'http://www.earlsteas.com/earl-grey',
        price: 25.50
      },
      {
        id: 6,
        teaId: 10,
        url: 'http://www.natures-nector.com/grassy-green',
        price: 37.50
      },
      {
        id: 7,
        teaId: 10,
        url: 'http://www.jaxxjyll.com/grassy-green',
        price: 34.75
      },
      {
        id: 8,
        teaId: 30,
        url: 'http://www.jaxxjyll.com/earl-grey',
        price: 19.99
      }
    ];
    service = new Service(pool);
  });

  describe('getAll', () => {
    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.getAll(30);
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.getAll(30);
      expect(pool.test_client.query.calledOnce).to.be.true;
      const args = pool.test_client.query.args[0];
      expect(
        /select .* from tea_purchase_links where tea_rid = \$1/.test(
          args[0]
        )
      ).to.be.true;
      expect(args[1]).to.deep.equal([30]);
    });

    it('returns the data', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({rows: testData.filter(t => t.teaId === 30)}));
      const data = await service.getAll();
      expect(data).to.deep.equal(testData.filter(t => t.teaId === 30));
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.getAll(30);
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('save', () => {
    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.save({});
      expect(pool.connect.calledOnce).to.be.true;
    });

    describe('with an ID', () => {
      it('updates the given link', async () => {
        sinon.spy(pool.test_client, 'query');
        await service.save({
          id: 2,
          teaId: 20,
          url: 'http://www.jaxxjyll.com/shroom',
          price: 42.73
        });
        expect(pool.test_client.query.calledTwice).to.be.true;
        let args = pool.test_client.query.args[0];
        expect(/update tea_purchase_links .* where id =/.test(args[0])).to.be.true;

        args = pool.test_client.query.args[1];
        expect(/select .* from tea_purchase_links where id = \$1/.test(args[0])).to
          .be.true;
        expect(args[1]).to.deep.equal([2]);
      });

      it('returns the updated link', async () => {
        sinon.stub(pool.test_client, 'query');
        pool.test_client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 2,
                teaId: 20,
                url: 'http://www.jaxxjyll.com/shroom',
                price: 42.73
              }
            ]
          })
        );
        const data = await service.save({
          id: 2,
          teaId: 20,
          url: 'http://www.jaxxjyll.com/shroom',
          price: 42.73
        });
        expect(data).to.deep.equal({
          id: 2,
          teaId: 20,
          url: 'http://www.jaxxjyll.com/shroom',
          price: 42.73
        });
      });
    });

    describe('without an ID', () => {
      beforeEach(() => {
        sinon.stub(pool.test_client, 'query');
        pool.test_client.query.onCall(0).returns(
          Promise.resolve({
            rows: [{id: 1138}]
          })
        );
        pool.test_client.query.onCall(1).returns(
          Promise.resolve({
            rows: [
              {
                id: 1138,
                teaId: 20,
                url: 'http://www.jaxxjyll.com/shroom',
                price: 42.73
              }
            ]
          })
        );
      });

      it('inserts the given link', async () => {
        await service.save({
          teaId: 20,
          url: 'http://www.jaxxjyll.com/shroom',
          price: 42.73
        });
        expect(pool.test_client.query.calledTwice).to.be.true;
        let args = pool.test_client.query.args[0];
        expect(/insert into tea_purchase_links .* returning id/.test(args[0])).to.be.true;

        args = pool.test_client.query.args[1];
        expect(/select .* from tea_purchase_links where id = \$1/.test(args[0])).to
          .be.true;
        expect(args[1]).to.deep.equal([1138]);
      });

      it('returns the inserted link', async () => {
        const data = await service.save({
          teaId: 20,
          url: 'http://www.jaxxjyll.com/shroom',
          price: 42.73
        });
        expect(data).to.deep.equal({
          id: 1138,
          teaId: 20,
          url: 'http://www.jaxxjyll.com/shroom',
          price: 42.73
        });
      });
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.save({});
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('delete', () => {
    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.delete(42);
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('deletes the link with the given ID', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.delete(42);
      expect(pool.test_client.query.calledOnce).to.be.true;

      let args = pool.test_client.query.args[0];
      expect(/delete from tea_purchase_links where id = \$1/.test(args[0]))
        .to.be.true;
      expect(args[1]).to.deep.equal([42]);
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.delete(42);
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });
});
