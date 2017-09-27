'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { Race } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', jsonParser, (req, res)  => {
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
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id / body id mismatch'
    });
  }
  console.log(req.params.id);
  Race
    .update(
      {'candidates.candidate.name': req.body.name},
      //{_id: req.params.id, 'candidates.candidate.name': req.body.name},
      {$set: {'candidate.votes': 250}}
    )
    .then(race => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res) => {

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