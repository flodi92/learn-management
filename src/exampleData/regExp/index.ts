import { InitialRegExpTask } from './regExp.model';
import { simpleCombinations } from './regExp.simpleCombinations';
import { simpleExpressions } from './regExp.simpleExpressions';
import { addMissingRegExpAttributes } from './utils/regExp.utils';

export const initialTasks: InitialRegExpTask[] = [
  ...simpleExpressions,
  ...simpleCombinations,
];

export const regExpTasks = addMissingRegExpAttributes(initialTasks);
