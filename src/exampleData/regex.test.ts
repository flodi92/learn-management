import { expect, it } from 'vitest';

import { tasks } from './regex';

describe('regex tasks', () => {
  describe.each(tasks)('$expression', (task) => {
    it('matches all positive examples and rejects all negative examples', () => {
      const { expression, positiveExamples = [], negativeExamples = [] } = task;
      positiveExamples.forEach((example) => {
        expect(
          expression.test(example),
          `${expression} should match ${JSON.stringify(example)}`,
        ).toBe(true);
      });

      negativeExamples.forEach((example) => {
        expect(
          expression.test(example),
          `${expression} should reject ${JSON.stringify(example)}`,
        ).toBe(false);
      });
    });
    it('keeps its examples distinct from the examples of other tasks', () => {
      const otherTasks = tasks.filter((otherTask) => otherTask !== task);

      const otherMatches = otherTasks.filter(
        (otherTask) =>
          (otherTask.positiveExamples ?? []).every((positiveExample) =>
            task.expression.test(positiveExample),
          ) &&
          (otherTask.negativeExamples ?? []).every(
            (negativeExample) => !task.expression.test(negativeExample),
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
