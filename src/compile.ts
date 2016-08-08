import { listEntryIds, parseEntry, ParserType } from './parse';
import { formatEntries, formatEntry } from './format';
import { Entry } from './types';
import { path, writeFile } from './fs';
import { Repository } from './repository';

const saveYearlyEntries = (
  repository: Repository,
  outDir: string
): void => {
  repository.getYears().forEach((y) => {
    const entries = repository.findBy({ year: y });
    const formatted = formatEntries(entries);
    [
      `${y}.json`,
      `${y}/index.json`
    ].forEach((file) => {
      writeFile(path(outDir, file), formatted);
    });
  });
};

const saveMonthlyEntries = (
  ds: Entry[],
  outDir: string
): void => {
  const ymsObj = ds.reduce((yms, entry) => {
    const { id: { year, month } } = entry;
    const ym = year + '-' + month;
    if (typeof yms[ym] === 'undefined') yms[ym] = [];
    yms[ym].push(entry);
    return yms;
  }, <{ [ym: string]: Entry[] }>{});
  Object.keys(ymsObj).forEach((ym) => {
    const [year, month] = ym.split('-');
    [
      `${year}/${month}.json`,
      `${year}/${month}/index.json`
    ].forEach((file) => {
      writeFile(path(outDir, file), formatEntries(ymsObj[ym]));
    });
  });
};

const saveDailyEntries = (
  repository: Repository,
  outDir: string
): void => {
  repository.findAll().forEach((entry) => {
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


const compileImpl = (
  inDir: string, outDir: string, type: ParserType = 'default'
): void => {
  const repository = new Repository(inDir, type);
  const ds = repository.findAll();
  saveYearlyEntries(repository, outDir);
  saveMonthlyEntries(ds, outDir);
  saveDailyEntries(repository, outDir);
};

const compile = (inDir: string, outDir: string): void => {
  compileImpl(inDir, outDir);
};

const compileOld = (inDir: string, outDir: string): void => {
  compileImpl(inDir, outDir, 'jekyll');
};

const compileNew = compile;

export { compileOld, compileNew, compile };
