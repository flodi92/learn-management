type RegexTask = {
  id?: string;
  parentIds?: string;
  expression: RegExp;
  positiveExamples?: string[];
  negativeExamples?: string[];
  nots?: RegExp[];
};

export const tasks: RegexTask[] = [
  {
    expression: /^.$/,
    positiveExamples: ['a', '1', '!'],
    negativeExamples: ['', 'aa', '\n'],
  },
  {
    expression: /^a$/,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'A', 'aa', ''],
  },
  {
    expression: /^\s$/,
    positiveExamples: [' ', '\n', '\t'],
    negativeExamples: ['a', '1', '!'],
  },
  {
    expression: /^\d$/,
    positiveExamples: ['0', '1', '5'],
    negativeExamples: ['a', ' ', '_'],
  },
  {
    expression: /^\w$/,
    positiveExamples: ['a', '7', '_'],
    negativeExamples: ['!', '-', ' '],
    nots: [/^.$/],
  },
  {
    expression: /^\W$/,
    positiveExamples: ['!', '%', '\n'],
    negativeExamples: ['a', '7', '_'],
  },
  {
    expression: /^a+$/,
    positiveExamples: ['a', 'aaa'],
    negativeExamples: ['', 'b', 'aaab'],
  },
  {
    expression: /^(abc)+$/,
    positiveExamples: ['abc', 'abcabc'],
    negativeExamples: ['', 'ab', 'cba', 'abcab'],
  },
  {
    expression: /^a*$/,
    positiveExamples: ['', 'a', 'aaa'],
    negativeExamples: ['b', 'aaab'],
  },
  {
    expression: /^(abc)*$/,
    positiveExamples: ['', 'abc', 'abcabc'],
    negativeExamples: ['ab', 'cba', 'abcab'],
  },
];
