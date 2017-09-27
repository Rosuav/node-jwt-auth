'use strict';

global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { Race } = require('../races');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/race', function() {
  const type = 'test race2';
  const city = 'Tysons Corner';
  const state = 'VA';
  const district = '11';
  const candidates = [{name: 'Bob', votes: 0}];

  before(function () {
    return runServer();
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return Race.create({
      type: 'test race',
      city: 'McLean',
      state: 'VA',
      district: '11',
      candidates: [{candidate: 
        {name: 'Bob', votes: 0}}]
    });
  });

  afterEach(function () {
    return Race.remove({});
  });

  //GET 
  describe('/api/races', function () {
    describe('GET', function () {
      it('Should return all existing races', function() {
        return chai
          .request(app)
          .get('/api/races')
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body.length).to.be.above(0);
            expect(res.body).to.be.an('array');
            // expect(res.body[0]).to.include.keys('type', 'city', 'district', 'state', 'candidates');
            res.body.forEach(function(race) {
              expect(race).to.be.an('object');
              expect(race).to.include.keys('type', 'city', 'district', 'state', 'candidates');
            });
            expect(res).to.be.json;
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should return the requested ID', function () {
        let race;
        return Race
          .findOne()
          .then(function (_race) {
            race = _race;
            return chai
              .request(app)
              .get(`/api/races/${race.id}`);
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
            expect(res.body).to.include.keys('type', 'city', 'district', 'state', 'candidates');
            expect(res.body.type).to.deep.equal(race.type);
            expect(res.body.city).to.deep.equal(race.city);
            expect(res.body.district).to.deep.equal(race.district);
            expect(res.body.state).to.deep.equal(race.state);
            expect(res.body.candidates[0].candidate.name).to.deep.equal(race.candidates[0].candidate.name);
            expect(res.body.candidates[0].candidate.votes).to.deep.equal(race.candidates[0].candidate.votes);
          });

      });
    });
  });
});

//GET by ID


//POST


//Recording the votes (PUT)


//Update a race (PUT)


//DELETE a race

