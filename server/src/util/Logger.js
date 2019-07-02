'use strict';

const VError = require('verror').VError;

/**
 * Writes logs messages to the console.
 */
class Logger {
  /**
   * Logs the specified exception to the console.
   *
   * @param {Error} exc The exception that shall be logged.
   */
  logException(exc) {
    console.error(exc.message);
    console.error(exc.name);
    if (Object.values(VError.info(exc)).length !== 0) {
      console.error(VError.info(exc));
    }
    console.error(exc.stack);
    const cause = VError.cause(exc);
    if (cause !== null) {
      console.error('Caused by:');
      this.logException(cause);
    }
  }
}

module.exports = Logger;
