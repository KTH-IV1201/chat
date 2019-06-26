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
   * @return {object} A object containing all models. Property names are the
   *                  model names, and property values are the models.
   */
  static allModels() {
    models = {};
    models[User.USER_MODEL_NAME] = User;
    return models;
  }
}

module.exports = Models;
