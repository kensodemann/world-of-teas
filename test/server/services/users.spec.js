'use strict';

const database = require('../../../server/config/database');
const expect = require('chai').expect;
const MockClient = require('../mocks/mock-client');
const password = require('../../../server/services/password');
const service = require('../../../server/services/users');
const sinon = require('sinon');

describe('service: users', () => {
  let client;
  let testData;

  beforeEach(() => {
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

    it('queries the users', async () => {
      sinon.spy(client, 'query');
      await service.getAll();
      expect(client.query.calledOnce).to.be.true;
      const sql = client.query.args[0][0];
      expect(/select .* from users/.test(sql)).to.be.true;
    });

    it('resolves the data', async () => {
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

  describe('get', () => {
    it('connects to the database', () => {
      service.get(42);
      expect(database.connect.calledOnce).to.be.true;
    });

    it('queries the users for the user with the given ID', async () => {
      sinon.spy(client, 'query');
      await service.get(42);
      expect(client.query.calledOnce).to.be.true;
      const args = client.query.args[0];
      expect(/select .* from users where id = \$1/.test(args[0])).to.be.true;
      expect(args[1]).to.deep.equal([42]);
    });

    it('queries the users for the user with the given ID string', async () => {
      sinon.spy(client, 'query');
      await service.get('42');
      expect(client.query.calledOnce).to.be.true;
      const args = client.query.args[0];
      expect(/select .* from users where id = \$1/.test(args[0])).to.be.true;
      expect(args[1]).to.deep.equal(['42']);
    });

    it('queries the users by email if the passed id has an "@" sign', async () => {
      sinon.spy(client, 'query');
      await service.get('42@1138.73');
      expect(client.query.calledOnce).to.be.true;
      const args = client.query.args[0];
      expect(
        /select .* from users where upper\(email\) = upper\(\$1\)/.test(args[0])
      ).to.be.true;
      expect(args[1]).to.deep.equal(['42@1138.73']);
    });

    it('resolves the data', async () => {
      sinon.stub(client, 'query');
      client.query.returns(
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
      sinon.stub(client, 'query');
      client.query.returns(Promise.resolve({ rows: [] }));
      const data = await service.get(42);
      expect(data).to.be.undefined;
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await service.get(42);
      expect(client.release.calledOnce).to.be.true;
    });
  });

  describe('save', () => {
    beforeEach(() => {
      sinon.stub(password, 'initialize');
    });

    afterEach(() => {
      password.initialize.restore();
    });

    it('connects to the database', async () => {
      await service.save({
        firstName: 'Tess',
        lastName: 'McTesterson'
      });
      expect(database.connect.calledOnce).to.be.true;
    });

    describe('a user with an ID', () => {
      it('updates the existing user', async () => {
        sinon.spy(client, 'query');
        await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(client.query.calledOnce).to.be.true;
        const sql = client.query.args[0][0];
        expect(
          /^update users.*where id = \$1 returning id, first_name as "firstName",/.test(
            sql
          )
        ).to.be.true;
      });

      it('does not touch the password', async () => {
        await service.save({
          id: 4273,
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(password.initialize.called).to.be.false;
      });

      it('resolves the updated user', async () => {
        sinon.stub(client, 'query');
        client.query.returns(
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
        sinon.stub(client, 'query');
        client.query.returns(Promise.resolve({ rows: [] }));
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
        sinon.spy(client, 'query');
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(client.query.calledOnce).to.be.true;
        const sql = client.query.args[0][0];
        expect(
          /^insert into users.*returning id, first_name as "firstName",/.test(
            sql
          )
        ).to.be.true;
      });

      it('creates an initial password', async () => {
        sinon.stub(client, 'query');
        client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 1138,
                firstName: 'Tess',
                lastName: 'McTesterson',
                email: 'tess@test.ly'
              }
            ]
          })
        );
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly',
          password: 'I am a freak'
        });
        expect(password.initialize.calledOnce).to.be.true;
        expect(password.initialize.calledWith(1138, 'I am a freak')).to.be.true;
      });

      it('defaults to password if no password is given', async () => {
        sinon.stub(client, 'query');
        client.query.returns(
          Promise.resolve({
            rows: [
              {
                id: 1138,
                firstName: 'Tess',
                lastName: 'McTesterson',
                email: 'tess@test.ly'
              }
            ]
          })
        );
        await service.save({
          firstName: 'Tess',
          lastName: 'McTesterson',
          email: 'tess@test.ly'
        });
        expect(password.initialize.calledOnce).to.be.true;
        expect(password.initialize.calledWith(1138, 'password')).to.be.true;
      });

      it('resolves the inserted user', async () => {
        sinon.stub(client, 'query');
        client.query.returns(
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
      sinon.spy(client, 'release');
      await service.save({
        firstName: 'Tess',
        lastName: 'McTesterson'
      });
      expect(client.release.calledOnce).to.be.true;
    });
  });
});
