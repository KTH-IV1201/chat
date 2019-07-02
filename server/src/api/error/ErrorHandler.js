'use strict';

const Controller = require('../../controller/Controller');
const Logger = require('../../util/Logger');

/**
 * Superclass for all error handlers.
 */
class ErrorHandler {
  /**
   * Constructs a new instance, and also creates a logger
   * for use by subclasses.
   */
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Creates the controller, which may be used by subclasses.
   */
  async retrieveController() {
    this.contr = await Controller.createController();
  };
}

module.exports = ErrorHandler;
