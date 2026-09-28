import { RegexTask } from './regex.model';
import { simpleCombinations } from './regex.simpleCombinations';
import { simpleExpressions } from './regex.simpleExpressions';

export const tasks: RegexTask[] = [...simpleExpressions, ...simpleCombinations];
