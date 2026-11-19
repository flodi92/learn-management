import { describe, expect, it } from 'vitest';
import { setParentIds } from './regExp.parentIds';
import { RegExpTaskDescription } from '../regExp.model';

type TaskDescriptionWithElements = Pick<
  RegExpTaskDescription,
  'id' | 'expression' | 'elements'
>;

const taskDescription = (
  id: string,
  elements: TaskDescriptionWithElements['elements'],
): TaskDescriptionWithElements => ({
  id,
  expression: /x/,
  elements,
});

describe('setParentIds', () => {
  it('assigns no parents when there is no subset relationship', () => {
    const result = setParentIds([
      taskDescription('0', ['\\d']),
      taskDescription('1', ['\\w']),
    ]);

    expect(result.find((t) => t.id === '0')?.parentIds).toEqual([]);
    expect(result.find((t) => t.id === '1')?.parentIds).toEqual([]);
  });

  it('assigns a taskDescription with a proper subset of elements as parent', () => {
    const result = setParentIds([
      taskDescription('0', ['\\d']),
      taskDescription('1', ['\\d', 'x+']),
    ]);

    expect(result.find((t) => t.id === '0')?.parentIds).toEqual([]);
    expect(result.find((t) => t.id === '1')?.parentIds).toEqual(['0']);
  });

  it('does not treat taskDescriptions with identical elements as parents of each other', () => {
    const result = setParentIds([
      taskDescription('0', ['\\d']),
      taskDescription('1', ['\\d']),
    ]);

    expect(result.find((t) => t.id === '0')?.parentIds).toEqual([]);
    expect(result.find((t) => t.id === '1')?.parentIds).toEqual([]);
  });

  it('only keeps the direct parent, skipping indirect ancestors', () => {
    const result = setParentIds([
      taskDescription('0', []),
      taskDescription('1', ['\\d']),
      taskDescription('2', ['\\d', 'x+']),
    ]);

    expect(result.find((t) => t.id === '2')?.parentIds).toEqual(['1']);
  });

  it('assigns multiple direct parents when none of them is an ancestor of another', () => {
    const result = setParentIds([
      taskDescription('0', ['\\d']),
      taskDescription('1', ['\\w']),
      taskDescription('2', ['\\d', '\\w']),
    ]);

    expect(result.find((t) => t.id === '2')?.parentIds).toEqual(
      expect.arrayContaining(['0', '1']),
    );
    expect(result.find((t) => t.id === '2')?.parentIds).toHaveLength(2);
  });

  it('forms a directed graph without cycles for a chain of subsets', () => {
    const result = setParentIds([
      taskDescription('0', []),
      taskDescription('1', ['\\d']),
      taskDescription('2', ['\\d', 'x+']),
      taskDescription('3', ['\\d', 'x+', 'g']),
    ]);

    expect(result.find((t) => t.id === '0')?.parentIds).toEqual([]);
    expect(result.find((t) => t.id === '1')?.parentIds).toEqual(['0']);
    expect(result.find((t) => t.id === '2')?.parentIds).toEqual(['1']);
    expect(result.find((t) => t.id === '3')?.parentIds).toEqual(['2']);
  });
});
