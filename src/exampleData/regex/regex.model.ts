export type InitialRegexTask = {
  expression: RegExp;
  positiveExamples?: string[];
  negativeExamples?: string[];
  nots?: RegExp[];
};

export interface RegexTask extends InitialRegexTask {
  id: string;
  parentIds: string[];
  elements: RegExpElements[];
}

type CharacterClasses =
  | '[xyz]'
  | '[^xyz]'
  | '.'
  | '\\d'
  | '\\D'
  | '\\w'
  | '\\W'
  | '\\s'
  | '\\S'
  | '\\t'
  | '\\r'
  | '\\n'
  | '\\v'
  | '\\f'
  | '[\\b]'
  | '\\0'
  | '\\cX'
  | '\\xHH'
  | '\\uHHHH'
  | '\\u{H…H}'
  | 'x|y';

type Assertions =
  | '^'
  | '$'
  | 'anywhere' // expression without '^' and '$'
  | '\\b'
  | '\\B'
  | 'x(?=y)'
  | 'x(?!y)'
  | '(?<=y)x'
  | '(?<!y)x';

type GroupsAndBackreferences =
  '(x)' | '(?<Name>x)' | '(?:x)' | '\\n' | '\\k<Name>';

type Quantifiers = 'x*' | 'x+' | 'x?' | 'x{n}' | 'x{n,}' | 'x{n,m}';

type Modifiers = 'd' | 'g' | 'i' | 'm' | 's' | 'u' | 'v' | 'y';

type RegExpElements =
  | CharacterClasses
  | Assertions
  | GroupsAndBackreferences
  | Quantifiers
  | Modifiers;
