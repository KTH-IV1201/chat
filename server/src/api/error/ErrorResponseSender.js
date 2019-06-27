const RequestHandler = require('../RequestHandler');

/**
 * This is the last resort for error handling. Sends an error message in
 * response to all uncaught exceptions.
 */
class ErrorResponseSender extends RequestHandler {
  /**
   * Constructs a new instance.
   */
  constructor() {
    super();
  }

  /**
   * @return {string} The URL paths handled by this logger.
   */
  path() {
    return '/user';
  }

  /**
   * Registers the request handling function, which sends a response describing
   * the error, with HTTP status code 500. Request handling ends after
   * executing this method, since it does not call next().
   */
  registerHandler() {
    /*
     */
    this.router.use((err, req, res, next) => {
      res.status(500).send({error: `'${err.message}'`});
    });
  }
}

module.exports = ErrorResponseSender;
