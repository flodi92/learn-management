type RegexTask = {
  id?: string;
  parentIds?: string;
  expression: RegExp;
  positiveExamples?: string[];
  negativeExamples?: string[];
  nots?: RegExp[];
};

const simpleExpressionsCharacterClasses: RegexTask[] = [
  {
    expression: /^[xyz]$/,
    positiveExamples: ['x', 'z'],
    negativeExamples: ['a', 'xy', ''],
  },
  {
    nots: [/^\ba\b$/],
    expression: /^[^xyz]$/,
    positiveExamples: ['a', '0'],
    negativeExamples: ['x', 'z', ''],
  },
  {
    expression: /^.$/,
    positiveExamples: ['a', '1', '!', '\b', '\0', '\x01', '\v', '\f'],
    negativeExamples: ['', 'aa', '\n'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^a$/,
    positiveExamples: ['a'],
    negativeExamples: [
      'b',
      'A',
      'aa',
      '',
      '__regex_task_rejector__',
      'ABC',
      'hello',
      'abc',
      '_a_',
      'a1',
    ],
    nots: [
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/g,
      /^a$/y,
    ],
  },
  {
    expression: /^\s$/,
    positiveExamples: [' ', '\n', '\t'],
    negativeExamples: ['a', '1', '!'],
  },
  {
    expression: /^\d$/,
    positiveExamples: ['0', '1', '5'],
    negativeExamples: ['a', ' ', '_', '\b', '\0', '\x01', '\v', '\f', '😀'],
  },
  {
    expression: /^\w$/,
    positiveExamples: ['a', '7', '_'],
    negativeExamples: ['!', '-', ' '],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^\W$/,
    positiveExamples: ['!', '%', '\n'],
    negativeExamples: ['a', '7', '_'],
    nots: [/^\0$/],
  },
  {
    expression: /^\D$/,
    positiveExamples: ['a', '!', '\n'],
    negativeExamples: ['0', '5'],
    nots: [/^\0$/, /^\ba\b$/],
  },
  {
    expression: /^\S$/,
    positiveExamples: ['a', '!'],
    negativeExamples: [' ', '\n', '\t'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^\t$/,
    positiveExamples: ['\t'],
    negativeExamples: [' ', '\n', 't'],
  },
  {
    expression: /^\r$/,
    positiveExamples: ['\r'],
    negativeExamples: ['\n', 'r', ' '],
  },
  {
    expression: /^\n$/,
    positiveExamples: ['\n'],
    negativeExamples: ['\r', 'n', ' '],
  },
  {
    expression: /^\v$/,
    positiveExamples: ['\v'],
    negativeExamples: ['\n', 'v', ' '],
  },
  {
    expression: /^\f$/,
    positiveExamples: ['\f'],
    negativeExamples: ['\n', 'f', ' '],
  },
  {
    expression: /^[\b]$/,
    positiveExamples: ['\b'],
    negativeExamples: ['b', ' ', ''],
  },
  {
    expression: /^\0$/,
    positiveExamples: ['\0'],
    negativeExamples: ['0', '\\0', ''],
  },
  {
    expression: /^\cA$/,
    positiveExamples: ['\x01'],
    negativeExamples: ['A', '\x02', ''],
  },
  {
    expression: /^\x41$/,
    positiveExamples: ['A'],
    negativeExamples: ['a', 'B', ''],
    nots: [/^\u0041$/],
  },
  {
    expression: /^\u0041$/,
    positiveExamples: ['A'],
    negativeExamples: ['a', 'B', ''],
    nots: [/^\x41$/],
  },
  {
    expression: /^\u{1F600}$/u,
    positiveExamples: ['😀'],
    negativeExamples: ['A', '😃', ''],
  },
  {
    expression: /^(x|y)$/,
    positiveExamples: ['x', 'y'],
    negativeExamples: ['z', 'xy', ''],
    nots: [/^[\s\S]*$/],
  },
];

const simpleExpressionsAssertions: RegexTask[] = [
  {
    expression: /^a/,
    positiveExamples: ['abc', 'a'],
    negativeExamples: ['ba', ''],
  },
  {
    expression: /a$/,
    positiveExamples: ['a', 'cba'],
    negativeExamples: ['ab', ''],
    nots: [/^a+$/],
  },
  {
    expression: /^\ba\b$/,
    positiveExamples: ['a'],
    negativeExamples: ['ba', 'ab', 'a a'],
    nots: [/^a$/, /^(a)$/, /^(?<letter>a)$/, /^(?:a)$/, /^a$/d, /^a$/g, /^a$/y],
  },
  {
    expression: /^_\Ba\B_$/,
    positiveExamples: ['_a_'],
    negativeExamples: ['a', ' a ', 'ab'],
  },
  {
    expression: /^a(?=b)\w$/,
    positiveExamples: ['ab'],
    negativeExamples: ['ac', 'a', 'ba'],
  },
  {
    expression: /^a(?!b).$/,
    positiveExamples: ['ac', 'a1'],
    negativeExamples: ['ab', 'a', 'ba'],
    nots: [/^(a)\1$/, /^(?<letter>a)\k<letter>$/, /^a{2}$/],
  },
  {
    expression: /(?<=b)a$/,
    positiveExamples: ['ba'],
    negativeExamples: ['a', 'ca', 'ab'],
  },
  {
    expression: /(?<!b)a$/,
    positiveExamples: ['a', 'ca'],
    negativeExamples: ['ba', 'ab'],
    nots: [/^a+$/],
  },
];

const simpleExpressionsGroups: RegexTask[] = [
  {
    expression: /^(a)$/,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/g,
      /^a$/y,
    ],
  },
  {
    expression: /^(?<letter>a)$/,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [/^a$/, /^\ba\b$/, /^(a)$/, /^(?:a)$/, /^a$/d, /^a$/g, /^a$/y],
  },
  {
    expression: /^(?:a)$/,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [/^a$/, /^\ba\b$/, /^(a)$/, /^(?<letter>a)$/, /^a$/d, /^a$/g, /^a$/y],
  },
  {
    expression: /^(a)\1$/,
    positiveExamples: ['aa'],
    negativeExamples: ['a', 'ab', 'aaa'],
    nots: [/^a{2}$/, /^(?<letter>a)\k<letter>$/],
  },
  {
    expression: /^(?<letter>a)\k<letter>$/,
    positiveExamples: ['aa'],
    negativeExamples: ['a', 'ab', 'aaa'],
    nots: [/^a{2}$/, /^(a)\1$/],
  },
];

const simpleExpressionsQuantifiers: RegexTask[] = [
  {
    expression: /^a+$/,
    positiveExamples: ['a', 'aaa'],
    negativeExamples: ['', 'b', 'aaab', 'abcabc', 'a\nb', 'x\na\ny'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^(abc)+$/,
    positiveExamples: ['abc', 'abcabc'],
    negativeExamples: ['', 'ab', 'cba'],
  },
  {
    expression: /^a*$/,
    positiveExamples: ['', 'a', 'aaa'],
    negativeExamples: ['b', 'aaab', 'abcabc'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^(abc)*$/,
    positiveExamples: ['', 'abc', 'abcabc'],
    negativeExamples: ['ab', 'cba'],
  },
  {
    expression: /^a?$/,
    positiveExamples: ['', 'a'],
    negativeExamples: ['aa', 'b', 'ab'],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^a{2}$/,
    positiveExamples: ['aa'],
    negativeExamples: ['a', 'aaa', ''],
    nots: [/^(a)\1$/, /^(?<letter>a)\k<letter>$/],
  },
  {
    expression: /^a{2,}$/,
    positiveExamples: ['aa', 'aaa'],
    negativeExamples: ['', 'a', 'ab'],
  },
  {
    expression: /^a{2,3}$/,
    positiveExamples: ['aa', 'aaa'],
    negativeExamples: ['', 'a', 'aaaa'],
    nots: [/^a{2,}$/],
  },
];

const simpleExpressionsModifiers: RegexTask[] = [
  {
    expression: /^abc$/i,
    positiveExamples: ['ABC', 'abc'],
    negativeExamples: ['abd', 'ab', ''],
  },
  {
    expression: /^a.b$/s,
    positiveExamples: ['a\nb'],
    negativeExamples: ['ab', 'a\nb\n', 'ac'],
  },
  {
    expression: /^a$/m,
    positiveExamples: ['x\na\ny'],
    negativeExamples: ['x\nb\ny', 'ba', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/g,
      /^a$/y,
    ],
  },
  {
    expression: /^.$/u,
    positiveExamples: ['😀', 'a'],
    negativeExamples: ['', '😀😀'],
    nots: [/^.$/, /^\ba\b$/],
  },
  {
    expression: /^[\p{ASCII}&&\p{Letter}]+$/v,
    positiveExamples: ['ABC', 'hello'],
    negativeExamples: ['123', 'ä', '', 'abc123'],
  },
  {
    expression: /^a$/d,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/g,
      /^a$/y,
    ],
  },
  {
    expression: /^a$/g,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/y,
    ],
  },
  {
    expression: /^a$/y,
    positiveExamples: ['a'],
    negativeExamples: ['b', 'aa', ''],
    nots: [
      /^a$/,
      /^\ba\b$/,
      /^(a)$/,
      /^(?<letter>a)$/,
      /^(?:a)$/,
      /^a$/d,
      /^a$/g,
    ],
  },
];

const simpleExpressionsTestContract: RegexTask[] = [
  {
    expression: /^[\s\S]*$/,
    positiveExamples: ['x', 'z', 'y', '%', 'a', '0', '1', '!', '\n', 'A'],
  },
  {
    expression: /^__regex_task_rejector__$/,
    positiveExamples: ['__regex_task_rejector__'],
    negativeExamples: ['x', 'z', 'y', '%', 'a', '0', '1', '!', '\n', 'A'],
  },
];

export const tasks: RegexTask[] = [
  ...simpleExpressionsCharacterClasses,
  ...simpleExpressionsAssertions,
  ...simpleExpressionsGroups,
  ...simpleExpressionsQuantifiers,
  ...simpleExpressionsModifiers,
  ...simpleExpressionsTestContract,
];
