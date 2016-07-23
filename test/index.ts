import beater from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { add } from '../src/add';

const { test } = beater();

test('add', () => {
  assert(add(1, 2) === 3);
  assert(sinon);
  assert(proxyquire);
});
