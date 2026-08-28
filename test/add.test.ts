import { strictEqual } from 'node:assert';
import { test } from 'node:test';

import { add } from '../src/add.js';

test('adds two numbers', () => {
  strictEqual(add(2, 3), 5);
});
