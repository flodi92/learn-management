import { describe, expect, it } from 'vitest';
import { regExpTasks } from './regExp.tasks';

describe('regExpTasks', () => {
  describe('check for positive and negative examples', () => {
    describe.each(regExpTasks)(
      '$expression',
      ({ expression, positiveExamples = [], negativeExamples = [] }) => {
        it('matches all positive examples', () => {
          const unmatchedExamples = positiveExamples.filter(
            (example) => !new RegExp(expression).test(example),
          );
          expect(
            unmatchedExamples,
            `${expression} should match all positive examples`,
          ).toEqual([]);
        });

        it('does not match any negative example', () => {
          const matchedExamples = negativeExamples.filter((example) =>
            new RegExp(expression).test(example),
          );
          expect(
            matchedExamples,
            `${expression} should not match any negative example`,
          ).toEqual([]);
        });
      },
    );
  });
});
