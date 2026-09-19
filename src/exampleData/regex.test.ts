import { expect, it } from 'vitest';

import { Tasks } from './regex';

it.each(Tasks)(
  '$expression matches positive and rejects negative examples',
  ({ expression, positiveExamples = [], negativeExamples = [] }) => {
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
  },
);
