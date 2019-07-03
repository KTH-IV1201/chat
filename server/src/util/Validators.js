'use strict';

const assert = require('assert').strict;
const validator = require('validator');

/**
 * A library with validation methods. The reason for writing this class
 * instead of using an existing npm library, is that nothing similar to
 * for example the methods isPositiveInteger or isInstanceOf was found.
 */
class Validators {
  /**
   * Checks that the specified value is a number.
   *
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isNumber(value, varName) {
    assert.equal(typeof value, 'number', `${varName} must be a number.`);
  }

  /**
   * Checks that the specified value is a string.
   *
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isString(value, varName) {
    assert.equal(typeof value, 'string', `${varName} must be a string.`);
  }

  /**
   * Checks that the specified value is an integer.
   *
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isInteger(value, varName) {
    Validators.isNumber(value, varName);
    assert(
        !Number.isNaN(value) && Number.isInteger(value),
        `${varName} must be an integer.`
    );
  }

  /**
   * Checks that the specified value is a positive integer.
   *
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isPositiveInteger(value, varName) {
    Validators.isInteger(value, varName);
    assert(value > 0, `${varName} must be a positive integer.`);
  }

  /**
   * Checks that the specified value is an integer in the specified interval,
   * inclusive.
   *
   * @param {any} value The value to check.
   * @param {number} lowerLimit The lower, inclusive, limit of the allowed
   *                            interval.
   * @param {number} upperLimit The upper, inclusive, limit of the allowed
   *                            interval.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isIntegerBetween(value, lowerLimit, upperLimit, varName) {
    Validators.isInteger(value, varName);
    assert(
        value >= lowerLimit && value <= upperLimit,
        `${varName} must be an integer between ${lowerLimit} and ${upperLimit}.`
    );
  }

  /**
   * Checks that the specified value is a string of non-zero length.
   *
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isNonZeroLengthString(value, varName) {
    Validators.isString(value, varName);
    assert(!validator.isEmpty(value), `${varName} must have non-zero length.`);
  }

  /**
   * Checks that the specified value is an alphanumeric string.
   *
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isAlnumString(value, varName) {
    Validators.isString(value, varName);
    assert(
        validator.isAlphanumeric(value),
        `${varName} may only contain letters and numbers.`
    );
  }

  /**
   * Checks that the specified value is a string representing a date.
   *
   * @param {any} value The value to check.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @throws {AssertionError} If validation fails.
   */
  static isStringRepresentingDate(value, varName) {
    Validators.isString(value, varName);
    assert(
        validator.isISO8601(value, {strict: true}),
        `${varName} must be a valid date.`
    );
  }

  /**
   * Checks that the specified value is an instance of the specified class.
   *
   * @param {any} value The value to check.
   * @param {any} requiredClass The value is checked to be an instance of this
   *                            class.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @param {string} className The name of the required class. Will be inserted
   *                           in the error message if validation fails.
   * @throws {AssertionError} If validation fails.
   */
  static isInstanceOf(value, requiredClass, varName, className) {
    assert(
        value instanceof requiredClass,
        `${varName} must be a ${className} instance.`
    );
  }

  /**
   * Checks that the specified value is either null, undefined, or an instance
   * of the specified class.
   *
   * @param {any} value The value to check.
   * @param {any} requiredClass The value is checked to be an instance of this
   *                            class, or to be either null or undefined.
   * @param {string} varName The name of the variable holding the value. Will
   *                         be inserted in the error message if validation
   *                         fails.
   * @param {string} className The name of the required class. Will be inserted
   *                           in the error message if validation fails.
   * @throws {AssertionError} If validation fails.
   */
  static isInstanceOfOrNothing(value, requiredClass, varName, className) {
    if (value === null || value === undefined) {
      return;
    }
    Validators.isInstanceOf(value, requiredClass, varName, className);
  }
}

module.exports = Validators;
