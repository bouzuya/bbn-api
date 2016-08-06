import beater from 'beater';
import * as assert from 'power-assert';

import { compile } from '../src/format';
import { Entry, EntryJson } from '../src/types';

const { test } = beater();

test('format', () => {
  const entry: Entry = {
    data: 'hello',
    minutes: 15,
    pubdate: '2006-01-02T15:04:05-07:00',
    tags: ['misc'],
    title: 'title'
  };
  const json: EntryJson = Object.assign({}, entry, {
    date: '2006-01-03', // 2006-01-02T15:04:05-07:00 in +09:00
    html: '<p>hello</p>\n'
  });
  assert.deepEqual(compile(entry), json);
});
