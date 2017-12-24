'use strict';

const expect = require('chai').expect;
const MockPool = require('../mocks/mock-pool');
const sinon = require('sinon');
const Servce = require('../../../server/services/users');

describe('service: users', () => {
  let pool;
  let testData;

  beforeEach(() => {
    pool = new MockPool();
    testData = [
      {
        id: 1,
        firstName: 'Kenneth',
        lastName: 'Sodemann',
        email: 'not.my.real.email@gmail.com'
      },
      {
        id: 2,
        firstName: 'Lisa',
        lastName: 'Buerger',
        email: 'another.fake.email@aol.com'
      }
    ];
  });

  describe('getAll', () => {
    let service;

    beforeEach(() => {
      service = new Servce(pool);
    });

    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.getAll();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the users', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.getAll();
      expect(pool.test_client.query.calledOnce).to.be.true;
      const sql = pool.test_client.query.args[0][0];
      expect(/select .* from users/.test(sql)).to.be.true;
    });

    it('resolves the data', async () => {
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

  describe('get', () => {
    let service;

    beforeEach(() => {
      service = new Servce(pool);
    });

    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.get(42);
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the users for the user with the given ID', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.get(42);
      expect(pool.test_client.query.calledOnce).to.be.true;
      const args = pool.test_client.query.args[0];
      expect(/select .* from users where id = \$1/.test(args[0])).to.be.true;
      expect(args[1]).to.deep.equal([42]);
    });

    it('queries the users for the user with the given ID string', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.get('42');
      expect(pool.test_client.query.calledOnce).to.be.true;
      const args = pool.test_client.query.args[0];
      expect(/select .* from users where id = \$1/.test(args[0])).to.be.true;
      expect(args[1]).to.deep.equal(['42']);
    });

    it('queries the users by email if the passed id has an "@" sign', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.get('42@1138.73');
      expect(pool.test_client.query.calledOnce).to.be.true;
      const args = pool.test_client.query.args[0];
      expect(/select .* from users where upper\(email\) = upper\(\$1\)/.test(args[0])).to.be.true;
      expect(args[1]).to.deep.equal(['42@1138.73']);
    });

    it('resolves the data', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(
        Promise.resolve({
          rows: [
            {
              id: 42,
              firstName: 'Ford',
              lastName: 'Prefect',
              email: 'universe.traveler@compuserve.net'
            }
          ]
        })
      );
      const data = await service.get(42);
      expect(data).to.deep.equal({
        id: 42,
        firstName: 'Ford',
        lastName: 'Prefect',
        email: 'universe.traveler@compuserve.net',
        roles: ['admin', 'user']
      });
    });

    it('resolves undefined if not found', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: [] }));
      const data = await service.get(42);
      expect(data).to.be.undefined;
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.get(42);
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('save', () => {
    let service;

    beforeEach(() => {
      service = new Servce(pool);
    });

    it('connects to the pool', async () => {
      sinon.spy(pool, 'connect');
      await service.save({
        firstName: 'Tess',
        lastName: 'McTesterson'
      });
      expect(pool.connect.calledOnce).to.be.true;
    });

    describe('a user with an ID', () => {
      it('updates the existing user', async () => {
        sinon.spy(pool.test_client, 'query');
        await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(pool.test_client.query.calledOnce).to.be.true;
        const sql = pool.test_client.query.args[0][0];
        expect(/^update users.*where id = \$1 returning \*/.test(sql)).to.be
          .true;
      });

      it('resolves the updated user', async () => {
        sinon.stub(pool.test_client, 'query');
        pool.test_client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 4273,
                firstName: 'Tess',
                lastName: 'McTesterson',
                email: 'tess@test.ly'
              }
            ]
          })
        );
        const user = await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(user).to.deep.equal({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
      });

      it('resolves empty if there was no user to update', async () => {
        sinon.stub(pool.test_client, 'query');
        pool.test_client.query.returns(Promise.resolve({ rows: [] }));
        const user = await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(user).to.be.undefined;
      });
    });

    describe('a user without an ID', () => {
      it('creates a new user', async () => {
        sinon.spy(pool.test_client, 'query');
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(pool.test_client.query.calledOnce).to.be.true;
        const sql = pool.test_client.query.args[0][0];
        expect(/^insert into users.*returning \*/.test(sql)).to.be.true;
      });

      it('resolves the inserted user', async () => {
        sinon.stub(pool.test_client, 'query');
        pool.test_client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 4273,
                firstName: 'Tess',
                lastName: 'McTesterson',
                email: 'tess@test.ly'
              }
            ]
          })
        );
        const user = await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(user).to.deep.equal({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
      });
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.save({
        firstName: 'Tess',
        lastName: 'McTesterson'
      });
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });
});
