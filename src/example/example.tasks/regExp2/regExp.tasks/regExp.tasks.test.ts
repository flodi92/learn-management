import { describe, expect, it } from 'vitest';
import { regExpTasks } from './regExp.tasks';

describe('regExpTasks', () => {
  describe('check examples', () => {
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

        it('has at least one positive example', () => {
          expect(
            positiveExamples.length,
            `${expression} should have at least one positive example`,
          ).toBeGreaterThanOrEqual(1);
        });

        it('has at least one negative example', () => {
          expect(
            negativeExamples.length,
            `${expression} should have at least one negative example`,
          ).toBeGreaterThanOrEqual(1);
        });
      },
    );
  });
});
