import { describe, expect, it } from 'vitest';
import { getRegExpElements, setRegExpElements } from './regExp.elements';

describe('getRegExpElements', () => {
  it.each([
    [/^[abc]$/, ['[xyz]']],
    [/^[^abc]$/, ['[^xyz]']],
    [/^.$/, ['.']],
    [/^\d$/, ['\\d']],
    [/^\D$/, ['\\D']],
    [/^\w$/, ['\\w']],
    [/^\W$/, ['\\W']],
    [/^\s$/, ['\\s']],
    [/^\S$/, ['\\S']],
    [/^\t$/, ['\\t']],
    [/^\r$/, ['\\r']],
    [/^\n$/, ['\\n']],
    [/^\v$/, ['\\v']],
    [/^\f$/, ['\\f']],
    [/^[\b]$/, ['[\\b]']],
    [/^\0$/, ['\\0']],
    [/^\cA$/, ['\\cX']],
    [/^\x41$/, ['\\xHH']],
    [/^\u0041$/, ['\\uHHHH']],
    [/^\u{1F600}$/u, ['\\u{H…H}', 'u']],
    [/^(x|y)$/, ['(x)', 'x|y']],
    [/^\ba\b$/, ['\\b']],
    [/^_\Ba\B_$/, ['\\B']],
    [/^a(?=b)\w$/, ['x(?=y)', '\\w']],
    [/^a(?!b).$/, ['x(?!y)', '.']],
    [/(?<=b)a$/, ['(?<=y)x', '$']],
    [/(?<!b)a$/, ['(?<!y)x', '$']],
    [/^(a)$/, ['(x)']],
    [/^(?<letter>a)$/, ['(?<Name>x)']],
    [/^(?:a)$/, ['(?:x)']],
    [/^(a)\1$/, ['(x)', '\\n']],
    [/^(?<letter>a)\k<letter>$/, ['(?<Name>x)', '\\k<Name>']],
    [/^a+$/, ['x+']],
    [/^a*$/, ['x*']],
    [/^a?$/, ['x?']],
    [/^a{2}$/, ['x{n}']],
    [/^a{2,}$/, ['x{n,}']],
    [/^a{2,3}$/, ['x{n,m}']],
  ])('extracts %s as %j', (expression, expected) => {
    expect(getRegExpElements(expression).sort()).toEqual([...expected].sort());
  });

  it('extracts modifier flags', () => {
    expect(getRegExpElements(/^a$/gimsuy).sort()).toEqual(
      ['g', 'i', 'm', 's', 'u', 'y'].sort(),
    );
  });

  it('does not duplicate repeated elements', () => {
    expect(getRegExpElements(/^\d\d\d$/)).toEqual(['\\d']);
  });

  it('drops both anchors when the expression is anchored on both ends', () => {
    expect(getRegExpElements(/^abc$/)).toEqual([]);
  });

  it('keeps the start anchor when only ^ is present', () => {
    expect(getRegExpElements(/^abc/)).toEqual(['^']);
  });

  it('keeps the end anchor when only $ is present', () => {
    expect(getRegExpElements(/abc$/)).toEqual(['$']);
  });

  it("adds 'anywhere' when neither ^ nor $ is present", () => {
    expect(getRegExpElements(/abc/)).toEqual(['anywhere']);
  });
});

describe('setRegExpElements', () => {
  it('preserves task fields and computes elements per task', () => {
    const result = setRegExpElements([
      { id: '0', expression: /^a$/ },
      { id: '1', expression: /^\d+$/, positiveExamples: ['1', '22'] },
    ]);

    expect(result).toEqual([
      { id: '0', expression: /^a$/, elements: [] },
      {
        id: '1',
        expression: /^\d+$/,
        positiveExamples: ['1', '22'],
        elements: ['\\d', 'x+'],
      },
    ]);
  });
});
