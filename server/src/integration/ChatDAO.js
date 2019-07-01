const Sequelize = require('sequelize');
const WError = require('verror').WError;
const UserDTO = require('../model/UserDTO');
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
   * @return {object} An array containing all users with the
   *                  specified username. Each element in the returned
   *                  array is a model.dataValue sequelize object. The array
   *                  is empty if no matching users were found.
   */
  async findUserByUsername(username) {
    // const userModel = this.models[this.modelNames.USER_MODEL_NAME];
    try {
      return await User.findAll({
        where: {username: username},
      }).map(
          (userModel) =>
            new UserDTO(
                userModel.dataValues.id,
                userModel.dataValues.username,
                userModel.dataValues.createdAt,
                userModel.dataValues.updatedAt
            )
      );
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {
              ChatDAO: 'Failed to search for user.',
              username: username,
            },
          },
          `Could not serach for user ${username}.`
      );
    }
  }

  /**
   * Updates the user with the id of the specified User object. All fields
   * present in the specified User object are updated.
   *
   * @param {UserDTO} user The new state of the user instance.
   */
  async updateUser(user) {
    await User.update(user, {
      where: {id: user.id},
    });
  }

  /**
   * Adds the specified message to the conversation.
   *
   * @param {string} msg The message to add.
   * @param {User} author The message author.
   */
  async createMsg(msg, author) {
    const msgEntityInstance = await Msg.create({msg: msg});
    const usersWithAuthorsUsername = await this.findUserByUsername(
        author.username
    );
    await msgEntityInstance.setUser(usersWithAuthorsUsername[0].id);
  }
}

module.exports = ChatDAO;
