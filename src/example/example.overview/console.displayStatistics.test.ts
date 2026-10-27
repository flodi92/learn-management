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
      '  ⌀ 19 days before 6 5 9 4',
      '  category statistics',
      '  > Mathematics ⌀ 10.5 days before not learned: 1, learning: 1, learned: 3, for repeat: 1',
      '    Chemistry ⌀ 7.17 days before 2 2 1 1',
      '    Physics ⌀ 23.33 days before 1 1 3 1',
      '    History ⌀ 35 days before 2 1 2 1',
    ]);
  });

  it('explains the keys', () => {
    expect(output.slice(0, 3).join('\n')).toMatch(/↑\/↓.*\n.*→.*\n.*q/);
  });

  it('expands the focused child with the right arrow key', () => {
    press('right');
    expect(view().slice(2)).toEqual([
      '  > Mathematics ⌀ 10.5 days before not learned: 1, learning: 1, learned: 3, for repeat: 1',
      '      relevance statistics',
      '        1 ⌀ 2.5 days before 0 0 2 0',
      '        2 ⌀ 22.5 days before 0 1 0 1',
      '        3 ⌀ 6.5 days before 1 0 1 0',
      '    Chemistry ⌀ 7.17 days before 2 2 1 1',
      '    Physics ⌀ 23.33 days before 1 1 3 1',
      '    History ⌀ 35 days before 2 1 2 1',
    ]);
  });

  it('indents all expanded lines deeper than the expanding line', () => {
    const indentationOf = (line: string) => line.search(/\S/);
    press('right');
    const lines = view();
    const trigger = lines.findIndex((line) => line.includes('> Mathematics'));
    expect(lines[trigger + 1]).toMatch(/^ {6}\S/);
    const triggerIndentation = indentationOf(lines[trigger].replace('>', ' '));
    // child type and the three children of Mathematics
    lines.slice(trigger + 1, trigger + 5).forEach((line) => {
      expect(indentationOf(line.replace('>', ' '))).toBeGreaterThan(
        triggerIndentation,
      );
    });
  });

  it('moves the focus into an expanded child with the down arrow key', () => {
    press('right');
    press('down');
    expect(view()).toContain(
      '      > 1 ⌀ 2.5 days before not learned: 0, learning: 0, learned: 2, for repeat: 0',
    );
    expect(view()).toContain('    Mathematics ⌀ 10.5 days before 1 1 3 1');
  });

  it('shows the statistics of leaves without expanding them', () => {
    press('right');
    press('down');
    press('right');
    expect(view().slice(4, 8)).toEqual([
      '      > 1 ⌀ 2.5 days before not learned: 0, learning: 0, learned: 2, for repeat: 0',
      '          subject statistics',
      '            Solving equations learned (90%) 4x 3 days before',
      '            Fractions learned (95%) 5x 2 days before',
    ]);
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
    expect(view()[2]).toMatch(/^ {2}> Mathematics /);
    for (let i = 0; i < 10; i++) press('down');
    expect(view()[5]).toMatch(/^ {2}> History /);
  });
});
