'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { Race } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });


router.get('/', jsonParser, (req, res)  => {
  console.log('get running');
  Race
    .find()
    .then(races => {
      res.json(races);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Search failed'});
    });
});

router.get('/:id', jsonParser, (req, res)  => {
  Race
    .findById(req.params.id)
    .then(race => {
      res.json(race.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Search failed'});
    });
});

router.put('/:id', jsonParser, (req, res) => {
  console.log('put call received');
  console.log(req.body);
  Race
    .findOneAndUpdate(
      {_id: req.params.id},
      req.body
    )
    .then(race => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.put('/votes/:id', jsonParser, (req, res) => {
  Race
    .update({_id: req.body._id, 'candidates._id': req.body['candidates._id']},
      {$inc: {'candidates.$.candidate.votes': 1}}
    )
    .then(race => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, jwtAuth, (req, res) => {

  Race
    .create({
      type: req.body.type,
      city: req.body.city,
      state: req.body.state,
      district: req.body.district,
      candidates: req.body.candidates})
    .then(
      race => res.status(201).json(race.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.delete('/:id', (req, res) => {
  
  Race
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted race with id = ${req.params.id}`);
      req.status(204).end();
    });
});


module.exports = { router };