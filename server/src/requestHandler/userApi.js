const express = require('express');
const userApi = express.Router(); // eslint-disable-line new-cap
const Controller = require('../controller/Controller');
module.exports = userApi;

/*
 * Login a user. This is not a real login since no password is required. The
 * only check that is performed is that the username exists in the database.
 *
 * parameter username: The username is also used as display name.
 */
userApi.post('/login', (req, res) => {
  if (!req.body.username) {
    return res.status(400).send('fields are missing');
  }

  const contr = new Controller();
  contr.login(username);
});
