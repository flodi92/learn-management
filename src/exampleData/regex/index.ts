import { InitialRegexTask } from './regex.model';
import { simpleCombinations } from './regex.simpleCombinations';
import { simpleExpressions } from './regex.simpleExpressions';
import { addMissingRegExpAttributes } from './regex.utils';

export const initialTasks: InitialRegexTask[] = [
  ...simpleExpressions,
  ...simpleCombinations,
];

export const tasks = addMissingRegExpAttributes(initialTasks);
