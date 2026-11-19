import {
  InitialRegExpTaskDescription,
  RegExpExample,
  regExpObjects,
  RegExpRelevance,
  RegExpTaskDescription,
} from '../regExp.model';
import { setRegExpElements } from './regExp.elements';
import { setParents } from './regExp.parents';

export const getExampleValue = (example: RegExpExample): string =>
  typeof example === 'string' ? example : example.value;

export const getExampleAlternative = (
  example: RegExpExample,
): string | undefined =>
  typeof example === 'string' ? undefined : example.alternative;

const setIds = <T extends InitialRegExpTaskDescription>(
  initialTaskDescriptions: T[],
): (T & { id: RegExpTaskDescription['id'] })[] =>
  initialTaskDescriptions.map((taskDescription, idx) => ({
    ...taskDescription,
    id: `${idx}`,
  }));

const setCategoriesAndRelevance = <
  T extends InitialRegExpTaskDescription & {
    elements: RegExpTaskDescription['elements'];
  },
>(
  initialTaskDescriptions: T[],
): (T & {
  categories: RegExpTaskDescription['categories'];
  relevance: RegExpTaskDescription['relevance'];
})[] =>
  initialTaskDescriptions.map((taskDescription, idx) => {
    const taskDescriptionRegExpObjects = taskDescription.elements.map(
      (value) => ({
        value,
        ...regExpObjects[value],
      }),
    );
    return {
      ...taskDescription,
      categories: Array.from(
        new Set(
          taskDescriptionRegExpObjects.map(
            (regExpObject) => regExpObject.category,
          ),
        ),
      ),
      relevance: Math.max(
        ...taskDescriptionRegExpObjects.map(
          (regExpObject) => regExpObject.relevance,
        ),
      ) as RegExpRelevance,
    };
  });

export const addMissingRegExpAttributes = (
  initialTaskDescriptions: InitialRegExpTaskDescription[],
): RegExpTaskDescription[] => {
  const taskDescriptionsWithIds = setIds(initialTaskDescriptions);
  const taskDescriptionsWithElements = setRegExpElements(
    taskDescriptionsWithIds,
  );
  const taskDescriptionsWithParents = setParents(taskDescriptionsWithElements);
  const taskDescriptionsWithCategoriesAndRelevance = setCategoriesAndRelevance(
    taskDescriptionsWithParents,
  );
  return setParents(taskDescriptionsWithCategoriesAndRelevance);
};
