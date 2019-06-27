const User = require('../model/User');

/**
 * Wraps a hashtable with model names as keys and models as values.
 */
class Models {
  /**
   * The name of the User model.
   */
  get USER_MODEL_NAME() {
    return User.USER_MODEL_NAME;
  }

  /**
   * Creates all sequelize models.
   *
   * @param {Sequelize} db The sequelize object.
   * @return {object} A object containing all sequelize models. Property names
   *                  are the model names, and property values are the models.
   */
  createAllModels(db) {
    const models = {};
    models[User.USER_MODEL_NAME] = User.createModel(db);
    return models;
  }
}

module.exports = Models;
