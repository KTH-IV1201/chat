'use strict';

const {check, validationResult} = require('express-validator');
const RequestHandler = require('./RequestHandler');
const Authorization = require('./auth/Authorization');

/**
 * Defines the REST API with endpoints related to users.
 */
class UserApi extends RequestHandler {
  /**
   * Constructs a new instance.
   */
  constructor() {
    super();
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  get path() {
    return '/user';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();

      /*
       * Login a user. This is not a real login since no password is required.
       * The only check that is performed is that the username exists in
       * the database.
       *
       * parameter username: The username is also used as display name.
       * return 201: If the user was successfully authenticated
       *        400: If the body did not contain a JSON-formatted property
       *             called 'username'.
       *        401: If authentication failed.
       */
      this.router.post(
          '/login',
          [check('username').isAlphanumeric()],
          async (req, res, next) => {
            try {
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                this.sendHttpResponse(res, 400, errors.array());
                return;
              }

              const loggedInUser = await this.contr.login(req.body.username);
              if (loggedInUser === null) {
                this.sendHttpResponse(res, 401, 'Login failed');
                return;
              } else {
                Authorization.sendAuthCookie(loggedInUser, res);
                this.sendHttpResponse(res, 204);
                return;
              }
            } catch (err) {
              next(err);
            }
          }
      );
    } catch (err) {
      this.logger.logException(err);
    }
  }
}

module.exports = UserApi;
