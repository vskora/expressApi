const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var groups = require('./routes/groups');
var keys = require('./routes/keys');
var login = require('./routes/login');
const database = require('./database');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* infos */
app.use('/', async (req, res, next) => {
  let api_key = req.headers.authorization;
  let host = req.headers.host;

  let isAuthorized = await database.isAuthorized(api_key, host);
  console.log(api_key, host, isAuthorized);
  if(!isAuthorized) {
    res.json({
      isAuthorized: false
    });
    return;
  }

  console.log('url:', req.url);
  console.log('type:', req.method);
  console.log('isAuthorized:', isAuthorized);

  next();
});

app.use('/api/login', login);
app.use('/api/users', users);
app.use('/api/groups', groups);
app.use('/api/keys', keys);

const PORT = process.env.PORT || 8000; app.listen(PORT, () => { console.log(`App listening on port ${PORT}!`); });

module.exports = app;