const RequestHandler = require('./RequestHandler');

/**
 * Defines the user handlig REST API.
 */
class UserApi extends RequestHandler {
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
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();
      /*
       * Login a user. This is not a real login since no password is required.
       * The only check that is performed is that the username exists in
       *  the database.
       *
       * parameter username: The username is also used as display name.
       */
      this.router.post('/login', async (req, res) => {
        if (!req.body.username) {
          return res.status(400).send('fields are missing');
        }

        if (await this.contr.login(req.body.username)) {
          return res.status(200).send('login ok');
        } else {
          return res.status(401).send('Login failed');
        }
      });
    } catch (err) {
      this.logger.logException(err);
    }
  }
}

module.exports = UserApi;
