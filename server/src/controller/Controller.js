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
    loggedInUser.loggedInUntil = new Date(now + 30 min);
    return loggedInUser;
  };
}

module.exports = Controller;
