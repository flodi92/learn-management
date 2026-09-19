import { expect, it } from '@jest/globals';

import { Tasks } from './regex';

it.each(Tasks)(
  '$expression matches positive and rejects negative examples',
  ({ expression, positiveExamples = [], negativeExamples = [] }) => {
    positiveExamples.forEach((example) => {
      expect(expression.test(example)).toBe(true);
    });

    negativeExamples.forEach((example) => {
      expect(expression.test(example)).toBe(false);
    });
  },
);
