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
}
