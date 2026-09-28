import { setRegExpElements } from './regex.elements';
import { InitialRegexTask, RegexTask } from './regex.model';
import { setParentIds } from './regex.parentIds';

const setIds = (
  initialTasks: InitialRegexTask[],
): Omit<RegexTask, 'parentIds' | 'elements'>[] =>
  initialTasks.map((task, idx) => ({ ...task, id: `${idx}` }));

export const addMissingRegExpAttributes = (
  initialTasks: InitialRegexTask[],
): RegexTask[] => {
  const tasksWithIds = setIds(initialTasks);
  const tasksWithElements = setRegExpElements(tasksWithIds);

  return setParentIds(tasksWithElements);
};
