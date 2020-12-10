'use strict';

const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');

const result = require('dotenv-safe').config({
  path: path.join(APP_ROOT_DIR, '.env'),
  example: path.join(APP_ROOT_DIR, '.env.example'),
});

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(path.join(APP_ROOT_DIR, 'public')));

app.get('/', (req, res) => {
  return res.send('Welcome to the API');
});

const reqHandlerLoader = require('./api');
reqHandlerLoader.loadHandlers(app);
reqHandlerLoader.loadErrorHandlers(app);

const server = app.listen(
    process.env.SERVER_PORT,
    process.env.SERVER_HOST,
    () => {
      console.log(
          `Server is up at ${server.address().address}:${server.address().port}`
      );
    }
);

module.exports = server; // Needed for tests.
