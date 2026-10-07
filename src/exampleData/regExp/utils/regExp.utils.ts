import {
  InitialRegExpTask,
  RegExpExample,
  regExpObjects,
  RegExpPriority,
  RegExpTask,
} from '../regExp.model';
import { setRegExpElements } from './regExp.elements';
import { setParentIds } from './regExp.parentIds';

export const getExampleValue = (example: RegExpExample): string =>
  typeof example === 'string' ? example : example.value;

export const getExampleAlternative = (
  example: RegExpExample,
): string | undefined =>
  typeof example === 'string' ? undefined : example.alternative;

const setIds = <T extends InitialRegExpTask>(
  initialTasks: T[],
): (T & { id: RegExpTask['id'] })[] =>
  initialTasks.map((task, idx) => ({ ...task, id: `${idx}` }));

const setCategoriesAndPriority = <
  T extends InitialRegExpTask & { elements: RegExpTask['elements'] },
>(
  initialTasks: T[],
): (T & {
  categories: RegExpTask['categories'];
  priority: RegExpTask['priority'];
})[] =>
  initialTasks.map((task, idx) => {
    const taskRegExpObjects = task.elements.map((value) => ({
      value,
      ...regExpObjects[value],
    }));
    return {
      ...task,
      categories: Array.from(
        new Set(taskRegExpObjects.map((regExpObject) => regExpObject.category)),
      ),
      priority: Math.max(
        ...taskRegExpObjects.map((regExpObject) => regExpObject.priority),
      ) as RegExpPriority,
    };
  });

export const addMissingRegExpAttributes = (
  initialTasks: InitialRegExpTask[],
): RegExpTask[] => {
  const tasksWithIds = setIds(initialTasks);
  const tasksWithElements = setRegExpElements(tasksWithIds);
  const tasksWithParentIds = setParentIds(tasksWithElements);
  const tasksWithCategoriesAndPriority =
    setCategoriesAndPriority(tasksWithParentIds);
  return setParentIds(tasksWithCategoriesAndPriority);
};
