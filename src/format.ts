import { parseISOString } from 'time-keeper';
import * as marked from 'marked';
import { Entry, EntryJson } from './types';
import { formatJson } from './fs';

const format = (entry: Entry): EntryJson => {
  const {
    data,
    minutes,
    pubdate,
    tags,
    title
  } = entry;
  const date = parseISOString(pubdate)
    .inTimeZone('+09:00')
    .toISOString()
    .substring(0, '2006-01-02'.length);
  const html = marked(data);
  return {
    data,
    date,
    minutes,
    html,
    pubdate,
    tags,
    title
  };
};

const formatEntries = (entries: Entry[]): string => {
  return formatJson(entries.map(format));
};

const formatEntry = (entry: Entry): string => {
  const entryJson = format(entry);
  return formatJson(entryJson);
};

export { formatEntries, formatEntry };
