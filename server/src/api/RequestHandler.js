'use strict';

const express = require('express');
const Controller = require('../controller/Controller');
const Logger = require('../util/Logger');
const Validators = require('../util/Validators');

/**
 * Superclass for all request handlers.
 */
class RequestHandler {
  /**
   * Constructs a new instance, and also creates router and logger
   * for use by subclasses.
   */
  constructor() {
    this.router = express.Router(); // eslint-disable-line new-cap
    this.logger = new Logger();
  }

  /**
   * Protocol part (http) of a URL.
   */
  static get URL_PREFIX() {
    return 'http://';
  }

  /**
   * Creates the controller, which shall be used by subclasses.
   */
  async retrieveController() {
    this.contr = await Controller.createController();
  }

  /**
   * Sends an http response with the specified http status and body.
   * @param {Request} res The express Response object.
   * @param {number} status The status code of the response.
   * @param {any} body The body of the response.
   */
  sendHttpResponse(res, status, body) {
    Validators.isIntegerBetween(status, 200, 501);
    if (body === undefined) {
      res.status(status).end();
      return;
    }
    let errOrSucc = undefined;
    if (status < 400) {
      errOrSucc = 'success';
    } else {
      errOrSucc = 'error';
    }
    res.status(status).json({[errOrSucc]: body});
  }
}

module.exports = RequestHandler;
