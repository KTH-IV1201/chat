const Sequelize = require('sequelize');

/**
 * A User of the chat application.
 */
class User {
  /**
   * The name of the User model.
   */
  static get USER_MODEL_NAME() {
    return 'user';
  }

  /**
   * Defines the user entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the user entity.
   */
  static createModel(sequelize) {
    // eslint-disable-next-line require-jsdoc
    class UserModel extends Sequelize.Model {} // eslint-disable-line max-len
    UserModel.init(
        {
          userName: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        {sequelize, modelName: User.USER_MODEL_NAME}
    );
    return UserModel;
  }
}

module.exports = User;
