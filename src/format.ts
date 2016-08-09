import { Entry, EntryJson } from './types';
import { formatJson } from './fs';
export { formatAtom } from './format-atom';

const format = (entry: Entry): EntryJson => {
  const {
    data,
    date,
    html,
    minutes,
    pubdate,
    tags,
    title
  } = entry;
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
