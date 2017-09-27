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
    .findOne(req.params.id)
    .then(race => {
      res.json(race.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Search failed'});
    });
});

router.put('/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id / body id mismatch'
    });
  }
  Race
    .update(
      {'_id': req.params.id, 'candidates.name': req.body.name},
      {$inc: {'candidates.votes' : 1}}
    );
});













module.exports = { router };