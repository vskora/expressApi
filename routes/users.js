var express = require('express');
var router = express.Router();

var database = require('../database');

/**
 * get all users
 */
router.get('/', (req, res, next) => {
  database.query('SELECT uuid, name, surname, login FROM users', (err, result, field) => {
    if(err) throw err;
    res.status(200).json(result);
  });
});

/**
 * get single user by id
 */
router.get('/:id', async (req, res, next) => {
  let uuid = req.params.id;
  database.query('SELECT uuid, name, surname, login FROM `users` WHERE `uuid` = ?', [uuid], (err, result, field) => {
    if(err) throw err;
    res.status(200).json(result);
  });
});

/**
 * create user
 */
router.post('/', async (req, res, next) => {
  let uuid = await database.generateUUID();
  let params = req.body.params;
  params.uuid = uuid;
  params.login = (params.name.slice(0, 1) + params.surname).toLowerCase();
  database.hashPassword(params.login, pwd => {
    params.password = pwd;
    let keys = Object.keys(params);
    let values = [Object.values(params)];

    database.query(`INSERT INTO users (${keys}) VALUES ?`, [values], (err, result, field) => {
      if(err) {
        console.log(err);
        res.status(400).json({
          successfull: false,
          code: err.code
        });
      } else {
        res.status(200).json({
          successfull: true,
          createdUuid: params.uuid
        });
      }
      /*
      if(err) throw err;
      res.status(200).json({
        successfull: true,
        createdUuid: params.uuid
      });
      */
    });
  });
});

/**
 * update user
 */
router.patch('/:id', async (req, res, next) => {
  let uuid = req.params.id;
  let params = req.body.params;

  let keys = Object.keys(params);
  let values = Object.values(params);

  let str = "";
  let arr = []
  for (let i = 0; i < keys.length; i++) {
    str = str +  keys[i] + " = ?, ";
    arr.push(values[i])
  }
  arr.push(uuid);

  str = str.slice(0, -2);
  
  let query = database.query(`UPDATE users SET ${str} WHERE uuid = ?`, arr, (err, result, field) => {
    if(err) throw err;
    res.status(200).json({
      successfull: true,
      updatedUuid: params.uuid
    });
  });
});

/**
 * delete user
 */
router.delete('/', async (req, res, next) => {
  let params = req.body.params;
  let uuid = params.uuid;
  
  let query = database.query(`DELETE FROM users WHERE uuid = ?`, [uuid], (err, result, field) => {
    if(err) throw err;
    res.status(200).json({
      successfull: true,
      deletedUuid: params.uuid
    });
  });
});

module.exports = router;