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
   * @param {User} author The user who sunmitted the message.
   * @param {string} msg The message content.
   * @param {string} createdAt The time when the msg with the specified id was
   *                           created. This property will be automatically
   *                           generated when a new msg is created. Any
   *                           value specified when creating a new msg will be
   *                           ignored.
   * @param {string} updatedAt The time when the msg with the specified id was
   *                           last updated. This property will be automatically
   *                           generated when a new msg is created. Any
   *                           value specified when creating a new msg will be
   *                           ignored.
   */
  constructor(id, author, msg) {
    this.id = id;
    this.author = author;
    this.msg = msg;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = MsgDTO;
