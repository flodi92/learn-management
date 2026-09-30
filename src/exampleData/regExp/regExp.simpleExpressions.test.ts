import { expect, it } from 'vitest';
import { simpleExpressions } from './regExp.simpleExpressions';

describe('regex tasks', () => {
  describe.each(simpleExpressions)('$expression', (task) => {
    const otherTasks = simpleExpressions.filter(
      (otherTask) => otherTask !== task,
    );
    it('keeps its examples distinct from the examples of other tasks', () => {
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
