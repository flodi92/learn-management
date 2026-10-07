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
  category: RegExpCategory;
  priority: RegExpPriority;
}

export const regExpObjects = {
  ['[xyz]']: { category: 'characterClass', priority: 1 },
  ['[^xyz]']: { category: 'characterClass', priority: 2 },
  ['.']: { category: 'characterClass', priority: 1 },
  ['\\d']: { category: 'characterClass', priority: 1 },
  ['\\D']: { category: 'characterClass', priority: 2 },
  ['\\w']: { category: 'characterClass', priority: 1 },
  ['\\W']: { category: 'characterClass', priority: 2 },
  ['\\s']: { category: 'characterClass', priority: 1 },
  ['\\S']: { category: 'characterClass', priority: 2 },
  ['\\t']: { category: 'characterClass', priority: 2 },
  ['\\r']: { category: 'characterClass', priority: 2 },
  ['\\n']: { category: 'characterClass', priority: 2 },
  ['\\v']: { category: 'characterClass', priority: 3 },
  ['\\f']: { category: 'characterClass', priority: 3 },
  ['[\\b]']: { category: 'characterClass', priority: 3 },
  ['\\0']: { category: 'characterClass', priority: 3 },
  ['\\cX']: { category: 'characterClass', priority: 3 },
  ['\\xHH']: { category: 'characterClass', priority: 3 },
  ['\\uHHHH']: { category: 'characterClass', priority: 3 },
  ['\\u{H…H}']: { category: 'characterClass', priority: 3 },
  ['x|y']: { category: 'groupsAndBackreferences', priority: 1 },
  ['^']: { category: 'assertion', priority: 1 },
  ['$']: { category: 'assertion', priority: 1 },
  ['anywhere']: { category: 'assertion', priority: 1 },
  ['\\b']: { category: 'assertion', priority: 2 },
  ['\\B']: { category: 'assertion', priority: 3 },
  ['x(?=y)']: { category: 'assertion', priority: 3 },
  ['x(?!y)']: { category: 'assertion', priority: 3 },
  ['(?<=y)x']: { category: 'assertion', priority: 3 },
  ['(?<!y)x']: { category: 'assertion', priority: 3 },
  ['(x)']: { category: 'groupsAndBackreferences', priority: 1 },
  ['(?<Name>x)']: { category: 'groupsAndBackreferences', priority: 3 },
  ['(?:x)']: { category: 'groupsAndBackreferences', priority: 2 },
  ['\\k<Name>']: { category: 'groupsAndBackreferences', priority: 3 },
  ['x*']: { category: 'quantifier', priority: 1 },
  ['x+']: { category: 'quantifier', priority: 1 },
  ['x?']: { category: 'quantifier', priority: 1 },
  ['x{n}']: { category: 'quantifier', priority: 2 },
  ['x{n,}']: { category: 'quantifier', priority: 2 },
  ['x{n,m}']: { category: 'quantifier', priority: 2 },
  ['d']: { category: 'modifier', priority: 3 },
  ['g']: { category: 'modifier', priority: 1 },
  ['i']: { category: 'modifier', priority: 1 },
  ['m']: { category: 'modifier', priority: 2 },
  ['s']: { category: 'modifier', priority: 2 },
  ['u']: { category: 'modifier', priority: 3 },
  ['v']: { category: 'modifier', priority: 3 },
  ['y']: { category: 'modifier', priority: 3 },
} as const satisfies Record<string, RegExpObjectInterface>;

export type RegExpObjects = typeof regExpObjects;

export type RegExpElement = keyof RegExpObjects;

export type RegExpObject = RegExpObjects[RegExpElement];
