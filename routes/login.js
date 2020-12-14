var express = require('express');
var router = express.Router();

var database = require('../database');

/**
 * login
 */
router.post('/', (req, res, next) => {
  res.status(200).json({
    login: true
  });
});

module.exports = router;