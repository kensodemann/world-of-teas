'use strict';

const auth = require('../../../server/services/authentication');
const expect = require('chai').expect;
const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const teas = require('../../../server/services/teas');

describe('route: /api/teas', () => {
  const app = express();
  require('../../../server/config/express')(app);
  require('../../../server/config/routes')(app);

  let testData;

  beforeEach(() => {
    testData = [
      {
        id: 10,
        name: 'Grassy Green',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'something about the tea',
        instructions: 'do something with the tea',
        rating: 2
      },
      {
        id: 20,
        name: 'Moldy Mushroom',
        teaCategoryId: 3,
        teaCategoryName: 'Pu-ehr',
        description:
          'A woody fermented tea with faint hints of mold and fungus',
        instructions: 'soak then brew',
        rating: 5
      },
      {
        id: 30,
        name: 'Earl Grey',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'flowery tea',
        instructions: 'do something with the tea',
        rating: 3
      },
      {
        id: 40,
        name: 'English Breakfast',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'Good basic tea',
        instructions: 'brew it hot',
        rating: 4
      },
      {
        id: 1138,
        name: 'Simple Sencha',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'Just a good basic green tea',
        instructions: 'do not over-brew',
        rating: 4
      }
    ];
    sinon.stub(auth, 'isAuthenticated').returns(true);
  });

  afterEach(() => {
    auth.isAuthenticated.restore();
  });

  describe('get', () => {
    beforeEach(() => {
      sinon.stub(teas, 'getAll').resolves(testData);
      sinon
        .stub(teas, 'get')
        .withArgs('30')
        .resolves(testData[2]);
    });

    afterEach(() => {
      teas.getAll.restore();
      teas.get.restore();
    });

    registerGetTests();

    describe('when not logged in', () => {
      beforeEach(() => {
        auth.isAuthenticated.returns(false);
      });

      registerGetTests();
    });
  });

  function registerGetTests() {
    it('returns the data', done => {
      request(app)
        .get('/api/teas')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });

    describe('with an id', () => {
      it('returns the data if the tea is found', done => {
        request(app)
          .get('/api/teas/30')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              id: 30,
              name: 'Earl Grey',
              teaCategoryId: 2,
              teaCategoryName: 'Black',
              description: 'flowery tea',
              instructions: 'do something with the tea',
              rating: 3
            });
            done();
          });
      });

      it('returns 404 if the tea is not found', done => {
        request(app)
          .get('/api/teas/314159')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
  }

  describe('post', () => {
    beforeEach(() => {
      sinon.stub(teas, 'save');
    });

    afterEach(() => {
      teas.save.restore();
    });

    describe('without an id', () => {
      it('requires an API login', done => {
        auth.isAuthenticated.returns(false);
        request(app)
          .post('/api/teas')
          .send({
            name: 'Grassy Green',
            teaCategoryId: 1,
            teaCategoryName: 'Green',
            description: 'something about the tea',
            instructions: 'do something with the tea',
            rating: 2
          })
          .end((err, res) => {
            expect(teas.save.called).to.be.false;
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('saves the new tea', done => {
        request(app)
          .post('/api/teas')
          .send({
            id: 420,
            name: 'Grassy Green',
            teaCategoryId: 1,
            teaCategoryName: 'Green',
            description: 'something about the tea',
            instructions: 'do something with the tea',
            rating: 2
          })
          .end((err, res) => {
            expect(teas.save.calledOnce).to.be.true;
            expect(
              teas.save.calledWith({
                name: 'Grassy Green',
                teaCategoryId: 1,
                teaCategoryName: 'Green',
                description: 'something about the tea',
                instructions: 'do something with the tea',
                rating: 2
              })
            ).to.be.true;
            done();
          });
      });
    });

    describe('with an id', () => {
      it('requires an API login', done => {
        auth.isAuthenticated.returns(false);
        request(app)
          .post('/api/teas/30')
          .send({
            id: 30,
            name: 'Grassy Green',
            teaCategoryId: 1,
            teaCategoryName: 'Green',
            description: 'something about the tea',
            instructions: 'do something with the tea',
            rating: 2
          })
          .end((err, res) => {
            expect(teas.save.called).to.be.false;
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('calls the save', done => {
        request(app)
          .post('/api/teas/30')
          .send({
            id: 30,
            name: 'Grassy Green',
            teaCategoryId: 1,
            teaCategoryName: 'Green',
            description: 'something about the tea',
            instructions: 'do something with the tea',
            rating: 2
          })
          .end((err, res) => {
            expect(teas.save.calledOnce).to.be.true;
            expect(
              teas.save.calledWith({
                id: 30,
                name: 'Grassy Green',
                teaCategoryId: 1,
                teaCategoryName: 'Green',
                description: 'something about the tea',
                instructions: 'do something with the tea',
                rating: 2
              })
            ).to.be.true;
            done();
          });
      });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      sinon.stub(teas, 'delete');
    });

    afterEach(() => {
      teas.delete.restore();
    });

    it('requires an API login', done => {
      auth.isAuthenticated.returns(false);
      request(app)
        .delete('/api/teas/30')
        .send({})
        .end((err, res) => {
          expect(teas.delete.called).to.be.false;
          expect(res.status).to.equal(401);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it('calls the delete', done => {
      request(app)
        .delete('/api/teas/30')
        .send({})
        .end((err, res) => {
          expect(teas.delete.calledOnce).to.be.true;
          expect(teas.delete.calledWith(30)).to.be.true;
          done();
        });
    });
  });
});
