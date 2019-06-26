const Sequelize = require('sequelize');

/**
 * A User of the chat application.
 */
class User extends Sequelize.Model {
  /**
   * The name of the User model.
   */
  get USER_MODEL_NAME() {
    return 'user';
  }

  /**
   * Defines the user entity.
   *
   * @param {Sequelize} db The sequelize object.
   */
  static createModel(db) {
    init(
        {
          userName: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        {db, modelName: USER_MODEL_NAME}
    );
  }
}

module.exports = User;
