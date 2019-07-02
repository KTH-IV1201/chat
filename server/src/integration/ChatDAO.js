'use strict';

const assert = require('assert').strict;
const Sequelize = require('sequelize');
const WError = require('verror').WError;
const UserDTO = require('../model/UserDTO');
const MsgDTO = require('../model/MsgDTO');
const User = require('../model/User');
const Msg = require('../model/Msg');

/**
 * This class is responsible for all calls to the database. There shall not
 * be any database-related code outside this class.
 */
class ChatDAO {
  /**
   * Creates a new instance and connects to the database.
   */
  constructor() {
    this.database = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {host: process.env.DB_HOST, dialect: process.env.DB_DIALECT}
    );
    // this.modelNames = new Models();
    // this.models = this.modelNames.createAllModels(this.database);
    User.createModel(this.database);
    Msg.createModel(this.database);
  }

  /**
   * Creates non-existing tables, existing tables are not touched.
   *
   * @throws Throws an exception if the database could not be created.
   */
  async createTables() {
    try {
      await this.database.authenticate();
      await this.database.sync({force: false});
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {ChatDAO: 'Failed to call authenticate and sync.'},
          },
          'Could not connect to database.'
      );
    }
  }

  /**
   * Searches for a user with the specified username.
   *
   * @param {string} username The username of the searched user.
   * @return {array} An array containing all users with the
   *                 specified username. Each element in the returned
   *                 array is a userDTO. The array is empty if no matching
   *                 users were found.
   * @throws Throws an exception if failed to search for the specified user.
   */
  async findUserByUsername(username) {
    try {
      return await User.findAll({
        where: {username: username},
      }).map((userModel) => this.createUserDto(userModel));
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {
              ChatDAO: 'Failed to search for user.',
              username: username,
            },
          },
          `Could not search for user ${username}.`
      );
    }
  }

  /**
   * Updates the user with the id of the specified User object. All fields
   * present in the specified User object are updated.
   *
   * @param {UserDTO} user The new state of the user instance.
   * @throws Throws an exception if failed to update the user.
   */
  async updateUser(user) {
    try {
      assert(
          user instanceof UserDTO,
          'argument "user" must be a UserDTO instance.'
      );
      await User.update(user, {
        where: {id: user.id},
      });
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {
              ChatDAO: 'Failed to update user.',
              username: user.username,
            },
          },
          `Could not update user ${user.username}.`
      );
    }
  }

  /**
   * Creates the specified message.
   *
   * @param {string} msg The message to add.
   * @param {UserDTO} author The message author.
   * @return {MsgDTO} The newly created message.
   * @throws Throws an exception if failed to create the message.
   */
  async createMsg(msg, author) {
    try {
      assert(
          author instanceof UserDTO,
          'argument "author" must be a UserDTO instance.'
      );
      const msgEntityInstance = await Msg.create({msg: msg});
      const usersWithAuthorsUsername = await this.findUserByUsername(
          author.username
      );
      const authorFromDb = usersWithAuthorsUsername[0];
      await msgEntityInstance.setUser(authorFromDb.id);
      return this.createMsgDto(msgEntityInstance);
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {
              ChatDAO: 'Failed to update user.',
              username: user.username,
            },
          },
          `Could not update user ${user.username}.`
      );
    }
  }

  /**
   * Searches for a message with the specified id.
   *
   * @param {number} msgId The id of the searched message.
   * @return {MsgDTO} The message with the specified id, or null if there was
   *                  no such message.
   * @throws Throws an exception if failed to search for the specified message.
   */
  async findMsgById(msgId) {
    try {
      assert.equal(
          typeof msgId,
          'number',
          'argument "msgId" must be a number.'
      );
      assert(
          !isNaN(msgId) && msgId > 0,
          'argument "msgId" must be a positive integer.'
      );
      const msgModel = await Msg.findOne({
        where: {id: msgId},
      });
      if (msgModel === null) {
        return null;
      }
      return this.createMsgDto(msgModel);
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {
              ChatDAO: 'Failed to search for msg.',
              id: msgId,
            },
          },
          `Could not serach for message ${msgId}.`
      );
    }
  }

  /**
   * Deletes the message with the specified id.
   *
   * @param {number} msgId The id of the message that shall be deleted.
   * @throws Throws an exception if failed to delete the specified message.
   */
  async deleteMsg(msgId) {
    try {
      assert.equal(
          typeof msgId,
          'number',
          'argument "msgId" must be a number.'
      );
      assert(
          !isNaN(msgId) && msgId > 0,
          'argument "msgId" must be a positive integer.'
      );
      await Msg.destroy({where: {id: msgId}});
    } catch (err) {
      throw new WError(
          {
            info: {
              ChatDAO: 'Failed to delete message.',
              msg: msgId,
            },
          },
          `Could not delete message ${msgId}.`
      );
    }
  }

  /*
   * only 'private' helper methods below
   */
  // eslint-disable-next-line require-jsdoc
  createMsgDto(msgModel) {
    return new MsgDTO(
        msgModel.dataValues.id,
        msgModel.dataValues.userId,
        msgModel.dataValues.msg,
        msgModel.dataValues.createdAt,
        msgModel.dataValues.updatedAt,
        msgModel.dataValues.deletedAt
    );
  }

  // eslint-disable-next-line require-jsdoc
  createUserDto(userModel) {
    return new UserDTO(
        userModel.dataValues.id,
        userModel.dataValues.username,
        userModel.dataValues.loggedInUntil,
        userModel.dataValues.createdAt,
        userModel.dataValues.updatedAt,
        userModel.dataValues.deletedAt
    );
  }
}

module.exports = ChatDAO;
