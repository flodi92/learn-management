import { describe, expect, it } from 'vitest';
import { getParentExpressions } from './regExp.parentIds';
import { RegExpSubject } from '../regExp.model';

const task = (expression: RegExp, subjects: RegExpSubject[]) => ({
  expression,
  subjects,
  categories: [],
  relevance: 1 as const,
  complexity: 1 as const,
  parentRegExps: [],
});

describe('getParentExpressions', () => {
  it('returns no parents when there is no subset relationship', () => {
    const digit = task(/^\d$/, ['\\d']);
    const word = task(/^\w$/, ['\\w']);
    const tasks = [digit, word];

    expect(getParentExpressions(digit, tasks)).toEqual([]);
    expect(getParentExpressions(word, tasks)).toEqual([]);
  });

  it('returns a task with a proper subset of subjects as parent', () => {
    const digit = task(/^\d$/, ['\\d']);
    const digits = task(/^\d+$/, ['\\d', 'x+']);
    const tasks = [digit, digits];

    expect(getParentExpressions(digit, tasks)).toEqual([]);
    expect(getParentExpressions(digits, tasks)).toEqual([digit.expression]);
  });

  it('does not treat tasks with identical subjects as parents of each other', () => {
    const digit = task(/^\d$/, ['\\d']);
    const digitRange = task(/^[0-9]$/, ['\\d']);
    const tasks = [digit, digitRange];

    expect(getParentExpressions(digit, tasks)).toEqual([]);
    expect(getParentExpressions(digitRange, tasks)).toEqual([]);
  });

  it('only returns the direct parent, skipping indirect ancestors', () => {
    const root = task(/^x$/, []);
    const digit = task(/^\d$/, ['\\d']);
    const digits = task(/^\d+$/, ['\\d', 'x+']);

    expect(getParentExpressions(digits, [root, digit, digits])).toEqual([
      digit.expression,
    ]);
  });

  it('returns multiple direct parents when none of them is an ancestor of another', () => {
    const digit = task(/^\d$/, ['\\d']);
    const word = task(/^\w$/, ['\\w']);
    const digitOrWord = task(/^[\d\w]$/, ['\\d', '\\w']);

    const parents = getParentExpressions(digitOrWord, [
      digit,
      word,
      digitOrWord,
    ]);

    expect(parents).toEqual(
      expect.arrayContaining([digit.expression, word.expression]),
    );
    expect(parents).toHaveLength(2);
  });

  it('returns the preceding task as parent for each task of a chain of subsets', () => {
    const root = task(/^x$/, []);
    const digit = task(/^\d$/, ['\\d']);
    const digits = task(/^\d+$/, ['\\d', 'x+']);
    const globalDigits = task(/^\d+$/g, ['\\d', 'x+', 'g']);
    const tasks = [root, digit, digits, globalDigits];

    expect(getParentExpressions(root, tasks)).toEqual([]);
    expect(getParentExpressions(digit, tasks)).toEqual([root.expression]);
    expect(getParentExpressions(digits, tasks)).toEqual([digit.expression]);
    expect(getParentExpressions(globalDigits, tasks)).toEqual([
      digits.expression,
    ]);
  });
});
