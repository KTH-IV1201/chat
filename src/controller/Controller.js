'use strict';

const Validators = require('../util/Validators');
const ChatDAO = require('../integration/ChatDAO');
const UserDTO = require('../model/UserDTO');

/**
 * The application's controller. No other class shall call the model or
 * integration layer.
 */
class Controller {
  /**
   * Creates a new instance.
   */
  constructor() {
    this.chatDAO = new ChatDAO();
    this.transactionMgr = this.chatDAO.getTransactionMgr();
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
   * @throws Throws an exception if unable to attempt to login the specified
   *         user.
   */
  async login(username) {
    return this.transactionMgr.transaction(async (t1) => {
      Validators.isNonZeroLengthString(username, 'username');
      Validators.isAlnumString(username, 'username');
      const users = await this.chatDAO.findUserByUsername(username);
      if (users.length === 0) {
        return null;
      }
      const loggedInUser = users[0];
      await this.setUsersStatusToLoggedIn(users[0]);
      return loggedInUser;
    });
  }

  /**
   * Checks if the specified user is logged in.
   *
   * @param {string} username: The username of the user logging in.
   * @return {UserDTO} A userDTO describing the logged in user if the user is
   *                   logged in. Null if the user is not logged in.
   * @throws Throws an exception if failed to verify whether the specified user
   *         is logged in.
   */
  async isLoggedIn(username) {
    return this.transactionMgr.transaction(async (t1) => {
      Validators.isNonZeroLengthString(username, 'username');
      Validators.isAlnumString(username, 'username');
      const users = await this.chatDAO.findUserByUsername(username);
      if (users.length === 0) {
        return null;
      }
      const loggedInUser = users[0];
      const loginExpires = new Date(loggedInUser.loggedInUntil);
      if (!this.isValidDate(loginExpires)) {
        return null;
      }
      const now = new Date();
      if (loginExpires < now) {
        return null;
      }
      return loggedInUser;
    });
  }

  /**
   * Adds the specified message to the conversation.
   *
   * @param {string} msg The message to add.
   * @param {UserDTO} author The message author.
   * @return {MsgDTO} The newly created message.
   * @throws Throws an exception if failed to add the specified message.
   */
  async addMsg(msg, author) {
    return this.transactionMgr.transaction(async (t1) => {
      Validators.isNonZeroLengthString(msg, 'msg');
      Validators.isInstanceOf(author, UserDTO, 'user', 'UserDTO');
      return await this.chatDAO.createMsg(msg, author);
    });
  }

  /**
   * Returns the message with the specified id.
   *
   * @param {number} msgId The id of the searched message.
   * @return {MsgDTO} The message with the specified id, or null if there was
   *                  no such message.
   * @throws Throws an exception if failed to search for the specified message.
   */
  async findMsg(msgId) {
    return this.transactionMgr.transaction(async (t1) => {
      Validators.isPositiveInteger(msgId, 'msgId');
      return await this.chatDAO.findMsgById(msgId);
    });
  }

  /**
   * Returns the user with the specified id.
   *
   * @param {number} id The id of the searched user.
   * @return {UserDTO} The user with the specified id, or null if there was
   *                  no such user.
   * @throws Throws an exception if failed to search for the specified user.
   */
  findUser(id) {
    return this.transactionMgr.transaction(async (t1) => {
      return this.chatDAO.findUserById(id);
    });
  }

  /**
   * Returns all messages
   *
   * @return {MsgDTO[]} An array containing all messages. The array will be
   *                    empty if there are no messages.
   * @throws Throws an exception if failed to search for the specified message.
   */
  async findAllMsgs() {
    return this.transactionMgr.transaction(async (t1) => {
      return await this.chatDAO.findAllMsgs();
    });
  }

  /**
   * Deletes the message with the specified id.
   *
   * @param {number} msgId The id of the message that shall be deleted.
   * @throws Throws an exception if failed to delete the specified message.
   */
  async deleteMsg(msgId) {
    return this.transactionMgr.transaction(async (t1) => {
      Validators.isPositiveInteger(msgId, 'msgId');
      await this.chatDAO.deleteMsg(msgId);
    });
  }

  /*
   * only 'private' helper methods below
   */

  // eslint-disable-next-line require-jsdoc
  async setUsersStatusToLoggedIn(user) {
    const hoursToStayLoggedIn = 24;
    const now = new Date();
    user.loggedInUntil = now.setHours(now.getHours() + hoursToStayLoggedIn);
    await this.chatDAO.updateUser(user);
  }

  // eslint-disable-next-line require-jsdoc
  isValidDate(date) {
    return !isNaN(date.getTime());
  }
}
module.exports = Controller;
