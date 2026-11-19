import chalk from 'chalk';
import {
  emptyStringName,
  specialCharacterNames,
} from './regExp.taskPresenter.constants';

const highlight = (name: string) => chalk.magenta(`<${name}>`);

export const getExampleAlternative = (value: string) => {
  if (value === '') {
    return highlight(emptyStringName);
  }
  return [...value]
    .map((character) => {
      const name = specialCharacterNames[character];
      return name === undefined ? character : highlight(name);
    })
    .join('');
};
