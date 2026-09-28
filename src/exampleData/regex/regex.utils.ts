import { InitialRegexTask, RegexTask } from './regex.model';

const setIds = (
  initialTasks: InitialRegexTask[],
): Omit<RegexTask, 'parentIds' | 'elements'>[] =>
  initialTasks.map((task, idx) => ({ ...task, id: `${idx}` }));

export const addMissingRegExpAttributes = (
  initialTasks: InitialRegexTask[],
): RegexTask[] => {
  const tasksWithIds = setIds(initialTasks);

  return tasksWithIds.map((task) => ({ ...task, parentIds: [], elements: [] }));
};
