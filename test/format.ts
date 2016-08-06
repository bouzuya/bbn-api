import beater from 'beater';
import * as assert from 'power-assert';

import { formatEntry, formatEntries } from '../src/format';
import { Entry, EntryJson } from '../src/types';

const { test } = beater();

test('format.formatEntry', () => {
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

  assert.deepEqual(JSON.parse(formatEntry(entry)), json);
});

test('format.formatEntries', () => {
  const entry1: Entry = {
    data: 'hello',
    minutes: 15,
    pubdate: '2006-01-02T15:04:05-07:00',
    tags: ['misc'],
    title: 'title'
  };
  const json1: EntryJson = Object.assign({}, entry1, {
    date: '2006-01-03', // 2006-01-02T15:04:05-07:00 in +09:00
    html: '<p>hello</p>\n'
  });
  const entry2: Entry = {
    data: 'hello2',
    minutes: 16,
    pubdate: '2006-01-02T15:04:06-07:00',
    tags: ['programming'],
    title: 'title2'
  };
  const json2: EntryJson = Object.assign({}, entry2, {
    date: '2006-01-03', // 2006-01-02T15:04:05-07:00 in +09:00
    html: '<p>hello2</p>\n'
  });

  assert.deepEqual(JSON.parse(formatEntries([entry1, entry2])), [json1, json2]);
});
