import { InitialRegExpTask, RegExpTask } from '../regExp.model';
import { setRegExpElements } from './regExp.elements';
import { setParentIds } from './regExp.parentIds';

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
