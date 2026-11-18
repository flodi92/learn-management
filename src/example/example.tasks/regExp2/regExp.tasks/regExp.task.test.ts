import { describe, expect, it } from 'vitest';
import { applyMapping } from './regExp.task';

describe('applyMapping', () => {
  it('maps matching characters in a string and leaves unmapped characters unchanged', () => {
    expect(applyMapping('xyzab!', { x: 'a', y: 'b', z: 'c' })).toBe('abcab!');
  });

  it('handles swaps and chains in a single pass without double-mapping', () => {
    expect(
      applyMapping('abxyz', {
        a: 'x',
        b: 'y',
        x: 'a',
        y: 'b',
        z: 'c',
      }),
    ).toBe('xyabc');
    expect(applyMapping('ab', { a: 'b', b: 'c' })).toBe('bc');
  });

  it('returns an empty string unchanged', () => {
    expect(applyMapping('', { a: 'b' })).toBe('');
  });

  it('returns the input unchanged when the mapping is empty', () => {
    expect(applyMapping('xyz', {})).toBe('xyz');
    const regExp = /^xyz$/i;
    const result = applyMapping(regExp, {});
    expect(result).toBeInstanceOf(RegExp);
    expect(result.source).toBe(regExp.source);
    expect(result.flags).toBe(regExp.flags);
  });

  it('maps characters in a RegExp source while preserving flags', () => {
    const result = applyMapping(/^[xyz]+$/gi, { x: 'a', y: 'b', z: 'c' });

    expect(result).toBeInstanceOf(RegExp);
    expect(result.source).toBe('^[abc]+$');
    expect(result.flags).toBe('gi');
    expect(result.test('abc')).toBe(true);
    expect(result.test('xyz')).toBe(false);
  });

  it('throws when a mapping key is not a single-character string', () => {
    expect(() => applyMapping('abc', { '': 'x' })).toThrow();
    expect(() => applyMapping('abc', { ab: 'x' })).toThrow();
  });

  it('throws when a mapping value is not a single-character string', () => {
    expect(() => applyMapping('abc', { a: '' })).toThrow();
    expect(() => applyMapping('abc', { a: 'xy' })).toThrow();
  });
});
