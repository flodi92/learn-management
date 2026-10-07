// `alternative` is a readable replacement shown to the learner instead of `value`
export type RegExpExample = string | { value: string; alternative: string };

export type InitialRegExpTask = {
  expression: RegExp;
  positiveExamples?: RegExpExample[];
  negativeExamples?: RegExpExample[];
  nots?: RegExp[];
};

export interface RegExpTask extends InitialRegExpTask {
  id: string;
  parentIds: string[];
  elements: RegExpElements[];
}

interface RegExpObjectInterface {
  value: string;
  category:
    | 'characterClass'
    | 'assertion'
    | 'groupsAndBackreferences'
    | 'quantifier'
    | 'modifier';
}

const regExpElementObjects = [
  { value: '[xyz]', category: 'characterClass' },
  { value: '[^xyz]', category: 'characterClass' },
  { value: '.', category: 'characterClass' },
  { value: '\\d', category: 'characterClass' },
  { value: '\\D', category: 'characterClass' },
  { value: '\\w', category: 'characterClass' },
  { value: '\\W', category: 'characterClass' },
  { value: '\\s', category: 'characterClass' },
  { value: '\\S', category: 'characterClass' },
  { value: '\\t', category: 'characterClass' },
  { value: '\\r', category: 'characterClass' },
  { value: '\\n', category: 'characterClass' },
  { value: '\\v', category: 'characterClass' },
  { value: '\\f', category: 'characterClass' },
  { value: '[\\b]', category: 'characterClass' },
  { value: '\\0', category: 'characterClass' },
  { value: '\\cX', category: 'characterClass' },
  { value: '\\xHH', category: 'characterClass' },
  { value: '\\uHHHH', category: 'characterClass' },
  { value: '\\u{H…H}', category: 'characterClass' },
  { value: 'x|y', category: 'groupsAndBackreferences' },
  { value: '^', category: 'assertion' },
  { value: '$', category: 'assertion' },
  { value: 'anywhere', category: 'assertion' },
  { value: '\\b', category: 'assertion' },
  { value: '\\B', category: 'assertion' },
  { value: 'x(?=y)', category: 'assertion' },
  { value: 'x(?!y)', category: 'assertion' },
  { value: '(?<=y)x', category: 'assertion' },
  { value: '(?<!y)x', category: 'assertion' },
  { value: '(x)', category: 'groupsAndBackreferences' },
  { value: '(?<Name>x)', category: 'groupsAndBackreferences' },
  { value: '(?:x)', category: 'groupsAndBackreferences' },
  { value: '\\n', category: 'groupsAndBackreferences' },
  { value: '\\k<Name>', category: 'groupsAndBackreferences' },
  { value: 'x*', category: 'quantifier' },
  { value: 'x+', category: 'quantifier' },
  { value: 'x?', category: 'quantifier' },
  { value: 'x{n}', category: 'quantifier' },
  { value: 'x{n,}', category: 'quantifier' },
  { value: 'x{n,m}', category: 'quantifier' },
  { value: 'd', category: 'modifier' },
  { value: 'g', category: 'modifier' },
  { value: 'i', category: 'modifier' },
  { value: 'm', category: 'modifier' },
  { value: 's', category: 'modifier' },
  { value: 'u', category: 'modifier' },
  { value: 'v', category: 'modifier' },
  { value: 'y', category: 'modifier' },
] as const satisfies RegExpObjectInterface[];

type RegExpObjects = typeof regExpElementObjects;

type RegExpObject = RegExpObjects[number];

type RegExpElements = RegExpObject['value'];
