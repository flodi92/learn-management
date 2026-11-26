import chalk from 'chalk';
import { getExampleAlternative } from './regExp.taskPresenter.utils';

describe('getExampleAlternative', () => {
  it('returns plain strings unchanged', () => {
    expect(getExampleAlternative('xyz')).toBe('xyz');
  });

  it('replaces the empty string with a highlighted name', () => {
    expect(getExampleAlternative('')).toBe(chalk.magenta('<empty string>'));
  });

  it('replaces special characters with highlighted names', () => {
    expect(getExampleAlternative('a\nb\tc d\r')).toBe(
      `a${chalk.magenta('<linebreak>')}b${chalk.magenta('<tab>')}c${chalk.magenta('<space>')}d${chalk.magenta('<carriage return>')}`,
    );
  });
});
