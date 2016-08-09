import { ParserType } from './parse';
import {
  formatAtom, formatEntries, formatEntry, formatSitemap
} from './format';
import { path, writeFile } from './fs';
import { Repository } from './repository';

const saveYearlyJson = (
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

const saveMonthlyJson = (
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

const saveDailyJson = (
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

const savePostsJson = (
  repository: Repository,
  outDir: string
): void => {
  const entries = repository.findAll();
  const formatted = JSON.stringify(entries.map((entry) => {
    const { date, minutes, pubdate, tags, title } = entry;
    return { date, minutes, pubdate, tags, title };
  }));
  writeFile(path(outDir, 'posts.json'), formatted);
};

const saveTagsJson = (
  repository: Repository,
  outDir: string
): void => {
  const entries = repository.findAll();
  const formatted = JSON.stringify(
    entries.reduce<{ name: string; count: number; }[]>((tags, entry) => {
      return entry.tags.reduce((tags, tag) => {
        const index = tags.findIndex(({ name }) => name === tag);
        if (index >= 0) {
          const before = tags.slice(0, index);
          const oldTag = tags[index];
          const newTag = Object.assign({}, oldTag, { count: oldTag.count + 1 });
          const after = tags.slice(index + 1);
          return before.concat([newTag]).concat(after);
        } else {
          return tags.concat([{ name: tag, count: 1 }]);
        }
      }, tags);
    }, []));
  writeFile(path(outDir, 'tags.json'), formatted);
};

const saveAtomXml = (
  repository: Repository,
  outDir: string
): void => {
  const entries = repository.findAll();
  const formatted = formatAtom(entries);
  writeFile(path(outDir, 'atom.xml'), formatted);
};

const saveSitemapXml = (
  repository: Repository,
  outDir: string
): void => {
  const entries = repository.findAll();
  const formatted = formatSitemap(entries);
  writeFile(path(outDir, 'sitemap.xml'), formatted);
};

const compileImpl = (
  inDir: string, outDir: string, type: ParserType = 'default'
): void => {
  const repository = new Repository(inDir, type);
  saveYearlyJson(repository, outDir);
  saveMonthlyJson(repository, outDir);
  saveDailyJson(repository, outDir);
  savePostsJson(repository, outDir);
  saveTagsJson(repository, outDir);
  saveAtomXml(repository, outDir);
  saveSitemapXml(repository, outDir);
};

const compile = (inDir: string, outDir: string): void => {
  compileImpl(inDir, outDir);
};

const compileOld = (inDir: string, outDir: string): void => {
  compileImpl(inDir, outDir, 'jekyll');
};

const compileNew = compile;

export { compileOld, compileNew, compile };
