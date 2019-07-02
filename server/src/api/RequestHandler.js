'use strict';

const express = require('express');
const Controller = require('../controller/Controller');
const Logger = require('../util/Logger');

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
   * Creates the controller, which shall be used by subclasses.
   */
  async retrieveController() {
    this.contr = await Controller.createController();
  };
}

module.exports = RequestHandler;
