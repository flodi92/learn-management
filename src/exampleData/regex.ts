type RegexTask = {
  id?: string;
  parentIds?: string;
  expression: RegExp;
  positiveExamples?: string[];
  negativeExamples?: string[];
};

export const Tasks: RegexTask[] = [
  {
    expression: /./,
    positiveExamples: ['a', '1'],
    negativeExamples: ['', '\n'],
  },
  {
    expression: /a/,
    positiveExamples: ['a', 'apple'],
    negativeExamples: ['b', 'cloud'],
  },
  {
    expression: /\d/,
    positiveExamples: ['1', '42'],
    negativeExamples: ['abc', 'seven'],
  },
  {
    expression: /\s/,
    positiveExamples: [' ', 'hello world'],
    negativeExamples: ['abc', '123'],
  },
  {
    expression: /\w/,
    positiveExamples: ['a', '7'],
    negativeExamples: ['!', '-'],
  },
  {
    expression: /\W/,
    positiveExamples: ['!', 'hello world'],
    negativeExamples: ['a', '7'],
  },
  {
    expression: /a+/,
    positiveExamples: ['a', 'aaa'],
    negativeExamples: ['', 'b'],
  },
  {
    expression: /(abc)+/,
    positiveExamples: ['abc', 'abcabc'],
    negativeExamples: ['', 'ab', 'ac'],
  },
  {
    expression: /a*/,
    positiveExamples: ['', 'aaa'],
    // negativeExamples: ['b'],
  },
  {
    expression: /(abc)*/,
    positiveExamples: ['', 'abcabc'],
    // negativeExamples: ['ab', 'cba'],
  },
];
