const isNotUndefined = <T>(value: T): value is Exclude<T, undefined> =>
  value !== undefined;
