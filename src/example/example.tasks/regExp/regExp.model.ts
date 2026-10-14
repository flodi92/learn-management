import { Task } from '../../../model';

// `alternative` is a readable replacement shown to the learner instead of `value`
export type RegExpExample = string | { value: string; alternative: string };

export type InitialRegExpTask = {
  expression: RegExp;
  positiveExamples?: RegExpExample[];
  negativeExamples?: RegExpExample[];
  nots?: RegExp[];
};

export interface RegExpTask extends InitialRegExpTask, Required<Task> {
  id: string;
  elements: RegExpElement[];
  categories: RegExpCategory[];
  relevance: RegExpRelevance;
}

export const regExpCategories = [
  'characterClass',
  'assertion',
  'groupsAndBackreferences',
  'quantifier',
  'modifier',
] as const;

export type RegExpCategory = (typeof regExpCategories)[number];

export const regExpRelevances = [1, 2, 3] as const;

export type RegExpRelevance = (typeof regExpRelevances)[number];

export interface RegExpObjectInterface {
  category: RegExpCategory;
  relevance: RegExpRelevance;
}

export const regExpObjects = {
  ['[xyz]']: { category: 'characterClass', relevance: 1 },
  ['[^xyz]']: { category: 'characterClass', relevance: 2 },
  ['.']: { category: 'characterClass', relevance: 1 },
  ['\\d']: { category: 'characterClass', relevance: 1 },
  ['\\D']: { category: 'characterClass', relevance: 2 },
  ['\\w']: { category: 'characterClass', relevance: 1 },
  ['\\W']: { category: 'characterClass', relevance: 2 },
  ['\\s']: { category: 'characterClass', relevance: 1 },
  ['\\S']: { category: 'characterClass', relevance: 2 },
  ['\\t']: { category: 'characterClass', relevance: 2 },
  ['\\r']: { category: 'characterClass', relevance: 2 },
  ['\\n']: { category: 'characterClass', relevance: 2 },
  ['\\v']: { category: 'characterClass', relevance: 3 },
  ['\\f']: { category: 'characterClass', relevance: 3 },
  ['[\\b]']: { category: 'characterClass', relevance: 3 },
  ['\\0']: { category: 'characterClass', relevance: 3 },
  ['\\cX']: { category: 'characterClass', relevance: 3 },
  ['\\xHH']: { category: 'characterClass', relevance: 3 },
  ['\\uHHHH']: { category: 'characterClass', relevance: 3 },
  ['\\u{H…H}']: { category: 'characterClass', relevance: 3 },
  ['x|y']: { category: 'groupsAndBackreferences', relevance: 1 },
  ['^']: { category: 'assertion', relevance: 1 },
  ['$']: { category: 'assertion', relevance: 1 },
  ['anywhere']: { category: 'assertion', relevance: 1 },
  ['\\b']: { category: 'assertion', relevance: 2 },
  ['\\B']: { category: 'assertion', relevance: 3 },
  ['x(?=y)']: { category: 'assertion', relevance: 3 },
  ['x(?!y)']: { category: 'assertion', relevance: 3 },
  ['(?<=y)x']: { category: 'assertion', relevance: 3 },
  ['(?<!y)x']: { category: 'assertion', relevance: 3 },
  ['(x)']: { category: 'groupsAndBackreferences', relevance: 1 },
  ['(?<Name>x)']: { category: 'groupsAndBackreferences', relevance: 3 },
  ['(?:x)']: { category: 'groupsAndBackreferences', relevance: 2 },
  ['\\k<Name>']: { category: 'groupsAndBackreferences', relevance: 3 },
  ['x*']: { category: 'quantifier', relevance: 1 },
  ['x+']: { category: 'quantifier', relevance: 1 },
  ['x?']: { category: 'quantifier', relevance: 1 },
  ['x{n}']: { category: 'quantifier', relevance: 2 },
  ['x{n,}']: { category: 'quantifier', relevance: 2 },
  ['x{n,m}']: { category: 'quantifier', relevance: 2 },
  ['d']: { category: 'modifier', relevance: 3 },
  ['g']: { category: 'modifier', relevance: 1 },
  ['i']: { category: 'modifier', relevance: 1 },
  ['m']: { category: 'modifier', relevance: 2 },
  ['s']: { category: 'modifier', relevance: 2 },
  ['u']: { category: 'modifier', relevance: 3 },
  ['v']: { category: 'modifier', relevance: 3 },
  ['y']: { category: 'modifier', relevance: 3 },
} as const satisfies Record<string, RegExpObjectInterface>;

export type RegExpObjects = typeof regExpObjects;

export type RegExpElement = keyof RegExpObjects;

export type RegExpObject = RegExpObjects[RegExpElement];
