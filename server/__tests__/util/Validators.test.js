'use strict';

const Validators = require('../../src/util/Validators');

describe('tests for isNumber', () => {
  test('called with string argument', () => {
    try {
      Validators.isNumber('this is a string', 'the argument');
      fail('isNumber accepted string');
    } catch (err) {
      expect(err.name).toContain('AssertionError');
      expect(err.expected).toMatch('number');
      expect(err.actual).toMatch('string');
    }
  });
});
