export interface InitialRegExpTaskDescription {
  expression: RegExp;
  positiveExamples?: string[];
  negativeExamples?: string[];
  confusedWith?: RegExp[];
  elements?: RegExpElement[];
  category?: RegExpCategory;
  relevance?: RegExpRelevance;
  complexity?: 1 | 2 | 3;
  parentRegExps?: RegExp[];
}

export interface TaskDescription {
  /* @todo move to general file */
}

export interface RegExpTaskDescription
  extends TaskDescription, InitialRegExpTaskDescription {}

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

export const regExpComplexities = [1, 2, 3] as const;

export type RegExpComplexity = (typeof regExpComplexities)[number];

export interface RegExpObjectInterface {
  category: RegExpCategory;
  relevance: RegExpRelevance;
  description: string;
}

export type RegExpObjects = typeof regExpObjects;

export type RegExpElement = keyof RegExpObjects;

export type RegExpObject = RegExpObjects[RegExpElement];

export const regExpObjects = {
  ['x']: {
    category: 'characterClass',
    relevance: 1,
    description:
      'Matches specific a character like x if that character is not used for regExp syntax.',
  },
  ['[xyz]']: {
    category: 'characterClass',
    relevance: 1,
    description:
      'Matches any single one of the characters listed in the set, e.g. x, y or z.',
  },
  ['[^xyz]']: {
    category: 'characterClass',
    relevance: 2,
    description:
      'Matches any single character that is not listed in the negated set.',
  },
  ['.']: {
    category: 'characterClass',
    relevance: 1,
    description:
      'Matches any single character except line terminators (with the s flag, line terminators too).',
  },
  ['\\d']: {
    category: 'characterClass',
    relevance: 1,
    description: 'Matches a single digit, equivalent to [0-9].',
  },
  ['\\D']: {
    category: 'characterClass',
    relevance: 2,
    description:
      'Matches a single character that is not a digit, equivalent to [^0-9].',
  },
  ['\\w']: {
    category: 'characterClass',
    relevance: 1,
    description:
      'Matches a single word character: a letter, digit or underscore, equivalent to [A-Za-z0-9_].',
  },
  ['\\W']: {
    category: 'characterClass',
    relevance: 2,
    description:
      'Matches a single character that is not a word character, equivalent to [^A-Za-z0-9_].',
  },
  ['\\s']: {
    category: 'characterClass',
    relevance: 1,
    description:
      'Matches a single whitespace character, e.g. space, tab, line feed, carriage return, vertical tab, form feed and other Unicode spaces.',
  },
  ['\\S']: {
    category: 'characterClass',
    relevance: 2,
    description: 'Matches a single character that is not whitespace.',
  },
  ['\\t']: {
    category: 'characterClass',
    relevance: 2,
    description: 'Matches a horizontal tab character (U+0009).',
  },
  ['\\r']: {
    category: 'characterClass',
    relevance: 2,
    description: 'Matches a carriage return character (U+000D).',
  },
  ['\\n']: {
    category: 'characterClass',
    relevance: 2,
    description:
      'Matches a line feed character (U+000A); \\1 to \\9 as a backreference to the text matched by the numbered capturing group are classified as this element too.',
  },
  ['\\v']: {
    category: 'characterClass',
    relevance: 3,
    description: 'Matches a vertical tab character (U+000B).',
  },
  ['\\f']: {
    category: 'characterClass',
    relevance: 3,
    description: 'Matches a form feed character (U+000C).',
  },
  ['[\\b]']: {
    category: 'characterClass',
    relevance: 3,
    description:
      'Matches a backspace character (U+0008); inside a character class \\b means backspace, not word boundary.',
  },
  ['\\0']: {
    category: 'characterClass',
    relevance: 3,
    description:
      'Matches a NUL character (U+0000); must not be followed by another digit.',
  },
  ['\\cX']: {
    category: 'characterClass',
    relevance: 3,
    description:
      'Matches the control character whose code is the letter X modulo 32, e.g. \\cJ matches a line feed.',
  },
  ['\\xHH']: {
    category: 'characterClass',
    relevance: 3,
    description:
      'Matches the character with the two-digit hexadecimal code HH.',
  },
  ['\\uHHHH']: {
    category: 'characterClass',
    relevance: 3,
    description:
      'Matches the UTF-16 code unit with the four-digit hexadecimal code HHHH.',
  },
  ['\\u{H…H}']: {
    category: 'characterClass',
    relevance: 3,
    description:
      'Matches the Unicode code point with the given hexadecimal value; requires the u or v flag.',
  },
  ['x|y']: {
    category: 'groupsAndBackreferences',
    relevance: 1,
    description: 'Alternation: matches either x or y, trying x first.',
  },
  ['^']: {
    category: 'assertion',
    relevance: 1,
    description:
      'Matches at the start of the input (with the m flag at the start of each line).',
  },
  ['$']: {
    category: 'assertion',
    relevance: 1,
    description:
      'Matches at the end of the input (with the m flag at the end of each line).',
  },
  ['anywhere']: {
    category: 'assertion',
    relevance: 1,
    description:
      'Pseudo element: the expression is anchored neither at the start nor at the end, so it can match anywhere in the input.',
  },
  ['\\b']: {
    category: 'assertion',
    relevance: 2,
    description:
      'Matches a word boundary: a position between a word character and a non-word character or the start or end of the input; consumes no characters.',
  },
  ['\\B']: {
    category: 'assertion',
    relevance: 3,
    description:
      'Matches a position that is not a word boundary; consumes no characters.',
  },
  ['x(?=y)']: {
    category: 'assertion',
    relevance: 3,
    description:
      'Lookahead: matches x only if it is followed by y; y is not part of the match.',
  },
  ['x(?!y)']: {
    category: 'assertion',
    relevance: 3,
    description:
      'Negative lookahead: matches x only if it is not followed by y.',
  },
  ['(?<=y)x']: {
    category: 'assertion',
    relevance: 3,
    description:
      'Lookbehind: matches x only if it is preceded by y; y is not part of the match.',
  },
  ['(?<!y)x']: {
    category: 'assertion',
    relevance: 3,
    description:
      'Negative lookbehind: matches x only if it is not preceded by y.',
  },
  ['(x)']: {
    category: 'groupsAndBackreferences',
    relevance: 1,
    description:
      'Capturing group: matches x and remembers the matched text, accessible by number.',
  },
  ['(?<Name>x)']: {
    category: 'groupsAndBackreferences',
    relevance: 3,
    description:
      'Named capturing group: matches x and remembers the matched text under the given name.',
  },
  ['(?:x)']: {
    category: 'groupsAndBackreferences',
    relevance: 2,
    description:
      'Non-capturing group: matches x without remembering the matched text.',
  },
  ['\\k<Name>']: {
    category: 'groupsAndBackreferences',
    relevance: 3,
    description:
      'Named backreference: matches the same text that the named capturing group Name matched.',
  },
  ['x*']: {
    category: 'quantifier',
    relevance: 1,
    description: 'Matches x zero or more times, as many as possible (greedy).',
  },
  ['x+']: {
    category: 'quantifier',
    relevance: 1,
    description: 'Matches x one or more times, as many as possible (greedy).',
  },
  ['x?']: {
    category: 'quantifier',
    relevance: 1,
    description:
      'Matches x zero or one time (x is optional), preferring one time (greedy).',
  },
  ['x{n}']: {
    category: 'quantifier',
    relevance: 2,
    description: 'Matches x exactly n times.',
  },
  ['x{n,}']: {
    category: 'quantifier',
    relevance: 2,
    description: 'Matches x at least n times, as many as possible (greedy).',
  },
  ['x{n,m}']: {
    category: 'quantifier',
    relevance: 2,
    description:
      'Matches x at least n and at most m times, as many as possible (greedy).',
  },
  ['d']: {
    category: 'modifier',
    relevance: 3,
    description:
      'Flag d (hasIndices): additionally records the start and end indices of each match and capturing group.',
  },
  ['g']: {
    category: 'modifier',
    relevance: 1,
    description:
      'Flag g (global): finds all matches instead of stopping after the first.',
  },
  ['i']: {
    category: 'modifier',
    relevance: 1,
    description:
      'Flag i (ignoreCase): letters match regardless of upper or lower case.',
  },
  ['m']: {
    category: 'modifier',
    relevance: 2,
    description:
      'Flag m (multiline): ^ and $ match at the start and end of each line instead of only of the whole input.',
  },
  ['s']: {
    category: 'modifier',
    relevance: 2,
    description: 'Flag s (dotAll): . also matches line terminators.',
  },
  ['u']: {
    category: 'modifier',
    relevance: 3,
    description:
      'Flag u (unicode): treats the pattern and input as Unicode code points and enables \\u{…} and Unicode property escapes.',
  },
  ['v']: {
    category: 'modifier',
    relevance: 3,
    description:
      'Flag v (unicodeSets): like u, additionally enabling set notation and string properties in character classes.',
  },
  ['y']: {
    category: 'modifier',
    relevance: 3,
    description:
      'Flag y (sticky): matches only starting exactly at the lastIndex position.',
  },
} as const satisfies Record<string, RegExpObjectInterface>;
