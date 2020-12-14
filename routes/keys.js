var express = require('express');
var router = express.Router();

var database = require('../database');

/**
 * Get all keys
 */
router.get('/', (req, res, next) => {
  database.query('SELECT * FROM keys', (err, result, field) => {
    if(err) throw err;
    res.json(result);
  });
});

/**
 * Create key
 */
router.all('/create', async (req, res, next) => {
  let api_key = generateApiKey();
  let host = req.headers.host;
  return res.json({
      api_key,
      host
  });
});

module.exports = router;

function generateApiKey() {
    let arr = [...Array(30)];
    let key = arr.map(e => ((Math.random() * 36) | 0).toString(36))
      .join('');
    return key;
}