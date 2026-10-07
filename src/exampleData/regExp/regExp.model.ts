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
  elements: RegExpElement[];
}

export const regExpCategories = [
  'characterClass',
  'assertion',
  'groupsAndBackreferences',
  'quantifier',
  'modifier',
] as const;

export type RegExpCategory = (typeof regExpCategories)[number];

export const regExpPriorities = [1, 2, 3] as const;

export type RegExpPriority = (typeof regExpPriorities)[number];

export interface RegExpObjectInterface {
  value: string;
  category: RegExpCategory;
  priority: RegExpPriority;
}

export const regExpObjects = [
  { value: '[xyz]', category: 'characterClass', priority: 1 },
  { value: '[^xyz]', category: 'characterClass', priority: 2 },
  { value: '.', category: 'characterClass', priority: 1 },
  { value: '\\d', category: 'characterClass', priority: 1 },
  { value: '\\D', category: 'characterClass', priority: 2 },
  { value: '\\w', category: 'characterClass', priority: 1 },
  { value: '\\W', category: 'characterClass', priority: 2 },
  { value: '\\s', category: 'characterClass', priority: 1 },
  { value: '\\S', category: 'characterClass', priority: 2 },
  { value: '\\t', category: 'characterClass', priority: 2 },
  { value: '\\r', category: 'characterClass', priority: 2 },
  { value: '\\n', category: 'characterClass', priority: 2 },
  { value: '\\v', category: 'characterClass', priority: 3 },
  { value: '\\f', category: 'characterClass', priority: 3 },
  { value: '[\\b]', category: 'characterClass', priority: 3 },
  { value: '\\0', category: 'characterClass', priority: 3 },
  { value: '\\cX', category: 'characterClass', priority: 3 },
  { value: '\\xHH', category: 'characterClass', priority: 3 },
  { value: '\\uHHHH', category: 'characterClass', priority: 3 },
  { value: '\\u{H…H}', category: 'characterClass', priority: 3 },
  { value: 'x|y', category: 'groupsAndBackreferences', priority: 1 },
  { value: '^', category: 'assertion', priority: 1 },
  { value: '$', category: 'assertion', priority: 1 },
  { value: 'anywhere', category: 'assertion', priority: 1 },
  { value: '\\b', category: 'assertion', priority: 2 },
  { value: '\\B', category: 'assertion', priority: 3 },
  { value: 'x(?=y)', category: 'assertion', priority: 3 },
  { value: 'x(?!y)', category: 'assertion', priority: 3 },
  { value: '(?<=y)x', category: 'assertion', priority: 3 },
  { value: '(?<!y)x', category: 'assertion', priority: 3 },
  { value: '(x)', category: 'groupsAndBackreferences', priority: 1 },
  { value: '(?<Name>x)', category: 'groupsAndBackreferences', priority: 3 },
  { value: '(?:x)', category: 'groupsAndBackreferences', priority: 2 },
  { value: '\\n', category: 'groupsAndBackreferences', priority: 2 },
  { value: '\\k<Name>', category: 'groupsAndBackreferences', priority: 3 },
  { value: 'x*', category: 'quantifier', priority: 1 },
  { value: 'x+', category: 'quantifier', priority: 1 },
  { value: 'x?', category: 'quantifier', priority: 1 },
  { value: 'x{n}', category: 'quantifier', priority: 2 },
  { value: 'x{n,}', category: 'quantifier', priority: 2 },
  { value: 'x{n,m}', category: 'quantifier', priority: 2 },
  { value: 'd', category: 'modifier', priority: 3 },
  { value: 'g', category: 'modifier', priority: 1 },
  { value: 'i', category: 'modifier', priority: 1 },
  { value: 'm', category: 'modifier', priority: 2 },
  { value: 's', category: 'modifier', priority: 2 },
  { value: 'u', category: 'modifier', priority: 3 },
  { value: 'v', category: 'modifier', priority: 3 },
  { value: 'y', category: 'modifier', priority: 3 },
] as const satisfies RegExpObjectInterface[];

export type RegExpObjects = typeof regExpObjects;

export type RegExpObject = RegExpObjects[number];

export type RegExpElement = RegExpObject['value'];
