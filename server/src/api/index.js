'use strict';

const UserApi = require('./UserApi');
const MsgApi = require('./MsgApi');
const ErrorLogger = require('./error/ErrorLogger');
const ErrorResponseSender = require('./error/ErrorResponseSender');

/**
 * Contains all request handlers.
 */
class RequestHandlerLoader {
  /**
   * Creates a new instance.
   */
  constructor() {
    this.reqHandlers = [];
    this.errorHandlers = [];
  }

  /**
   * Adds a new request handler.
   *
   * @param {RequestHandler} reqHandler The request handler that will be added.
   */
  addRequestHandler(reqHandler) {
    this.reqHandlers.push(reqHandler);
  }

  /**
   * Adds a new error handler.
   *
   * @param {ErrorHandler} errorHandler The error handler that will be added.
   */
  addErrorHandler(errorHandler) {
    this.errorHandlers.push(errorHandler);
  }

  /**
   * Makes all request handlers available in the specified express
   * Application object.
   *
   * @param {Application} app The express application hosting the
   *                          request handlers.
   */
  loadHandlers(app) {
    this.reqHandlers.forEach((reqHandler) => {
      reqHandler.registerHandler();
      app.use(reqHandler.path, reqHandler.router);
    });
  }

  /**
   * Makes all error handlers available in the specified express
   * Application object. Note that error handlers can not be loaded via an
   * express router object.
   *
   * @param {Application} app The express application hosting the
   *                          error handlers.
   */
  loadErrorHandlers(app) {
    this.errorHandlers.forEach((errorHandler) => {
      errorHandler.registerHandler(app);
    });
  }
}

const loader = new RequestHandlerLoader();
loader.addRequestHandler(new UserApi());
loader.addRequestHandler(new MsgApi());
loader.addErrorHandler(new ErrorLogger());
loader.addErrorHandler(new ErrorResponseSender());

module.exports = loader;
