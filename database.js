var mysql = require('mysql');
var bcrypt = require('bcrypt');

var database = mysql.createConnection({
  host     : process.env.host,
  port     : '3306',
  user     : 'admin',
  password : process.env.pwd,
  database : 'api_database'
});

database.connect(function(e) {
  if (e) throw e;
});

/**
 * generating uuid
 */
database.generateUUID = async () => {
  let uuid = await new Promise((resolve, reject) => {
    database.query('SELECT UUID() as uuid', (err, result, field) => {
      if(err) throw err;
      return resolve(result);
    });
  });
  return uuid[0].uuid;
}

/**
 * check if request is authorized
 * @param {string} api_key 
 * @param {string} host 
 */
database.isAuthorized = async (api_key, host) => {
  let isAuthorized = false;
  let query = '', params;
  if(api_key != undefined) {
    query = 'SELECT * FROM `api_keys` WHERE `api_key` = ? AND `host` = ?';
    params = [api_key, host];
  } else {
    query = 'SELECT * FROM `api_keys` WHERE `host` = ?';
    params = [host];
  }
  if(!query & !params) {
    return isAuthorized = false;
  }
  let response = await new Promise((resolve, reject) => {
    database.query(query, params, (err, result, field) => {
      if(err) throw err;
      return resolve(result);
    });
  });
  
  console.log(query, params);
  console.log(response);
  if(response.length > 0) {
    isAuthorized = true;
  }
  return isAuthorized;
}

/**
 * hash a password
 * @param {string} pwd 
 * @param {*} callback 
 */
database.hashPassword = (pwd, callback) => {
  let saltRounds = 1;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(pwd, salt, (err, hash) => {
      return callback(hash);
    });
  });
}

/**
 * compare a hashed password and a real password
 * @param {string} hash 
 * @param {string} pwd 
 * @param {*} callback 
 */
database.comparePassword = (hash, pwd, callback) => {
  bcrypt.compare(pwd, hash, (err, res) => {
    if(err) throw err;
    return callback(res);
  });
}

module.exports = database;