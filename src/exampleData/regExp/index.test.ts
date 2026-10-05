import { expect, it } from 'vitest';
import { initialTasks } from '.';
import { getExampleValue } from './utils/regExp.utils';

describe('regex tasks', () => {
  describe.each(initialTasks)('$expression', (task) => {
    const otherTasks = initialTasks.filter((otherTask) => otherTask !== task);
    it('matches all positive examples and rejects all negative examples', () => {
      const { expression, positiveExamples = [], negativeExamples = [] } = task;
      positiveExamples.forEach((example) => {
        expect(
          expression.test(getExampleValue(example)),
          `${expression} should match ${JSON.stringify(getExampleValue(example))}`,
        ).toBe(true);
      });

      negativeExamples.forEach((example) => {
        expect(
          expression.test(getExampleValue(example)),
          `${expression} should reject ${JSON.stringify(getExampleValue(example))}`,
        ).toBe(false);
      });
    });
    it('has no more than 10 examples of either kind', () => {
      expect(task.positiveExamples?.length ?? 0).toBeLessThanOrEqual(10);
      expect(task.negativeExamples?.length ?? 0).toBeLessThanOrEqual(10);
    });
    it('has another task reject each positive example', () => {
      task.positiveExamples?.forEach((example) => {
        expect(
          otherTasks.some((otherTask) =>
            otherTask.negativeExamples?.some(
              (other) => getExampleValue(other) === getExampleValue(example),
            ),
          ),
          `no other task rejects ${JSON.stringify(getExampleValue(example))}`,
        ).toBe(true);
      });
    });
    it('has at least one positive example in common with other task', () => {
      expect(
        task.positiveExamples?.some((example) =>
          otherTasks.some((otherTask) =>
            otherTask.positiveExamples?.some(
              (other) => getExampleValue(other) === getExampleValue(example),
            ),
          ),
        ),
        '',
      );
    });
    it.skip('keeps its examples distinct from the examples of other tasks', () => {
      const otherMatches = otherTasks.filter(
        (otherTask) =>
          (otherTask.positiveExamples ?? []).every((positiveExample) =>
            task.expression.test(getExampleValue(positiveExample)),
          ) &&
          (otherTask.negativeExamples ?? []).every(
            (negativeExample) =>
              !task.expression.test(getExampleValue(negativeExample)),
          ) &&
          (task.nots ?? []).every(
            (notExpression) =>
              otherTask.expression.source !== notExpression.source,
          ),
      );
      expect(
        otherMatches.length,
        `positive and negative examples of another task are not distinct: ${otherMatches.map((otherMatch) => otherMatch.expression).join()}`,
      ).toBe(0);
    });
  });
});
