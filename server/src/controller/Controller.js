const moment = require('moment');
moment().format();
const ChatDAO = require('../integration/ChatDAO');

/**
 * The application's controller. No other class shall call the model or
 * intagration layer.
 */
class Controller {
  /**
   * Creates a new instance.
   */
  constructor() {
    this.chatDAO = new ChatDAO();
  }

  /**
   * Instantiates a new Controller object.
   *
   * @return {Controller} The newly created controller.
   */
  static async createController() {
    const contr = new Controller();
    await contr.chatDAO.createTables();
    return contr;
  }

  /**
   * Login a user. This is not a real login since no password is required. The
   * only check that is performed is that the username exists in the database.
   *
   * @param {string} username: The username of the user logging in.
   * @return {User} The logged in user if login succeeded, or null if login
   *                failed.
   */
  async login(username) {
    const users = await this.chatDAO.findUserByUsername(username);
    if (users.length === 0) {
      return null;
    }
    const loggedInUser = users[0];
    await this.setUsersStatusToLoggedIn(users[0]);
    return loggedInUser;
  }

  /**
   * Checks if the specified user is logged in. Returns true if the user is
   * logged in and false if the user is not logged in.
   *
   * @param {string} username: The username of the user logging in.
   * @return {boolean} true if the user is logged in, false if the user is
   *                   not logged in.
   */
  async isLoggedIn(username) {
    const users = await this.chatDAO.findUserByUsername(username);
    if (users.length === 0) {
      return false;
    }
    return true;
  }

  /**
   * Adds the specified message to the conversation.
   *
   * @param {string} msg The message to add.
   * @param {User} author The message author.
   */
  async addMsg(msg, author) {
    await this.chatDAO.createMsg(msg, author);
  }

  /*
   * only 'private' helper methods below
   */
  // eslint-disable-next-line require-jsdoc
  async setUsersStatusToLoggedIn(user) {
    const periodToStayLoggedIn = moment.duration({hours: 24});
    user.loggedInUntil = new Date(moment() + periodToStayLoggedIn);
    await this.chatDAO.updateUser(user);
  }
}
module.exports = Controller;
