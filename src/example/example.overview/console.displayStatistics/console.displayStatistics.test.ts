import chalk from 'chalk';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OverviewRecursiveStatistics } from '../../../overview/overview.model';
import { statisticsExample } from '../../../overview/overview.utils/overview.computeStatistics.exampleData';
import { ConsoleDisplayStatistics } from './console.displayStatistics';
import {
  formatStatistics,
  formatStatisticsDetails,
} from '../console.displayStatisticsItem.utils/console.formatStatistics';
import { getStatisticsColor } from '../console.displayStatisticsItem.utils/console.getStatisticsColor';
import { sortChildren } from '../console.displayStatisticsItem.utils/console.sortChildren';
import { convertDayToTimestamp } from '../../../utils';

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
      formatStatisticsDetails,
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
      '  > Mathematics:     selected: 0, not learned: 1, learning: 1, learned: 3, for repeat: 1, ⌀ 11 days before',
      '    Physics:     0 1 1 3 1 ⌀ 23 days before',
      '    History:     0 2 1 2 1 ⌀ 35 days before',
      '    Chemistry:     0 2 2 1 1 ⌀ 7 days before',
    ]);
  });

  it('exits the process on Ctrl+C', () => {
    const exit = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);
    process.stdin.emit('keypress', '\u0003', { name: 'c', ctrl: true });
    expect(exit).toHaveBeenCalledWith(0);
  });

  it('explains the keys', () => {
    expect(output.slice(0, 4).join('\n')).toMatch(/↑\/↓.*\n.*→.*\n.*←.*\n.*q/);
  });

  it('expands the focused child with the right arrow key and focuses its first child', () => {
    press('right');
    expect(view().slice(2)).toEqual([
      '    Mathematics:     0 1 1 3 1 ⌀ 11 days before',
      '      relevance statistics',
      '      > 1:     selected: 0, not learned: 0, learning: 0, learned: 2, for repeat: 0, ⌀ 3 days before',
      '        3:     0 1 0 1 0 ⌀ 7 days before',
      '        2:     0 0 1 0 1 ⌀ 23 days before',
      '    Physics:     0 1 1 3 1 ⌀ 23 days before',
      '    History:     0 2 1 2 1 ⌀ 35 days before',
      '    Chemistry:     0 2 2 1 1 ⌀ 7 days before',
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
      '      > 3:     selected: 0, not learned: 1, learning: 0, learned: 1, for repeat: 0, ⌀ 7 days before',
    );
    expect(view()).toContain('    Mathematics:     0 1 1 3 1 ⌀ 11 days before');
  });

  it('shows the statistics of leaves without expanding them', () => {
    press('right');
    press('right');
    expect(view().slice(4, 8)).toEqual([
      '        1:     0 0 0 2 0 ⌀ 3 days before',
      '          taskDescription statistics',
      '          > Fractions: learned (95%) 5x 2 days before',
      '            Solving equations: 90%',
    ]);
  });

  it('does nothing on the right arrow key for a child without children and examinations', () => {
    press('right');
    press('right');
    press('down');
    // Space has no effect here, but renders the view again
    press('space');
    const before = view();
    press('right');
    press('space');
    expect(view()).toEqual(before);
    expect(view()).toContain(
      '          > Solving equations: learned (90%) 4x 3 days before',
    );
  });

  it('lists the examinations of a taskDescription with the right arrow key and focuses the first one', () => {
    press('right');
    press('right');
    press('right');
    expect(view().slice(5, 14)).toEqual([
      '          taskDescription statistics',
      '            Fractions: 95%',
      '            > 2 days before: correct',
      '              7 days before: incorrect, was confused with Solving equations',
      '              14 days before: correct',
      '              21 days before: correct',
      '              30 days before: incorrect',
      '            Solving equations: 90%',
      '        3:     0 1 0 1 0 ⌀ 7 days before',
    ]);
  });

  it('colors correct examinations green and incorrect ones red', () => {
    const previousLevel = chalk.level;
    chalk.level = 1;
    try {
      press('right');
      press('right');
      press('right');
      const lines = output.slice(output.indexOf('') + 1);
      const colorOf = (text: string) =>
        lines
          .find((line) => line.includes(text))
          ?.match(/\u001b\[(\d+)m(?!.*\u001b\[\d+m.*days before)/)?.[1];
      expect(colorOf('2 days before: correct')).toBe('32');
      expect(colorOf('7 days before: incorrect')).toBe('31');
    } finally {
      chalk.level = previousLevel;
    }
  });

  it('moves the focus through the examinations and on to the next taskDescription with the down arrow key', () => {
    press('right');
    press('right');
    press('right');
    press('down');
    expect(view()).toContain(
      '            > 7 days before: incorrect, was confused with Solving equations',
    );
    for (let i = 0; i < 3; i++) press('down');
    expect(view()).toContain('            > 30 days before: incorrect');
    press('down');
    expect(view()).toContain(
      '          > Solving equations: learned (90%) 4x 3 days before',
    );
    press('up');
    expect(view()).toContain('            > 30 days before: incorrect');
  });

  it('does nothing on the right arrow key for an examination', () => {
    press('right');
    press('right');
    press('right');
    press('space');
    const before = view();
    press('right');
    press('space');
    expect(view()).toEqual(before);
  });

  it('closes the examinations and jumps to the taskDescription with the left arrow key', () => {
    press('right');
    press('right');
    press('right');
    press('down');
    press('left');
    expect(view().join('\n')).not.toContain('days before: ');
    expect(view()).toContain(
      '          > Fractions: learned (95%) 5x 2 days before',
    );
    expect(view()).toContain('          taskDescription statistics');
  });

  it('shows the examinations of the focused taskDescription with full opacity', () => {
    const previousLevel = chalk.level;
    chalk.level = 1;
    try {
      const isDimmed = (line: string) =>
        /^\s*(?:\u001b\[33m> \u001b\[39m)?\u001b\[2m/.test(line);
      const dimmedExaminations = () =>
        output
          .slice(output.indexOf('') + 1)
          .filter((line) => line.includes('days before: '))
          .map(isDimmed);

      press('right');
      press('right');
      press('right');
      expect(dimmedExaminations()).toEqual([false, false, false, false, false]);

      // Back on the taskDescription the examinations stay visible, but are dimmed when a sibling is focused
      press('left');
      press('down');
      press('right');
      expect(dimmedExaminations()).toEqual([]);
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
      '    Mathematics:     0 1 1 3 1 ⌀ 11 days before',
      '      relevance statistics',
      '      > 1:     selected: 0, not learned: 0, learning: 0, learned: 2, for repeat: 0, ⌀ 3 days before',
      '        3:     0 1 0 1 0 ⌀ 7 days before',
    ]);
  });

  it('does nothing on the left arrow key in the first layer', () => {
    const before = view();
    press('left');
    press('down');
    expect(view()).toHaveLength(before.length);
    expect(view()).toContain(
      '  > Physics:     selected: 0, not learned: 1, learning: 1, learned: 3, for repeat: 1, ⌀ 23 days before',
    );
  });

  it('keeps the focus within the bounds', () => {
    press('up');
    press('up');
    expect(view()[1]).toMatch(/^> category statistics/);
    press('down');
    expect(view()[2]).toMatch(/^ {2}> Mathematics: /);
    for (let i = 0; i < 10; i++) press('down');
    expect(view()[5]).toMatch(/^ {2}> Chemistry: /);
  });
});

const aggregated = {
  avgLastRepetitionBefore: convertDayToTimestamp(1),
  selected: 0,
  selectionState: 'implicitNoSelection',
  notLearned: 1,
  learning: 0,
  learned: 0,
  forRepeat: 0,
} as const;

const leaf = (): OverviewRecursiveStatistics => ({
  statistics: aggregated,
  getChildren: () => undefined,
});

const mathStatistics: OverviewRecursiveStatistics = {
  statistics: aggregated,
  defaultGroupType: 'relevance',
  possibleGroupTypes: ['relevance'],
  getChildren: (groupType) =>
    groupType === 'relevance' ? { 1: leaf() } : undefined,
};

const groupedStatistics: OverviewRecursiveStatistics = {
  statistics: aggregated,
  defaultGroupType: 'category',
  possibleGroupTypes: ['category', 'relevance'],
  getChildren: (
    groupType,
  ): Record<string, OverviewRecursiveStatistics> | undefined =>
    groupType === 'category'
      ? { Math: mathStatistics }
      : groupType === 'relevance'
        ? { 5: leaf() }
        : undefined,
};

describe('ConsoleDisplayStatistics group types', () => {
  const press = (name: string) => {
    output = [];
    process.stdin.emit('keypress', undefined, { name });
  };
  let output: string[];
  const view = () => output.slice(output.indexOf('') + 1).map(stripAnsi);
  const toggleSelection = vi.fn();

  beforeEach(() => {
    output = [];
    toggleSelection.mockClear();
    vi.spyOn(console, 'clear').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation((line = '') => {
      output.push(String(line));
    });
    new ConsoleDisplayStatistics(
      formatStatistics,
      formatStatisticsDetails,
      getStatisticsColor,
      sortChildren,
      toggleSelection,
      () => ({}),
    ).display(groupedStatistics);
  });

  afterEach(() => {
    process.stdin.emit('keypress', 'return', { name: 'return' });
    vi.restoreAllMocks();
  });

  it('toggles the group type of the focused heading with left and right', () => {
    press('up');
    press('right');
    expect(view()[1]).toMatch(/^> relevance statistics/);
    expect(view()[2]).toMatch(/^ {4}5:/);
    press('right');
    expect(view()[1]).toMatch(/^> category statistics/);
    press('left');
    expect(view()[1]).toMatch(/^> relevance statistics/);
  });

  it('passes the full path to the selection', () => {
    press('right');
    press('up');
    expect(view()[3]).toMatch(/^ {4}> relevance statistics/);
    press('right');
    expect(view()[3]).toMatch(/^ {4}> relevance statistics/);
    press('down');
    press('space');
    expect(toggleSelection).toHaveBeenLastCalledWith([
      ['category', 'Math'],
      ['relevance', '1'],
    ]);
  });

  it('does not toggle anything with space on a heading', () => {
    press('up');
    press('space');
    expect(toggleSelection).not.toHaveBeenCalled();
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

  it('toggles the focused taskDescription with its taskDescription path', () => {
    const toggleSelection = vi.fn();
    new ConsoleDisplayStatistics(
      formatStatistics,
      formatStatisticsDetails,
      getStatisticsColor,
      sortChildren,
      toggleSelection,
      () => ({}),
    ).display(statisticsExample);

    press('right');
    press('right');
    press('space', ' ');

    expect(toggleSelection).toHaveBeenCalledTimes(1);
    expect(toggleSelection).toHaveBeenCalledWith([
      ['taskDescription', 'Fractions'],
    ]);
  });

  it('does not select the examinations of a taskDescription', () => {
    const toggleSelection = vi.fn();
    new ConsoleDisplayStatistics(
      formatStatistics,
      formatStatisticsDetails,
      getStatisticsColor,
      sortChildren,
      toggleSelection,
      () => ({}),
    ).display(statisticsExample);
    press('right');
    press('right');
    press('right');
    // The focus is on the first examination
    press('space');
    press('down');
    press('space');

    expect(toggleSelection).not.toHaveBeenCalled();
  });
});
