import { describe, expect, it } from 'vitest';
import { regExpSubjectDefinitions } from './regExp.model';
import { regExpTasks } from './regExp.taskDescriptions';
import { getComplexityOfExpression } from './regExp.utils/regExp.complexity';
import { getParentExpressions } from './regExp.utils/regExp.parentIds';
import { getSubjectsFromExpression } from './regExp.utils/regExp.subjects';

describe('regExpTasks', () => {
  describe('check expressions', () => {
    it('has a unique expression for every task description', () => {
      const expressions = regExpTasks.map(({ expression }) =>
        String(expression),
      );
      const duplicateExpressions = [
        ...new Set(
          expressions.filter(
            (expression, index) => expressions.indexOf(expression) !== index,
          ),
        ),
      ];
      expect(
        duplicateExpressions,
        'expressions should be the expression of exactly one task description',
      ).toEqual([]);
    });
  });

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

        it('has at least four examples in total', () => {
          expect(
            positiveExamples.length + negativeExamples.length,
            `${expression} should have at least four positive and negative examples in total`,
          ).toBeGreaterThanOrEqual(4);
        });
      },
    );
  });

  describe('check confusedWith attribute', () => {
    it('is used by at least 75% of the task descriptions', () => {
      const numberOfTaskDescriptionsWithConfusedWith = regExpTasks.filter(
        ({ confusedWith = [] }) => confusedWith.length > 0,
      ).length;
      expect(
        numberOfTaskDescriptionsWithConfusedWith / regExpTasks.length,
        `at least 75% of the task descriptions should use confusedWith, but only ${numberOfTaskDescriptionsWithConfusedWith} of ${regExpTasks.length} do`,
      ).toBeGreaterThanOrEqual(0.75);
    });

    describe.each(regExpTasks)('$expression', (task) => {
      it('only contains expressions of other task descriptions', () => {
        const otherExpressions = regExpTasks
          .filter((otherTask) => otherTask !== task)
          .map(({ expression }) => String(expression));
        const unknownExpressions = (task.confusedWith ?? []).filter(
          (confusedExpression) =>
            !otherExpressions.includes(String(confusedExpression)),
        );
        expect(
          unknownExpressions,
          `${task.expression} is confused with expressions that do not exist as expression of another task description`,
        ).toEqual([]);
      });

      it('is listed in confusedWith of every task description it is confused with', () => {
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

      it('has an example that distinguishes it from every task description it is confused with', () => {
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
        it('has the same positive and negative examples as every task description it is equal to', () => {
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

  describe('check categories', () => {
    describe.each(regExpTasks)(
      '$expression',
      ({ expression, subjects, extraSubjects = [], categories }) => {
        it('has the categories of all its subjects', () => {
          const missingCategories = [
            ...new Set(
              [...subjects, ...extraSubjects].map(
                (subject) => regExpSubjectDefinitions[subject].category,
              ),
            ),
          ].filter((category) => !categories.includes(category));
          expect(
            missingCategories,
            `${expression} should have the categories of all its subjects and extra subjects`,
          ).toEqual([]);
        });
      },
    );
  });

  describe('check relevance', () => {
    describe.each(regExpTasks)(
      '$expression',
      ({ expression, subjects, extraSubjects = [], relevance }) => {
        it('has the maximum relevance of its subjects', () => {
          expect(
            relevance,
            `${expression} should have the maximum relevance of its subjects and extra subjects`,
          ).toBe(
            Math.max(
              ...[...subjects, ...extraSubjects].map(
                (subject) => regExpSubjectDefinitions[subject].relevance,
              ),
            ),
          );
        });
      },
    );
  });

  describe('check complexity', () => {
    describe.each(regExpTasks)('$expression', ({ expression, complexity }) => {
      it('has the complexity of its expression', () => {
        expect(
          complexity,
          `${expression} should have the complexity of its expression`,
        ).toBe(getComplexityOfExpression(expression));
      });
    });
  });

  describe('check parentRegExps', () => {
    describe.each(regExpTasks)('$expression', (task) => {
      it('has the parents derived from its subjects', () => {
        expect(
          task.parentRegExps.map(String).sort(),
          `${task.expression} should have exactly the parents found among the task descriptions`,
        ).toEqual(getParentExpressions(task, regExpTasks).map(String).sort());
      });
    });
  });
});
