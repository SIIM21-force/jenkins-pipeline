const test = require('node:test');
const assert = require('node:assert');
const app = require('../app');

test('App module loads successfully', () => {
  assert.ok(app);
});