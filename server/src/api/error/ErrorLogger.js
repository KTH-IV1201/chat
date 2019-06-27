const RequestHandler = require('../RequestHandler');

/**
 * Logs all exceptions that arrive at an express router.
 */
class ErrorLogger extends RequestHandler {
  /**
   * Creates a new instance.
   */
  constructor() {
    super();
  }

  /**
   * @return {string} The URL paths handled by this logger.
   */
  path() {
    return '/';
  }

  /**
   * Registers the request handling function, which will log
   * the caught exception.
   */
  registerHandler() {
    /*
     * Logs errors to the console.
     */
    this.router.use((err, req, res, next) => {
      this.logger.logException(err);
      next(err);
    });
  };
}

module.exports = ErrorLogger;
