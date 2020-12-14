var express = require('express');
var router = express.Router();

var database = require('../database');

/**
 * get all groups
 */
router.get('/', (req, res, next) => {
  const select = 'g.id as id_group, g.name as name_group, u.uuid, u.name, u.surname, u.login';
  const from = 'groups g, groups_users gu, users u';
  const where = 'g.id = gu.id_group AND u.uuid = gu.uuid_user';
  database.query(`SELECT ${select} FROM ${from} WHERE ${where}`, (err, result, field) => {
    if(err) throw err;
    let groups = [];
    result.forEach(el => {
      let idx = groups.findIndex(o => o.id == el.id_group);
      if(idx > -1) {
        groups[idx].users.push(el);
      } else {
        groups.push({id: el.id_group, name: el.name_group, users: [el]})
      }
    });
    res.status(200).json(groups);
  });
});

/**
 * get single group by id
 */
router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  const select = 'g.id as id_group, u.uuid, u.name, u.surname, u.login';
  const from = 'groups g, groups_users gu, users u';
  const where = 'g.id = gu.id_group AND u.uuid = gu.uuid_user AND id = ?';
  
  database.query(`SELECT ${select} FROM ${from} WHERE ${where}`, [id], (err, result, field) => {
    if(err) throw err;
    let group = [{
      id: id,
      users: result.map(e => e)
    }]
    res.status(200).json(group);
  });
});

/**
 * create group
 */
router.post('/', async (req, res, next) => {
});

/**
 * update group
 */
router.patch('/:id', async (req, res, next) => {
});

/**
 * delete group
 */
router.delete('/', async (req, res, next) => {
});

module.exports = router;