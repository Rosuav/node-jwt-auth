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

module.exports = { router };