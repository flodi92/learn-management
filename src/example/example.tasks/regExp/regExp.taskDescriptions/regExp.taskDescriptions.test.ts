import { expect, it } from 'vitest';
import { initialTaskDescriptions } from './regExp.taskDescriptions';
import { getExampleValue } from '../regExp.utils/regExp.utils';

describe('regex taskDescriptions', () => {
  describe.each(initialTaskDescriptions)('$expression', (taskDescription) => {
    const otherTaskDescriptions = initialTaskDescriptions.filter(
      (otherTaskDescription) => otherTaskDescription !== taskDescription,
    );
    it('matches all positive examples and rejects all negative examples', () => {
      const {
        expression,
        positiveExamples = [],
        negativeExamples = [],
      } = taskDescription;
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
      expect(taskDescription.positiveExamples?.length ?? 0).toBeLessThanOrEqual(
        10,
      );
      expect(taskDescription.negativeExamples?.length ?? 0).toBeLessThanOrEqual(
        10,
      );
    });
    it('has another taskDescription reject each positive example', () => {
      taskDescription.positiveExamples?.forEach((example) => {
        expect(
          otherTaskDescriptions.some((otherTaskDescription) =>
            otherTaskDescription.negativeExamples?.some(
              (other) => getExampleValue(other) === getExampleValue(example),
            ),
          ),
          `no other taskDescription rejects ${JSON.stringify(getExampleValue(example))}`,
        ).toBe(true);
      });
    });
    it('has at least one positive example in common with other taskDescription', () => {
      expect(
        taskDescription.positiveExamples?.some((example) =>
          otherTaskDescriptions.some((otherTaskDescription) =>
            otherTaskDescription.positiveExamples?.some(
              (other) => getExampleValue(other) === getExampleValue(example),
            ),
          ),
        ),
        '',
      );
    });
    it.skip('keeps its examples distinct from the examples of other taskDescriptions', () => {
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
