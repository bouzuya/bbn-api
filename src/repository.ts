import { listEntryIds, parseEntry, ParserType } from './parse';
import { Entry } from './types';

export class Repository {
  private _entries: Entry[];

  constructor(dir: string, type: ParserType = 'default') {
    this._entries = listEntryIds(dir).map((id) => parseEntry(type, dir, id));
  }

  findAll(): Entry[] {
    return this._entries; // TODO: defensive copy
  }

  findBy(query: { year?: string; }): Entry[] {
    return this._entries.filter(({ id: { year } }) => year === query.year);
  }

  getYears(): string[] {
    return this._entries.reduce<string[]>((ys, entry) => {
      const { id: { year } } = entry;
      return ys.some((y) => y === year) ? ys : ys.concat([year]);
    }, []);
  }
}
