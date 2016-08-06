import { listEntryIds, parseEntry, ParserType } from './parse';
import { formatEntries, formatEntry } from './format';
import { Entry } from './types';
import { path, writeFile } from './fs';

const saveEntries = (
  ds: Entry[],
  outDir: string
): void => {
  const ysObj = ds.reduce((ys, entry) => {
    const { id: { year } } = entry;
    if (typeof ys[year] === 'undefined') ys[year] = [];
    ys[year].push(entry);
    return ys;
  }, <{ [year: string]: Entry[] }>{});
  const ymsObj = ds.reduce((yms, entry) => {
    const { id: { year, month } } = entry;
    const ym = year + '-' + month;
    if (typeof yms[ym] === 'undefined') yms[ym] = [];
    yms[ym].push(entry);
    return yms;
  }, <{ [ym: string]: Entry[] }>{});
  Object.keys(ysObj).forEach((y) => {
    [
      `${y}.json`,
      `${y}/index.json`
    ].forEach((file) => {
      writeFile(path(outDir, file), formatEntries(ysObj[y]));
    });
  });
  Object.keys(ymsObj).forEach((ym) => {
    const [year, month] = ym.split('-');
    [
      `${year}/${month}.json`,
      `${year}/${month}/index.json`
    ].forEach((file) => {
      writeFile(path(outDir, file), formatEntries(ymsObj[ym]));
    });
  });
  ds.forEach((entry) => {
    const { id } = entry;
    const title = typeof id.title === 'undefined' ? 'diary' : id.title;
    [
      `${id.year}/${id.month}/${id.date}.json`,
      `${id.year}/${id.month}/${id.date}/index.json`,
      `${id.year}/${id.month}/${id.date}/${title}.json`,
      `${id.year}/${id.month}/${id.date}/${title}/index.json`
    ].forEach((file) => {
      writeFile(path(outDir, file), formatEntry(entry));
    });
  });
};

const listEntries = (
  dir: string,
  type: ParserType = 'default'
): Entry[] => {
  return listEntryIds(dir).map((id) => parseEntry(type, dir, id));
};

const compileImpl = (
  inDir: string, outDir: string, type: ParserType = 'default'
): void => {
  const ds = listEntries(inDir, type);
  saveEntries(ds, outDir);
};

const compile = (inDir: string, outDir: string): void => {
  compileImpl(inDir, outDir);
};

const compileOld = (inDir: string, outDir: string): void => {
  compileImpl(inDir, outDir, 'jekyll');
};

const compileNew = compile;

export { compileOld, compileNew, compile };
