import { parseISOString } from 'time-keeper';
import { Entry, EntryJson } from './types';
import * as marked from 'marked';

const compile = (entry: Entry): EntryJson => {
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

export { compile };
