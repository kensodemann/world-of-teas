'use strict';

const database = require('../../../server/config/database');
const expect = require('chai').expect;
const MockClient = require('../mocks/mock-client');
const sinon = require('sinon');
const sessions = require('../../../server/services/sessions');

describe('service: session', () => {
  let client;
  beforeEach(() => {
    client = new MockClient();
    sinon.stub(database, 'connect').resolves(client);
    sinon.stub(client, 'query');
    sinon.stub(client, 'release');
  });

  afterEach(() => {
    database.connect.restore();
  });

  it('exists', () => {
    expect(sessions).to.exist;
  });

  describe('start', () => {
    it('rejects if no user ID is given', async () => {
      try {
        await sessions.start();
        expect.fail(undefined, undefined, 'should have rejected');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Missing Parameter: userId');
      }
    });

    it('connects to the database', async () => {
      await sessions.start(42);
      expect(database.connect.calledOnce).to.be.true;
    });

    it('gets a session ID', async () => {
      await sessions.start(42);
      expect(
        client.query.calledWith(`select nextval('user_session_sequence') as id`)
      ).to.be.true;
    });

    it('inserts a session row', async () => {
      client.query.onCall(0).resolves({ rows: [{ id: 73 }] });
      await sessions.start(42);
      expect(client.query.calledTwice).to.be.true;
      expect(
        client.query.calledWith(
          'insert into user_sessions(session_id, user_rid) values ($1, $2)',
          [73, 42]
        )
      ).to.be.true;
    });

    it('returns the session ID', async () => {
      client.query.onCall(0).resolves({ rows: [{ id: 73 }] });
      expect(await sessions.start(42)).to.equal(73);
    });

    it('releases the database connection', async () => {
      await sessions.start(42);
      expect(client.release.calledOnce).to.be.true;
    });
  });

  describe('end', () => {
    it('connects to the database', async () => {
      await sessions.end(42);
      expect(database.connect.calledOnce).to.be.true;
    });

    it('deletes the session from the table', async () => {
      await sessions.end(314159);
      expect(client.query.calledOnce).to.be.true;
      expect(
        client.query.calledWith(
          'delete from user_sessions where session_id = $1',
          [314159]
        )
      ).to.be.true;
    });

    it('releases the database connection', async () => {
      await sessions.end(42);
      expect(client.release.calledOnce).to.be.true;
    });
  });

  describe('verify', () => {
    it('connects to the database', async () => {
      await sessions.verify(42, 314159);
      expect(database.connect.calledOnce).to.be.true;
    });

    it('queries for the user session', async () => {
      await sessions.verify(42, 314159);
      expect(client.query.calledOnce).to.be.true;
      expect(
        client.query.calledWith(
          'select * from user_sessions where session_id = $1 and user_rid = $2',
          [314159, 42]
        )
      ).to.be.true;
    });

    it('returns true if the session exists', async () => {
      client.query.returns({ rows: [{ session_id: 314159, user_rid: 42 }] });
      expect(await sessions.verify(42, 314159)).to.be.true;
    });

    it('returns false if the session does not exist', async () => {
      client.query.returns({ rows: [] });
      expect(await sessions.verify(42, 314159)).to.be.false;
    });

    it('releases the database connection', async () => {
      await sessions.verify(42, 73);
      expect(client.release.calledOnce).to.be.true;
    });
  });
});
