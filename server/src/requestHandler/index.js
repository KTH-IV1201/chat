const USER_API_PATH = '/user';

/**
 * Contains an express Router with a request handler and the URL path at which
 * it shall be accessed.
 */
class RequestHandler {
  /**
   * Constructs a new instance repesenting a request handler.
   *
   * @param {object} reqHandler An express request handling function or
   *                            an express Router object.
   * @param {string} path The path to the handler.
   */
  constructor(reqHandler, path = '/') {
    this.router = reqHandler;
    this.path = path;
  }

  /**
   * Makes this request handler available in the specified express
   * Application object.
   *
   * @param {Application} app The express application hosting this
   *                          request handler.
   */
  loadApi(app) {
    app.use(this.path, this.router);
  }
}
module.exports = [
  new RequestHandler(require('./userApi'), USER_API_PATH),
  new RequestHandler(require('./error/logError')),
  new RequestHandler(require('./error/sendErrorResponse')),
];
