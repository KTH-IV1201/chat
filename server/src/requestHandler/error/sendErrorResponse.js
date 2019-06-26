/**
 * Sends a response describing the error, with HTTP status code 500.
 * Request handling ends after executing this method, since it does not
 * call next().
 *
 * @param {WError} err The error that occured.
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @param {next} next Next request handler.
 */
function sendErrorResponse(err, req, res, next) {
  res.status(500).send({error: `'${err.message}'`});
}

module.exports = sendErrorResponse;
