import { InitialRegExpTask, RegExpExample, RegExpTask } from '../regExp.model';
import { setRegExpElements } from './regExp.elements';
import { setParentIds } from './regExp.parentIds';

export const getExampleValue = (example: RegExpExample): string =>
  typeof example === 'string' ? example : example.value;

export const getExampleAlternative = (
  example: RegExpExample,
): string | undefined =>
  typeof example === 'string' ? undefined : example.alternative;

const setIds = (
  initialTasks: InitialRegExpTask[],
): Omit<RegExpTask, 'parentIds' | 'elements'>[] =>
  initialTasks.map((task, idx) => ({ ...task, id: `${idx}` }));

export const addMissingRegExpAttributes = (
  initialTasks: InitialRegExpTask[],
): RegExpTask[] => {
  const tasksWithIds = setIds(initialTasks);
  const tasksWithElements = setRegExpElements(tasksWithIds);

  return setParentIds(tasksWithElements);
};
