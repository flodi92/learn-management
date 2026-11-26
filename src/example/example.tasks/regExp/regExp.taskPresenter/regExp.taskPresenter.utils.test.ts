import chalk from 'chalk';
import { InitialRegExpTaskDescription } from '../regExp.tasks/regExp.model';
import { normalizeTaskDescription } from '../regExp.tasks/regExp.utils/regExp.normalizeTaskDescription';
import { Example } from './regExp.taskPresenter.model';
import {
  determineConfusions,
  getConfusionMessage,
  getExampleAlternative,
} from './regExp.taskPresenter.utils';

const createTaskDescription = (
  input: Partial<InitialRegExpTaskDescription> &
    Pick<InitialRegExpTaskDescription, 'expression'>,
) =>
  normalizeTaskDescription({
    positiveExamples: [],
    negativeExamples: [],
    parents: [],
    subjects: [],
    categories: [],
    relevance: 1,
    complexity: 1,
    ...input,
  });

const createExample = (
  text: string,
  isPositive: boolean,
  answer: Example['answer'],
): Example => ({ text, alternative: text, isPositive, answer });

describe('getExampleAlternative', () => {
  it('returns plain strings unchanged', () => {
    expect(getExampleAlternative('xyz')).toBe('xyz');
  });

  it('replaces the empty string with a highlighted name', () => {
    expect(getExampleAlternative('')).toBe(chalk.magenta('<empty string>'));
  });

  it('replaces special characters with highlighted names', () => {
    expect(getExampleAlternative('a\nb\tc d\r')).toBe(
      `a${chalk.magenta('<linebreak>')}b${chalk.magenta('<tab>')}c${chalk.magenta('<space>')}d${chalk.magenta('<carriage return>')}`,
    );
  });
});

describe('determineConfusions', () => {
  const startsWith = createTaskDescription({
    expression: /^xyz/,
    positiveExamples: ['xyz', 'xyzab'],
    negativeExamples: ['abxyz', 'xy'],
    confusedWith: [/xyz$/, /^unknown$/, /^[^xyz]$/],
  });
  const endsWith = createTaskDescription({
    expression: /xyz$/,
    positiveExamples: ['xyz', 'abxyz'],
    negativeExamples: ['xyzab', 'xy'],
  });
  const notIn = createTaskDescription({
    expression: /^[^xyz]$/,
    positiveExamples: ['a'],
    negativeExamples: ['x', 'xy'],
  });
  const allTaskDescriptions = [startsWith, endsWith, notIn];
  const determine = (examples: Example[]) =>
    determineConfusions({
      taskDescription: startsWith,
      examples,
      allTaskDescriptions,
    });

  it('finds a linked task description in which an incorrectly answered positive example is negative', () => {
    const example = createExample('xyzab', true, 'negative');
    expect(determine([example])).toEqual([
      { example, linkedTaskDescription: endsWith },
    ]);
  });

  it('finds a linked task description in which an incorrectly answered negative example is positive', () => {
    const example = createExample('abxyz', false, 'positive');
    expect(determine([example])).toEqual([
      { example, linkedTaskDescription: endsWith },
    ]);
  });

  it('ignores correctly answered examples and examples with the same kind in the linked task description', () => {
    expect(
      determine([
        createExample('xyzab', true, 'positive'),
        createExample('abxyz', false, 'negative'),
        createExample('xy', false, 'positive'),
      ]),
    ).toEqual([]);
  });

  it('lists every linked task description once, using the first conflicting example', () => {
    const first = createExample('abxyz', false, 'positive');
    const second = createExample('xyzab', true, 'negative');
    const third = createExample('xy', false, 'positive');
    expect(determine([first, second, third])).toEqual([
      { example: first, linkedTaskDescription: endsWith },
    ]);
  });

  it('keeps the order of confusedWith and skips ids without task description', () => {
    const example = createExample('xy', true, 'negative');
    expect(determine([example])).toEqual([
      { example, linkedTaskDescription: endsWith },
      { example, linkedTaskDescription: notIn },
    ]);
  });
});

describe('getConfusionMessage', () => {
  const startsWith = createTaskDescription({ expression: /^xyz/ });
  const endsWith = createTaskDescription({ expression: /xyz$/ });

  it('describes a positive example that is negative for the linked task description', () => {
    expect(
      getConfusionMessage(startsWith, {
        example: createExample('xyzab', true, 'negative'),
        linkedTaskDescription: endsWith,
      }),
    ).toBe('xyzab is positive for /^xyz/ but negative for /xyz$/');
  });

  it('describes a negative example that is positive for the linked task description', () => {
    expect(
      getConfusionMessage(startsWith, {
        example: createExample('abxyz', false, 'positive'),
        linkedTaskDescription: endsWith,
      }),
    ).toBe('abxyz is negative for /^xyz/ but positive for /xyz$/');
  });
});
