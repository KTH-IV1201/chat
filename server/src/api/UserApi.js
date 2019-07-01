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
       */
      this.router.post('/login', async (req, res, next) => {
        try {
          if (!req.body.username) {
            return res.status(400).send('fields are missing');
          }

          const loggedInUser = await this.contr.login(req.body.username);
          if (loggedInUser === null) {
            return res.status(401).send('Login failed');
          } else {
            Authorization.sendAuthCookie(loggedInUser, res);
            return res.status(200).send('login ok');
          }
        } catch (err) {
          next(err);
        }
      });
    } catch (err) {
      this.logger.logException(err);
    }
  }
}

module.exports = UserApi;
