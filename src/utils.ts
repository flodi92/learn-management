import {
  millisecondsPerDay,
  millisecondsPerHour,
  millisecondsPerMinute,
} from './utils.constants';

export const isNotUndefined = <T>(value: T): value is Exclude<T, undefined> =>
  value !== undefined;

export const convertTimestampToDay = (timestamp: number) =>
  timestamp / millisecondsPerDay;

export const convertDayToTimestamp = (day: number) => day * millisecondsPerDay;

export const convertMillisecondsToHumanReadable = (milliseconds: number) => {
  let value = Math.round(milliseconds / millisecondsPerDay);
  if (value > 0) return value === 1 ? `${value} day` : `${value} days`;

  value = Math.round(milliseconds / millisecondsPerHour);
  if (value > 0) return value === 1 ? `${value} hour` : `${value} hours`;

  value = Math.round(milliseconds / millisecondsPerMinute);
  if (value > 0) return value === 1 ? `${value} minute` : `${value} minutes`;

  return 'less then a minute';
};

export type AssertTrue<T extends true> = T;

export type ExtendsType<T, U> = T extends U ? true : false;
