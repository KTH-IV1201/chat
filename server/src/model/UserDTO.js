'use strict';

const Validators = require('../util/Validators');

/**
 * A user of the chat application.
 */
class UserDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} id The id of the newly created user. This property will be
   *                    automatically generated when a new user is created. Any
   *                    value specified when creating a new user will be
   *                    ignored.
   * @param {string} username The username of the newly craeted user.
   * @param {string} loggedInUntil Zero or null if the user is not logged in.
   *                               A nonzero value means the user is logged in
   *                               until the specified time.
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
  constructor(id, username, loggedInUntil, createdAt, updatedAt, deletedAt) {
    Validators.isPositiveInteger(id, 'id');
    Validators.isNonZeroLengthString(username, 'username');
    Validators.isAlnumString(username, 'username');
    Validators.isInstanceOf(createdAt, Date, 'createdAt', 'Date');
    Validators.isInstanceOf(updatedAt, Date, 'updatedAt', 'Date');
    Validators.isInstanceOfOrNothing(deletedAt, Date, 'deletedAt', 'Date');
    this.id = id;
    this.username = username;
    this.loggedInUntil = loggedInUntil;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

module.exports = UserDTO;
