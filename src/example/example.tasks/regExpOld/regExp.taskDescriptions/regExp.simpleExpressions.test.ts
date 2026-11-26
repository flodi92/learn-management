import { expect, it } from 'vitest';
import { simpleExpressions } from './regExp.simpleExpressions';
import { getExampleValue } from '../regExp.utils/regExp.utils';

describe('regex taskDescriptions', () => {
  describe.each(simpleExpressions)('$expression', (taskDescription) => {
    const otherTaskDescriptions = simpleExpressions.filter(
      (otherTaskDescription) => otherTaskDescription !== taskDescription,
    );
    it('keeps its examples distinct from the examples of other taskDescriptions', () => {
      const otherMatches = otherTaskDescriptions.filter(
        (otherTaskDescription) =>
          (otherTaskDescription.positiveExamples ?? []).every(
            (positiveExample) =>
              taskDescription.expression.test(getExampleValue(positiveExample)),
          ) &&
          (otherTaskDescription.negativeExamples ?? []).every(
            (negativeExample) =>
              !taskDescription.expression.test(
                getExampleValue(negativeExample),
              ),
          ) &&
          (taskDescription.nots ?? []).every(
            (notExpression) =>
              otherTaskDescription.expression.source !== notExpression.source,
          ),
      );
      expect(
        otherMatches.length,
        `positive and negative examples of another taskDescription are not distinct: ${otherMatches.map((otherMatch) => otherMatch.expression).join()}`,
      ).toBe(0);
    });
  });
});
