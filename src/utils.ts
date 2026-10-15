export const isNotUndefined = <T>(value: T): value is Exclude<T, undefined> =>
  value !== undefined;

export type AssertTrue<T extends true> = T;

export type ExtendsType<T, U> = T extends U ? true : false;
