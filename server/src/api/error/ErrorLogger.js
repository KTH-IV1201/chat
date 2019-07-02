'use strict';

const ErrorHandler = require('../RequestHandler');

/**
 * Logs all exceptions that arrive at an express router.
 */
class ErrorLogger extends ErrorHandler {
  /**
   * Creates a new instance.
   */
  constructor() {
    super();
  }

  /**
   * @return {string} The URL paths handled by this error handler.
   */
  get path() {
    return '/';
  }

  /**
   * Registers the request handling function, which will log
   * the caught exception.
   *
   * @param {Application} app The express application hosting the
   *                          error handler.
   */
  registerHandler(app) {
    /*
     * Logs errors to the console.
     */
    app.use(this.path, (err, req, res, next) => {
      this.logger.logException(err);
      next(err);
    });
  }
}

module.exports = ErrorLogger;
