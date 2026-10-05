import { InitialRegExpTask } from './regExp.model';

const simpleExpressionsCharacterClasses: InitialRegExpTask[] = [
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
    positiveExamples: [
      'a',
      '1',
      '!',
      { value: '\b', alternative: 'backspace' },
      { value: '\0', alternative: 'null character' },
      { value: '\x01', alternative: 'control character U+0001' },
      { value: '\v', alternative: 'vertical tab' },
      { value: '\f', alternative: 'form feed' },
    ],
    negativeExamples: ['', 'aa', { value: '\n', alternative: 'newline' }],
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
    positiveExamples: [
      ' ',
      { value: '\n', alternative: 'newline' },
      { value: '\t', alternative: 'tab' },
    ],
    negativeExamples: ['a', '1', '!'],
  },
  {
    expression: /^\d$/,
    positiveExamples: ['0', '1'],
    negativeExamples: [
      'a',
      ' ',
      '_',
      { value: '\b', alternative: 'backspace' },
      { value: '\0', alternative: 'null character' },
      { value: '\x01', alternative: 'control character U+0001' },
      { value: '\v', alternative: 'vertical tab' },
      { value: '\f', alternative: 'form feed' },
      '😀',
    ],
  },
  {
    expression: /^\w$/,
    positiveExamples: ['a', '7', '_'],
    negativeExamples: ['!', '-', ' '],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^\W$/,
    positiveExamples: ['!', { value: '\n', alternative: 'newline' }],
    negativeExamples: ['a', '7', '_'],
    nots: [/^\0$/],
  },
  {
    expression: /^\D$/,
    positiveExamples: ['a', '!', { value: '\n', alternative: 'newline' }],
    negativeExamples: ['0', '5'],
    nots: [/^\0$/, /^\ba\b$/],
  },
  {
    expression: /^\S$/,
    positiveExamples: ['a', '!'],
    negativeExamples: [
      ' ',
      { value: '\n', alternative: 'newline' },
      { value: '\t', alternative: 'tab' },
    ],
    nots: [/^\ba\b$/],
  },
  {
    expression: /^\t$/,
    positiveExamples: [{ value: '\t', alternative: 'tab' }],
    negativeExamples: [' ', { value: '\n', alternative: 'newline' }, 't'],
  },
  {
    expression: /^\r$/,
    positiveExamples: [{ value: '\r', alternative: 'carriage return' }],
    negativeExamples: [{ value: '\n', alternative: 'newline' }, 'r', ' '],
  },
  {
    expression: /^\n$/,
    positiveExamples: [{ value: '\n', alternative: 'newline' }],
    negativeExamples: [
      { value: '\r', alternative: 'carriage return' },
      'n',
      ' ',
    ],
  },
  {
    expression: /^\v$/,
    positiveExamples: [{ value: '\v', alternative: 'vertical tab' }],
    negativeExamples: [{ value: '\n', alternative: 'newline' }, 'v', ' '],
  },
  {
    expression: /^\f$/,
    positiveExamples: [{ value: '\f', alternative: 'form feed' }],
    negativeExamples: [{ value: '\n', alternative: 'newline' }, 'f', ' '],
  },
  {
    expression: /^[\b]$/,
    positiveExamples: [{ value: '\b', alternative: 'backspace' }],
    negativeExamples: ['b', ' ', ''],
  },
  {
    expression: /^\0$/,
    positiveExamples: [{ value: '\0', alternative: 'null character' }],
    negativeExamples: ['0', '\\0', ''],
  },
  {
    expression: /^\cA$/,
    positiveExamples: [
      { value: '\x01', alternative: 'control character U+0001' },
    ],
    negativeExamples: [
      'A',
      { value: '\x02', alternative: 'control character U+0002' },
      '',
    ],
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
    positiveExamples: ['x'],
    negativeExamples: ['z', 'xy', ''],
    nots: [/^[\s\S]*$/],
  },
];

const simpleExpressionsAssertions: InitialRegExpTask[] = [
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
    negativeExamples: ['ac', 'a', 'ba', 'aab'],
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

const simpleExpressionsGroups: InitialRegExpTask[] = [
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

const simpleExpressionsQuantifiers: InitialRegExpTask[] = [
  {
    expression: /^a+$/,
    positiveExamples: ['a', 'aaa'],
    negativeExamples: [
      '',
      'b',
      'aaab',
      'abcabc',
      { value: 'a\nb', alternative: 'a<newline>b' },
      { value: 'x\na\ny', alternative: 'x<newline>a<newline>y' },
    ],
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

const simpleExpressionsModifiers: InitialRegExpTask[] = [
  {
    expression: /^abc$/i,
    positiveExamples: ['ABC', 'abc'],
    negativeExamples: ['abd', 'ab', ''],
  },
  {
    expression: /^a.b$/s,
    positiveExamples: [{ value: 'a\nb', alternative: 'a<newline>b' }],
    negativeExamples: [
      'ab',
      { value: 'a\nb\n', alternative: 'a<newline>b<newline>' },
      'ac',
    ],
  },
  {
    expression: /^a$/m,
    positiveExamples: [
      { value: 'x\na\ny', alternative: 'x<newline>a<newline>y' },
    ],
    negativeExamples: [
      { value: 'x\nb\ny', alternative: 'x<newline>b<newline>y' },
      'ba',
      '',
    ],
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

const simpleExpressionsTestContract: InitialRegExpTask[] = [
  {
    expression: /^[\s\S]*$/,
    positiveExamples: ['x', 'A', { value: '\n', alternative: 'newline' }, '0'],
  },
  {
    expression: /^__regex_task_rejector__$/,
    positiveExamples: ['__regex_task_rejector__'],
    negativeExamples: [
      'x',
      'z',
      'y',
      '%',
      'a',
      '0',
      '1',
      '!',
      { value: '\n', alternative: 'newline' },
      'A',
    ],
  },
];

export const simpleExpressions: InitialRegExpTask[] = [
  ...simpleExpressionsCharacterClasses,
  ...simpleExpressionsAssertions,
  ...simpleExpressionsGroups,
  ...simpleExpressionsQuantifiers,
  ...simpleExpressionsModifiers,
  ...simpleExpressionsTestContract,
];
