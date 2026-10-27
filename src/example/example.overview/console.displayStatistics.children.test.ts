import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OverviewRecursiveStatistics } from '../../overview/overview.model';
import { ConsoleDisplayStatistics } from './console.displayStatistics';
import { numberOfInitiallyShownChildren } from './console.constants';

const stripAnsi = (text: string) => text.replace(/\u001b\[[0-9;]*m/g, '');

// Children are named "subject 01", "subject 02", ... and sorted by their decreasing mastery
const createStatistics = (
  numberOfChildren: number,
): OverviewRecursiveStatistics => ({
  childType: 'subject',
  statistics: {
    avgLastRepetitionBeforeDays: 1,
    notLearned: numberOfChildren,
    learning: 0,
    learned: 0,
    forRepeat: 0,
  },
  children: Object.fromEntries(
    Array.from({ length: numberOfChildren }, (_, index) => {
      const label = `subject ${String(index + 1).padStart(2, '0')}`;
      return [
        label,
        {
          statistics: {
            label,
            mastery: 1 - index / 100,
            lastRepetitionBeforeDays: 1,
            numberOfRepetitions: 1,
            learningState: 'learning',
          },
        },
      ];
    }),
  ),
});

describe('ConsoleDisplayStatistics with many children', () => {
  let output: string[];

  const press = (name: string, times = 1) => {
    for (let i = 0; i < times; i++) {
      output = [];
      process.stdin.emit('keypress', undefined, { name });
    }
  };

  const view = () => output.slice(output.indexOf('') + 1).map(stripAnsi);
  const childLines = () => view().slice(2);
  const focusedLine = () => view().find((line) => line.includes('> '));

  const start = (numberOfChildren: number) =>
    new ConsoleDisplayStatistics().display(createStatistics(numberOfChildren));

  beforeEach(() => {
    output = [];
    vi.spyOn(console, 'clear').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation((line = '') => {
      output.push(String(line));
    });
  });

  afterEach(() => {
    process.stdin.emit('keypress', 'q', { name: 'q' });
    vi.restoreAllMocks();
  });

  it('shows at most 15 children followed by an ellipsis', () => {
    expect(numberOfInitiallyShownChildren).toBe(15);
    start(35);
    const lines = childLines();
    expect(lines).toHaveLength(16);
    expect(lines[0]).toMatch(/^ {2}> subject 01: /);
    expect(lines[14]).toMatch(/^ {4}subject 15: /);
    expect(lines[15]).toBe('    …');
  });

  it('shows no ellipsis if there are not more than 15 children', () => {
    start(15);
    expect(childLines()).toHaveLength(15);
    expect(view()).not.toContain('    …');
  });

  it('adds the next 15 children when going down from the last shown child', () => {
    start(35);
    press('down', 14);
    expect(focusedLine()).toMatch(/subject 15: /);
    expect(childLines()).toHaveLength(16);

    press('down');
    expect(focusedLine()).toMatch(/subject 16: /);
    const lines = childLines();
    expect(lines).toHaveLength(31);
    expect(lines[29]).toMatch(/subject 30: /);
    expect(lines[30]).toBe('    …');
  });

  it('shows all children after loading the last chunk', () => {
    start(35);
    press('down', 14 + 1 + 14 + 1);
    expect(focusedLine()).toMatch(/subject 31: /);
    const lines = childLines();
    expect(lines).toHaveLength(35);
    expect(lines.every((line) => !line.includes('…'))).toBe(true);
  });

  it('does not add children when going up or when the focus is not in front of the ellipsis', () => {
    start(35);
    press('down', 3);
    press('up');
    expect(childLines()).toHaveLength(16);
  });

  it('adds the children of an expanded child when going down from its last shown child', () => {
    const statistics: OverviewRecursiveStatistics = {
      childType: 'category',
      statistics: createStatistics(1).statistics,
      children: { parent: createStatistics(20) },
    };
    new ConsoleDisplayStatistics().display(statistics);
    press('right');
    expect(focusedLine()).toMatch(/subject 01: /);
    // parent, heading, 15 children, ellipsis
    expect(childLines()).toHaveLength(18);
    press('down', 14);
    expect(focusedLine()).toMatch(/subject 15: /);
    press('down');
    expect(focusedLine()).toMatch(/subject 16: /);
    expect(childLines()).toHaveLength(22);
  });
});
