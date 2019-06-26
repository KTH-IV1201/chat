/**
 * Logs errors to the console.
 *
 * @param {WError} err The error to log.
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @param {next} next Next request handler.
 */
function logError(err, req, res, next) {
  console.error(err.message);
  console.error(err.name);
  console.error(VError.info);
  console.error(err.stack);
  next(err);
}

module.exports = logError;
