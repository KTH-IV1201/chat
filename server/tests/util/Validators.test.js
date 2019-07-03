const Validators = require('../../src/util/Validators');

test('isNumber called with string', () => {
  try {
    Validators.isNumber('this is a string', 'the argument');
    fail('isNumber accepted string');
  } catch (err) {}
});
