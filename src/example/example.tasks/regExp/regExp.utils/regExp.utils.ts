import {
  InitialRegExpTask,
  RegExpExample,
  regExpObjects,
  RegExpRelevance,
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

const setCategoriesAndRelevance = <
  T extends InitialRegExpTask & { elements: RegExpTask['elements'] },
>(
  initialTasks: T[],
): (T & {
  categories: RegExpTask['categories'];
  relevance: RegExpTask['relevance'];
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
      relevance: Math.max(
        ...taskRegExpObjects.map((regExpObject) => regExpObject.relevance),
      ) as RegExpRelevance,
    };
  });

export const addMissingRegExpAttributes = (
  initialTasks: InitialRegExpTask[],
): RegExpTask[] => {
  const tasksWithIds = setIds(initialTasks);
  const tasksWithElements = setRegExpElements(tasksWithIds);
  const tasksWithParentIds = setParentIds(tasksWithElements);
  const tasksWithCategoriesAndRelevance =
    setCategoriesAndRelevance(tasksWithParentIds);
  return setParentIds(tasksWithCategoriesAndRelevance);
};
