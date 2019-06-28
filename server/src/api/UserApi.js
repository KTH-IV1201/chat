const jwt = require('jsonwebtoken');
const cookies = require('cookie-parser');
const RequestHandler = require('./RequestHandler');

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
   * @return {string} The URL paths handled by this logger.
   */
  path() {
    return '/user';
  }

  /**
   * Sends a cookie which proves that the user is logged in. This cookie will
   * contain a JWT with the user's data.
   *
   * @param {User} user The user data that will be included in the JWT.
   * @param {Response} res The express response object used to send the cookie.
   */
  sendAuthCookie(user, res) {
    const notAccessibleFromJs = {httpOnly: true};
    const isSessionCookie = {expires: 0};

    const jwtToken = jwt.sign(
        {id: user.id, username: user.username},
        process.env.JWT_SECRET,
        {
          expiresIn: '30 minutes',
        }
    );

    const cookieOptions = {
      ...notAccessibleFromJs,
      ...isSessionCookie,
    };
    res.cookie('chatId', jwtToken, cookieOptions);
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
      this.router.post('/login', async (req, res, next) => {
        try {
          if (!req.body.username) {
            return res.status(400).send('fields are missing');
          }

          const loggedInUser = await this.contr.login(req.body.username);
          if (loggedInUser === null) {
            return res.status(401).send('Login failed');
          } else {
            this.sendAuthCookie(loggedInUser, res);
            return res.status(200).send('login ok');
          }
        } catch (err) {
          next(err);
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserApi;
