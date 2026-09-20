type RegexTask = {
  id?: string;
  parentIds?: string;
  expression: RegExp;
  positiveExamples?: string[];
  negativeExamples?: string[];
  nots?: RegExp[];
};

export const Tasks: RegexTask[] = [
  {
    expression: /^.$/,
    positiveExamples: ['a', '1'],
    negativeExamples: ['aa', '', '\n'],
  },
  {
    expression: /^a$/,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'A', 'aa'],
  },
  {
    expression: /^\s$/,
    positiveExamples: [' ', '\n', '\t'],
    negativeExamples: ['a', '123'],
  },
  {
    expression: /^\d$/,
    positiveExamples: ['1', '5'],
    negativeExamples: ['a', 's'],
  },
  {
    expression: /^\w$/,
    positiveExamples: ['a', '7'],
    negativeExamples: ['!', '-'],
    nots: [/^.$/],
  },
  {
    expression: /^\W$/,
    positiveExamples: ['!', '%', '\n'],
    negativeExamples: ['a', '7'],
    nots: [/^\s$/],
  },
  {
    expression: /^a+$/,
    positiveExamples: ['a', 'aaa'],
    negativeExamples: ['', 'b'],
  },
  {
    expression: /^(abc)+$/,
    positiveExamples: ['abc', 'abcabc'],
    negativeExamples: ['', 'ab', 'ac'],
  },
  {
    expression: /^a*$/,
    positiveExamples: ['', 'a', 'aaa'],
    negativeExamples: ['b'],
  },
  {
    expression: /^(abc)*$/,
    positiveExamples: ['', 'abcabc'],
    negativeExamples: ['ab', 'cba'],
  },
];
