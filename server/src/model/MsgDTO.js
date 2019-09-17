'use strict';

const Validators = require('../util/Validators');
const UserDTO = require('./UserDTO');

/**
 * A message in the chat conversation.
 */
class MsgDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} id The id of the newly created instance. This property
   *                    will be automatically generated when a new message is
   *                    created. Any value specified when creating a new
   *                    message will be ignored.
   * @param {number} author The user who submitted the message.
   * @param {string} msg The message content.
   * @param {string} createdAt The time when the msg with the specified id was
   *                           created. This property will be set
   *                           automatically when a new msg is created.
   * @param {string} updatedAt The time when the msg with the specified id was
   *                           last updated. This property will be set
   *                           automatically when a msg is updated.
   * @param {string} deletedAt The time when the msg with the specified id was
   *                           deleted, if it is deleted. This property will be
   *                           set automatically when a msg is deleted.
   */
  constructor(id, author, msg, createdAt, updatedAt, deletedAt) {
    Validators.isPositiveInteger(id, 'id');
    Validators.isInstanceOf(author, UserDTO, 'user', 'UserDTO');
    Validators.isNonZeroLengthString(msg, 'msg');
    Validators.isInstanceOf(createdAt, Date, 'createdAt', 'Date');
    Validators.isInstanceOf(updatedAt, Date, 'updatedAt', 'Date');
    Validators.isInstanceOfOrNothing(deletedAt, Date, 'deletedAt', 'Date');
    this.id = id;
    this.author = author;
    this.msg = msg;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

module.exports = MsgDTO;
