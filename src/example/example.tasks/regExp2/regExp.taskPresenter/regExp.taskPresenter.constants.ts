export const emptyStringName = 'empty string';

export const specialCharacterNames: Record<string, string> = {
  '\n': 'linebreak',
  '\r': 'carriage return',
  '\t': 'tab',
  '\v': 'vertical tab',
  '\f': 'form feed',
  '\b': 'backspace',
  '\0': 'null',
  ' ': 'space',
  '\u00a0': 'non-breaking space',
  '\u2028': 'line separator',
  '\u2029': 'paragraph separator',
  '\ufeff': 'byte order mark',
};
