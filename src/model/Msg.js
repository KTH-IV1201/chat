'use strict';

const Sequelize = require('sequelize');
const User = require('./User');

/**
 * A message in the chat conversation.
 */
class Msg extends Sequelize.Model {
  /**
   * The name of the Msg model.
   */
  static get MSG_MODEL_NAME() {
    return 'msg';
  }

  /**
   * Defines the Msg entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @param {Models} models An instance of the Models class, which contains all
   *                        other models. Used to create associations.
   * @return {Model} A sequelize model describing the Msg entity.
   */
  static createModel(sequelize, models) {
    Msg.init(
        {
          msg: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        {sequelize, modelName: Msg.MSG_MODEL_NAME, paranoid: true}
    );
    Msg.belongsTo(User);
    return Msg;
  }
}

module.exports = Msg;
