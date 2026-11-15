import { describe, expect, it } from 'vitest';
import { regExpTasks } from './regExp.tasks';
import { getSubjectsFromExpression } from './regExp.utils/regExp.subjects';

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

  describe('check confusedWith attribute', () => {
    describe.each(regExpTasks)('$expression', (task) => {
      it('only contains expressions of other tasks', () => {
        const otherExpressions = regExpTasks
          .filter((otherTask) => otherTask !== task)
          .map(({ expression }) => String(expression));
        const unknownExpressions = (task.confusedWith ?? []).filter(
          (confusedExpression) =>
            !otherExpressions.includes(String(confusedExpression)),
        );
        expect(
          unknownExpressions,
          `${task.expression} is confused with expressions that do not exist as expression of another task`,
        ).toEqual([]);
      });

      it('is listed in confusedWith of every task it is confused with', () => {
        const confusedExpressions = (task.confusedWith ?? []).map(String);
        const tasksNotConfusedBack = regExpTasks
          .filter(
            (otherTask) =>
              otherTask !== task &&
              confusedExpressions.includes(String(otherTask.expression)),
          )
          .filter(
            (otherTask) =>
              !(otherTask.confusedWith ?? []).some(
                (expression) => String(expression) === String(task.expression),
              ),
          );
        expect(
          tasksNotConfusedBack.map(({ expression }) => expression),
          `${task.expression} is confused with these expressions, but they are not confused with it`,
        ).toEqual([]);
      });

      it('has an example that distinguishes it from every task it is confused with', () => {
        const { positiveExamples = [], negativeExamples = [] } = task;
        const confusedExpressions = (task.confusedWith ?? []).map(String);
        const indistinguishableTasks = regExpTasks
          .filter(
            (otherTask) =>
              otherTask !== task &&
              confusedExpressions.includes(String(otherTask.expression)),
          )
          .filter(
            ({
              positiveExamples: otherPositiveExamples = [],
              negativeExamples: otherNegativeExamples = [],
            }) =>
              !positiveExamples.some((example) =>
                otherNegativeExamples.includes(example),
              ) &&
              !negativeExamples.some((example) =>
                otherPositiveExamples.includes(example),
              ),
          );
        expect(
          indistinguishableTasks.map(({ expression }) => expression),
          `${task.expression} has no positive example that is negative in, and no negative example that is positive in, these confused expressions`,
        ).toEqual([]);
      });
    });
  });

  describe('check equalTo attribute', () => {
    const getExamplesKey = (examples: string[] = []) =>
      JSON.stringify([...new Set(examples)].sort());

    describe.each(regExpTasks.filter((regExpTasks) => regExpTasks.equalTo))(
      '$expression',
      (task) => {
        it('has the same positive and negative examples as every task it is equal to', () => {
          const equalExpressions = (task.equalTo ?? []).map(String);
          const tasksWithOtherExamples = regExpTasks
            .filter(
              (otherTask) =>
                otherTask !== task &&
                equalExpressions.includes(String(otherTask.expression)),
            )
            .filter(
              (otherTask) =>
                getExamplesKey(otherTask.positiveExamples) !==
                  getExamplesKey(task.positiveExamples) ||
                getExamplesKey(otherTask.negativeExamples) !==
                  getExamplesKey(task.negativeExamples),
            );
          expect(
            tasksWithOtherExamples.map(({ expression }) => expression),
            `${task.expression} is equal to these expressions, but their positive or negative examples differ`,
          ).toEqual([]);
        });
      },
    );
  });

  describe('check subjects', () => {
    describe.each(regExpTasks)('$expression', ({ expression, subjects }) => {
      it('has the subjects contained in its expression', () => {
        expect(
          [...subjects].sort(),
          `${expression} should have exactly the subjects found in the expression`,
        ).toEqual(getSubjectsFromExpression(expression).sort());
      });
    });
  });
});
