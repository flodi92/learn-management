import { InitialRegExpTask, RegExpElement, RegExpTask } from '../regExp.model';

const MODIFIER_FLAGS: RegExpElement[] = [
  'd',
  'g',
  'i',
  'm',
  's',
  'u',
  'v',
  'y',
];

const consumeEscape = (
  source: string,
  index: number,
  elements: Set<RegExpElement>,
): number => {
  const next = source[index + 1];

  switch (next) {
    case 'd':
      elements.add('\\d');
      return index + 2;
    case 'D':
      elements.add('\\D');
      return index + 2;
    case 'w':
      elements.add('\\w');
      return index + 2;
    case 'W':
      elements.add('\\W');
      return index + 2;
    case 's':
      elements.add('\\s');
      return index + 2;
    case 'S':
      elements.add('\\S');
      return index + 2;
    case 't':
      elements.add('\\t');
      return index + 2;
    case 'r':
      elements.add('\\r');
      return index + 2;
    case 'n':
      elements.add('\\n');
      return index + 2;
    case 'v':
      elements.add('\\v');
      return index + 2;
    case 'f':
      elements.add('\\f');
      return index + 2;
    case 'b':
      elements.add('\\b');
      return index + 2;
    case 'B':
      elements.add('\\B');
      return index + 2;
    case '0':
      if (!/\d/.test(source[index + 2] ?? '')) {
        elements.add('\\0');
        return index + 2;
      }
      break;
    case 'c':
      if (/[A-Za-z]/.test(source[index + 2] ?? '')) {
        elements.add('\\cX');
        return index + 3;
      }
      break;
    case 'x':
      if (/^[0-9a-fA-F]{2}/.test(source.slice(index + 2, index + 4))) {
        elements.add('\\xHH');
        return index + 4;
      }
      break;
    case 'u':
      if (source[index + 2] === '{') {
        const closingBraceIndex = source.indexOf('}', index + 3);
        if (closingBraceIndex !== -1) {
          elements.add('\\u{H…H}');
          return closingBraceIndex + 1;
        }
      } else if (/^[0-9a-fA-F]{4}/.test(source.slice(index + 2, index + 6))) {
        elements.add('\\uHHHH');
        return index + 6;
      }
      break;
    case 'k':
      if (source[index + 2] === '<') {
        const closingAngleIndex = source.indexOf('>', index + 3);
        if (closingAngleIndex !== -1) {
          elements.add('\\k<Name>');
          return closingAngleIndex + 1;
        }
      }
      break;
    default:
      if (/[1-9]/.test(next ?? '')) {
        elements.add('\\n');
        return index + 2;
      }
      break;
  }

  return index + 2;
};

const consumeCharacterClass = (
  source: string,
  index: number,
  elements: Set<RegExpElement>,
): number => {
  let cursor = index + 1;
  const negated = source[cursor] === '^';
  if (negated) cursor += 1;

  let content = '';
  while (cursor < source.length && source[cursor] !== ']') {
    if (source[cursor] === '\\') {
      content += source[cursor] + (source[cursor + 1] ?? '');
      cursor += 2;
    } else {
      content += source[cursor];
      cursor += 1;
    }
  }

  if (!negated && content === '\\b') {
    elements.add('[\\b]');
  } else if (negated) {
    elements.add('[^xyz]');
  } else {
    elements.add('[xyz]');
  }

  return cursor + 1;
};

const consumeGroup = (
  source: string,
  index: number,
  elements: Set<RegExpElement>,
): number => {
  if (source[index + 1] !== '?') {
    elements.add('(x)');
    return index + 1;
  }

  const marker = source[index + 2];
  if (marker === ':') {
    elements.add('(?:x)');
    return index + 3;
  }
  if (marker === '=') {
    elements.add('x(?=y)');
    return index + 3;
  }
  if (marker === '!') {
    elements.add('x(?!y)');
    return index + 3;
  }
  if (marker === '<') {
    if (source[index + 3] === '=') {
      elements.add('(?<=y)x');
      return index + 4;
    }
    if (source[index + 3] === '!') {
      elements.add('(?<!y)x');
      return index + 4;
    }
    const closingAngleIndex = source.indexOf('>', index + 3);
    elements.add('(?<Name>x)');
    return closingAngleIndex === -1 ? index + 3 : closingAngleIndex + 1;
  }

  return index + 2;
};

const matchQuantifierBraces = (
  source: string,
  index: number,
): { element: RegExpElement; length: number } | undefined => {
  const match = /^\{(\d+)(,(\d+)?)?\}/.exec(source.slice(index));
  if (!match) return undefined;

  const [full, , hasComma, upperBound] = match;
  if (!hasComma) return { element: 'x{n}', length: full.length };
  if (upperBound === undefined)
    return { element: 'x{n,}', length: full.length };
  return { element: 'x{n,m}', length: full.length };
};

export const getRegExpElements = (expression: RegExp): RegExpElement[] => {
  const elements = new Set<RegExpElement>();
  const { source } = expression;
  let i = 0;

  while (i < source.length) {
    const char = source[i];

    if (char === '\\') {
      i = consumeEscape(source, i, elements);
      continue;
    }
    if (char === '[') {
      i = consumeCharacterClass(source, i, elements);
      continue;
    }
    if (char === '(') {
      i = consumeGroup(source, i, elements);
      continue;
    }

    if (char === '{') {
      const quantifier = matchQuantifierBraces(source, i);
      if (quantifier) {
        elements.add(quantifier.element);
        i += quantifier.length;
        continue;
      }
    } else {
      const literalElement = (
        {
          '.': '.',
          '^': '^',
          $: '$',
          '|': 'x|y',
          '*': 'x*',
          '+': 'x+',
          '?': 'x?',
        } as Record<string, RegExpElement>
      )[char];
      if (literalElement) elements.add(literalElement);
    }

    i += 1;
  }

  expression.flags.split('').forEach((flag) => {
    if (MODIFIER_FLAGS.includes(flag as RegExpElement)) {
      elements.add(flag as RegExpElement);
    }
  });

  const hasStart = elements.has('^');
  const hasEnd = elements.has('$');
  if (hasStart && hasEnd) {
    // an expression anchored on both ends says nothing about matching anywhere
    elements.delete('^');
    elements.delete('$');
  } else if (!hasStart && !hasEnd) {
    elements.add('anywhere');
  }

  return Array.from(elements);
};

export const setRegExpElements = <T extends InitialRegExpTask>(
  tasksWithIds: T[],
): (T & { elements: RegExpTask['elements'] })[] =>
  tasksWithIds.map((task) => ({
    ...task,
    elements: getRegExpElements(task.expression),
  }));
