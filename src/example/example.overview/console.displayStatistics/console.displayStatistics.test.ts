import chalk from 'chalk';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { statisticsExample } from '../../../overview/overview.utils/overview.computeStatistics.exampleData';
import { ConsoleDisplayStatistics } from './console.displayStatistics';
import { formatStatistics } from '../console.displayStatisticsItem.utils/console.formatStatistics';
import { getStatisticsColor } from '../console.displayStatisticsItem.utils/console.getStatisticsColor';
import { sortChildren } from '../console.displayStatisticsItem.utils/console.sortChildren';

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
    new ConsoleDisplayStatistics(
      formatStatistics,
      getStatisticsColor,
      sortChildren,
      undefined,
      undefined,
    ).display(statisticsExample);
  });

  afterEach(() => {
    process.stdin.emit('keypress', 'return', { name: 'return' });
    vi.restoreAllMocks();
  });

  it('shows only the first layer initially with the first child focused', () => {
    expect(view()).toEqual([
      '      selected: 0, not learned: 6, learning: 5, learned: 9, for repeat: 4, ⌀ 19 days before',
      '  category statistics',
      '  > Mathematics:     selected: 0, not learned: 1, learning: 1, learned: 3, for repeat: 1, ⌀ 10.5 days before',
      '    Physics:     selected: 0, 1 1 3 1 ⌀ 23.33 days before',
      '    History:     selected: 0, 2 1 2 1 ⌀ 35 days before',
      '    Chemistry:     selected: 0, 2 2 1 1 ⌀ 7.17 days before',
    ]);
  });

  it('explains the keys', () => {
    expect(output.slice(0, 4).join('\n')).toMatch(/↑\/↓.*\n.*→.*\n.*←.*\n.*q/);
  });

  it('expands the focused child with the right arrow key and focuses its first child', () => {
    press('right');
    expect(view().slice(2)).toEqual([
      '    Mathematics:     selected: 0, 1 1 3 1 ⌀ 10.5 days before',
      '      relevance statistics',
      '      > 1:     selected: 0, not learned: 0, learning: 0, learned: 2, for repeat: 0, ⌀ 2.5 days before',
      '        3:     selected: 0, 1 0 1 0 ⌀ 6.5 days before',
      '        2:     selected: 0, 0 1 0 1 ⌀ 22.5 days before',
      '    Physics:     selected: 0, 1 1 3 1 ⌀ 23.33 days before',
      '    History:     selected: 0, 2 1 2 1 ⌀ 35 days before',
      '    Chemistry:     selected: 0, 2 2 1 1 ⌀ 7.17 days before',
    ]);
  });

  it('indents all expanded lines deeper than the expanding line', () => {
    const indentationOf = (line: string) => line.search(/\S/);
    press('right');
    const lines = view();
    const trigger = lines.findIndex((line) => line.includes('Mathematics'));
    expect(lines[trigger + 1]).toMatch(/^ {6}\S/);
    const triggerIndentation = indentationOf(lines[trigger]);
    // child type and the three children of Mathematics
    lines.slice(trigger + 1, trigger + 5).forEach((line) => {
      expect(indentationOf(line.replace('>', ' '))).toBeGreaterThan(
        triggerIndentation,
      );
    });
  });

  it('moves the focus through the expansion with the down arrow key', () => {
    press('right');
    press('down');
    expect(view()).toContain(
      '      > 3:     selected: 0, not learned: 1, learning: 0, learned: 1, for repeat: 0, ⌀ 6.5 days before',
    );
    expect(view()).toContain(
      '    Mathematics:     selected: 0, 1 1 3 1 ⌀ 10.5 days before',
    );
  });

  it('shows the statistics of leaves without expanding them', () => {
    press('right');
    press('right');
    expect(view().slice(4, 8)).toEqual([
      '        1:     selected: 0, 0 0 2 0 ⌀ 2.5 days before',
      '          subject statistics',
      '          > Fractions: learned (95%) 5x 2 days before',
      '            Solving equations: 90%',
    ]);
  });

  it('does nothing on the right arrow key for a child without children', () => {
    press('right');
    press('right');
    const before = view();
    press('right');
    press('down');
    expect(view()).toHaveLength(before.length);
    expect(view()).toContain(
      '          > Solving equations: learned (90%) 4x 3 days before',
    );
  });

  it('only the focused line and the lines above it have full opacity', () => {
    const previousLevel = chalk.level;
    chalk.level = 1;
    try {
      const isDimmed = (line: string) =>
        /^\s*(?:\u001b\[33m> \u001b\[39m)?\u001b\[2m/.test(line);
      const rawView = () => output.slice(output.indexOf('') + 1);

      press('right');
      // Mathematics has the focused child 1, whose siblings 3 and 2 are dimmed
      expect(rawView().map(isDimmed)).toEqual([
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
      ]);

      press('down');
      expect(rawView().map(isDimmed)).toEqual([
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        true,
        true,
        true,
      ]);
    } finally {
      chalk.level = previousLevel;
    }
  });

  it('jumps to the parent and collapses it with the left arrow key', () => {
    const collapsed = view();
    press('right');
    expect(view()).not.toEqual(collapsed);
    press('down');
    press('left');
    expect(view()).toEqual(collapsed);
  });

  it('collapses only the expansion of the parent', () => {
    press('right');
    press('right');
    press('left');
    expect(view().slice(2, 6)).toEqual([
      '    Mathematics:     selected: 0, 1 1 3 1 ⌀ 10.5 days before',
      '      relevance statistics',
      '      > 1:     selected: 0, not learned: 0, learning: 0, learned: 2, for repeat: 0, ⌀ 2.5 days before',
      '        3:     selected: 0, 1 0 1 0 ⌀ 6.5 days before',
    ]);
  });

  it('does nothing on the left arrow key in the first layer', () => {
    const before = view();
    press('left');
    press('down');
    expect(view()).toHaveLength(before.length);
    expect(view()).toContain(
      '  > Physics:     selected: 0, not learned: 1, learning: 1, learned: 3, for repeat: 1, ⌀ 23.33 days before',
    );
  });

  it('keeps the focus within the bounds', () => {
    press('up');
    expect(view()[2]).toMatch(/^ {2}> Mathematics: /);
    for (let i = 0; i < 10; i++) press('down');
    expect(view()[5]).toMatch(/^ {2}> Chemistry: /);
  });
});

describe('ConsoleDisplayStatistics selection with space', () => {
  const press = (name: string, sequence?: string) =>
    process.stdin.emit('keypress', sequence, { name });

  beforeEach(() => {
    vi.spyOn(console, 'clear').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    process.stdin.emit('keypress', 'return', { name: 'return' });
    vi.restoreAllMocks();
  });

  it('toggles the focused subject with its subject path', () => {
    const toggleSelection = vi.fn();
    new ConsoleDisplayStatistics(
      formatStatistics,
      getStatisticsColor,
      sortChildren,
      toggleSelection,
      () => ({}),
    ).display(statisticsExample);

    press('right');
    press('right');
    press('space', ' ');

    expect(toggleSelection).toHaveBeenCalledTimes(1);
    expect(toggleSelection).toHaveBeenCalledWith([['subject', 'Fractions']]);
  });
});
