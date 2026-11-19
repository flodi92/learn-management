import { InitialRegExpTaskDescription } from '../regExp.model';
import { simpleCombinations } from './regExp.simpleCombinations';
import { simpleExpressions } from './regExp.simpleExpressions';
import { addMissingRegExpAttributes } from '../regExp.utils/regExp.utils';

export const initialTaskDescriptions: InitialRegExpTaskDescription[] = [
  ...simpleExpressions,
  ...simpleCombinations,
];

export const regExpTaskDescriptions = addMissingRegExpAttributes(
  initialTaskDescriptions,
);
