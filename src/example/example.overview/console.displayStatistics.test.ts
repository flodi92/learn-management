import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { statisticsExample } from '../../overview/overview.utils/overview.computeStatistics.exampleData';
import { ConsoleDisplayStatistics } from './console.displayStatistics';

const stripAnsi = (text: string) => text.replace(/\u001b\[[0-9;]*m/g, '');

describe('ConsoleDisplayStatistics', () => {
  let output: string[];

  const press = (name: string) => {
    output = [];
    process.stdin.emit('keypress', undefined, { name });
  };

  // Everything below the help text and the empty separator line
  const view = () => output.slice(output.indexOf('') + 1).map(stripAnsi);

  beforeEach(() => {
    output = [];
    vi.spyOn(console, 'clear').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation((line = '') => {
      output.push(String(line));
    });
    new ConsoleDisplayStatistics().display(statisticsExample);
  });

  afterEach(() => {
    process.stdin.emit('keypress', 'q', { name: 'q' });
    vi.restoreAllMocks();
  });

  it('shows only the first layer initially with the first child focused', () => {
    expect(view()).toEqual([
      '  avgLastRepetitionBeforeDays: 23.25, notLearned: 3, learning: 4, learned: 5, forRepeat: 4',
      '  category statistics',
      '> Mathematics',
      '  Chemistry',
      '  Physics',
      '  History',
    ]);
  });

  it('explains the keys', () => {
    expect(output.slice(0, 3).join('\n')).toMatch(/↑\/↓.*\n.*→.*\n.*q/);
  });

  it('expands the focused child with the right arrow key', () => {
    press('right');
    expect(view().slice(2)).toEqual([
      '> Mathematics',
      '    avgLastRepetitionBeforeDays: 15, notLearned: 0, learning: 1, learned: 2, forRepeat: 1',
      '    relevance statistics',
      '    1',
      '    2',
      '    3',
      '    4',
      '  Chemistry',
      '  Physics',
      '  History',
    ]);
  });

  it('indents all expanded lines deeper than the expanding line', () => {
    const indentationOf = (line: string) => line.search(/\S/);
    press('right');
    const lines = view();
    const trigger = lines.findIndex((line) => line.includes('> Mathematics'));
    const triggerIndentation = indentationOf(lines[trigger].replace('>', ' '));
    // statistics, child type and the four children of Mathematics
    lines.slice(trigger + 1, trigger + 7).forEach((line) => {
      expect(indentationOf(line.replace('>', ' '))).toBeGreaterThan(
        triggerIndentation,
      );
    });
  });

  it('moves the focus into an expanded child with the down arrow key', () => {
    press('right');
    press('down');
    expect(view()).toContain('  > 1');
    expect(view()).toContain('  Mathematics');
  });

  it('shows the data of an expanded leaf', () => {
    press('right');
    press('down');
    press('right');
    expect(view()).toContain(
      '      label: Solving equations, mastery: 0.9, lastRepetitionBeforeDays: 3, numberOfRepetitions: 4, learningState: learned',
    );
  });

  it('collapses an expanded child with the right arrow key again', () => {
    const collapsed = view();
    press('right');
    expect(view()).not.toEqual(collapsed);
    press('right');
    expect(view()).toEqual(collapsed);
  });

  it('does not expand on the left arrow key', () => {
    const before = view();
    press('left');
    press('up');
    expect(view()).toEqual(before);
  });

  it('keeps the focus within the bounds', () => {
    press('up');
    expect(view()[2]).toBe('> Mathematics');
    for (let i = 0; i < 10; i++) press('down');
    expect(view()[5]).toBe('> History');
  });
});
