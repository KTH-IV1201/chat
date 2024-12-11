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
   * @param {function} errorHandler Called if the request is not made by an
   *                                authenticated user. This function shall
   *                                have following signature:
   *                                <p>
   *                                  function errorHandler(res, httpStatus,
   *                                                        reason)
   *                                </p>
   * @return {boolean} true is the user was logged in, false if not.
   */
  static async checkLogin(contr, req, res, errorHandler) {
    const authCookie = req.cookies.chatAuth;
    if (!authCookie) {
      errorHandler(res, 401, 'Invalid or missing authorization token');
      return false;
    }
    try {
      const userJWTPayload = jwt.verify(authCookie, process.env.JWT_SECRET);
      const loggedInUser = await contr.isLoggedIn(userJWTPayload.username);
      if (loggedInUser === null) {
        res.clearCookie('chatAuth');
        errorHandler(res, 401, 'Invalid or missing authorization token');
        return false;
      }
      req.user = loggedInUser;
      return true;
    } catch (err) {
      res.clearCookie('chatAuth');
      errorHandler(res, 401, 'Invalid or missing authorization token');
      return false;
    }
  }

  /**
   * Sens a cookie specifying that the user is logged in.
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
        },
    );

    const cookieOptions = {
      ...notAccessibleFromJs,
      ...isSessionCookie,
    };
    res.cookie('chatAuth', jwtToken, cookieOptions);
  }
}

module.exports = Authorization;
