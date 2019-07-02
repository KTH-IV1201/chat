'use strict';

const jwt = require('jsonwebtoken');

/**
 * Utility methods for authorization.
 */
class Authorization {
  /**
   * The name of the authorization cookie.
   */
  static get AUTH_COOKIE_NAME() {
    return 'chatAuth';
  }

  /**
   * Checks if the user is logged in. If so, adds the property 'user' to
   * the request object. That property is an object with the properties 'id'
   * and 'username'. Sends an HTTP 401 response if the user is not logged in.
   *
   * @param {Controller} contr The application's controller.
   * @param {Request} req The express Request object.
   * @param {Response} res The express response object.
   * @return {boolean} true is the user was logged in, false if not.
   */
  static async checkLogin(contr, req, res) {
    const authCookie = req.cookies.chatAuth;
    if (!authCookie) {
      res.status(401).send('Invalid or missing authorization token');
      return false;
    }
    try {
      const userJWTPayload = jwt.verify(authCookie, process.env.JWT_SECRET);
      if (!(await contr.isLoggedIn(userJWTPayload.username))) {
        res.clearCookie('chatAuth');
        res.status(401).send('Invalid or missing authorization token');
        return false;
      }
      req.user = userJWTPayload;
      return true;
    } catch (err) {
      res.clearCookie('chatAuth');
      res.status(401).send('Invalid or missing authorization token');
      return false;
    }
  }

  /**
   * Sens a cookie specifiying that the user is logged in.
   * @param {UserDTO} user The logged in user.
   * @param {Result} res The express request object.
   */
  static sendAuthCookie(user, res) {
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
    res.cookie('chatAuth', jwtToken, cookieOptions);
  }
}

module.exports = Authorization;
