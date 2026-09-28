import { setRegExpElements } from './regex.elements';
import { InitialRegexTask, RegexTask } from './regex.model';

const setIds = (
  initialTasks: InitialRegexTask[],
): Omit<RegexTask, 'parentIds' | 'elements'>[] =>
  initialTasks.map((task, idx) => ({ ...task, id: `${idx}` }));

const setParentIds = (
  tasksWithElements: Omit<RegexTask, 'parentIds'>[],
): RegexTask[] => tasksWithElements.map((task) => ({ ...task, parentIds: [] }));

export const addMissingRegExpAttributes = (
  initialTasks: InitialRegexTask[],
): RegexTask[] => {
  const tasksWithIds = setIds(initialTasks);
  const tasksWithElements = setRegExpElements(tasksWithIds);

  return setParentIds(tasksWithElements);
};
