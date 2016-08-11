declare module 'marked' {
  function marked(markdownString: string): string;
  namespace marked { }
  export = marked;
}

declare module 'commander-b' {
  var commander: any;
  export = commander;
}
