import { ParserType } from './parse';
import { formatAtom, formatEntries, formatEntry } from './format';
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
  repository: Repository,
  outDir: string
): void => {
  repository.getYears().forEach((year) => {
    repository.getMonths(year).forEach((month) => {
      const entries = repository.findBy({ year, month });
      const formatted = formatEntries(entries);
      [
        `${year}/${month}.json`,
        `${year}/${month}/index.json`
      ].forEach((file) => {
        writeFile(path(outDir, file), formatted);
      });
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
    const formatted = formatEntry(entry);
    [
      `${id.year}/${id.month}/${id.date}.json`,
      `${id.year}/${id.month}/${id.date}/index.json`,
      `${id.year}/${id.month}/${id.date}/${title}.json`,
      `${id.year}/${id.month}/${id.date}/${title}/index.json`
    ].forEach((file) => {
      writeFile(path(outDir, file), formatted);
    });
  });
};

const saveAtomXml = (
  repository: Repository,
  outDir: string
): void => {
  const entries = repository.findAll();
  const formatted = formatAtom(entries);
  writeFile(path(outDir, 'atom.xml'), formatted);
};

const compileImpl = (
  inDir: string, outDir: string, type: ParserType = 'default'
): void => {
  const repository = new Repository(inDir, type);
  saveYearlyEntries(repository, outDir);
  saveMonthlyEntries(repository, outDir);
  saveDailyEntries(repository, outDir);
  saveAtomXml(repository, outDir);
};

const compile = (inDir: string, outDir: string): void => {
  compileImpl(inDir, outDir);
};

const compileOld = (inDir: string, outDir: string): void => {
  compileImpl(inDir, outDir, 'jekyll');
};

const compileNew = compile;

export { compileOld, compileNew, compile };
