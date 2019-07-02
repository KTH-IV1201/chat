'use strict';

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
   * @param {UserDTO} authorId The id of the user who submitted the message.
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
  constructor(id, authorId, msg, createdAt, updatedAt, deletedAt) {
    this.id = id;
    this.authorId = authorId;
    this.msg = msg;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

module.exports = MsgDTO;
