'use strict';

const Sequelize = require('sequelize');

/**
 * A user of the chat application.
 */
class User extends Sequelize.Model {
  /**
   * The name of the User model.
   */
  static get USER_MODEL_NAME() {
    return 'user';
  }

  /**
   * Defines the User entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the User entity.
   */
  static createModel(sequelize) {
    User.init(
        {
          username: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          loggedInUntil: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: 0,
          },
        },
        {sequelize, modelName: User.USER_MODEL_NAME, paranoid: true}
    );
    return User;
  }
}

module.exports = User;
