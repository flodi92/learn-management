import chalk from 'chalk';
import { isNotUndefined } from '../../../../utils';
import { maximumNumberOfShownExamples } from '../regExp.constants';
import {
  emptyStringName,
  specialCharacterNames,
} from './regExp.taskPresenter.constants';
import { RegExpTaskDescription } from '../regExp.tasks/regExp.model';
import {
  Confusion,
  DetermineConfusionsProps,
  Example,
} from './regExp.taskPresenter.model';

const highlight = (name: string) => chalk.magenta(`<${name}>`);

export const getExampleAlternative = (value: string) => {
  if (value === '') {
    return highlight(emptyStringName);
  }
  return [...value]
    .map((character) => {
      const name = specialCharacterNames[character];
      return name === undefined ? character : highlight(name);
    })
    .join('');
};

export const isAnsweredCorrectly = (example: Example) =>
  (example.answer === 'positive') === example.isPositive;

export const determineConfusions = ({
  taskDescription,
  examples,
  allTaskDescriptions,
}: DetermineConfusionsProps) => {
  const incorrectExamples = examples.filter(
    (example) => !isAnsweredCorrectly(example),
  );
  return taskDescription.confusedWith.flatMap((id): Confusion[] => {
    const linkedTaskDescription = allTaskDescriptions.find(
      (candidate) => candidate.id === id,
    );
    if (linkedTaskDescription === undefined) {
      return [];
    }
    const example = incorrectExamples.find(({ text, isPositive }) =>
      (isPositive
        ? linkedTaskDescription.negativeExamples
        : linkedTaskDescription.positiveExamples
      ).includes(text),
    );
    return example === undefined ? [] : [{ example, linkedTaskDescription }];
  });
};

export const getConfusionMessage = (
  taskDescription: RegExpTaskDescription,
  { example, linkedTaskDescription }: Confusion,
) => {
  const [currentKind, linkedKind] = example.isPositive
    ? ['positive', 'negative']
    : ['negative', 'positive'];
  return `${example.alternative} is ${currentKind} for ${taskDescription.expression} but ${linkedKind} for ${linkedTaskDescription.expression}`;
};

const shuffle = <T>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const buildExamples = (
  taskDescription: RegExpTaskDescription,
): Example[] => {
  const positives = shuffle(
    (taskDescription.positiveExamples ?? []).map((example) => ({
      text: example,
      alternative: getExampleAlternative(example),
      isPositive: true,
    })),
  );
  const negatives = shuffle(
    (taskDescription.negativeExamples ?? []).map((example) => ({
      text: example,
      alternative: getExampleAlternative(example),
      isPositive: false,
    })),
  );

  // Reserve one of each kind (if available), then fill the rest randomly.
  const selected = [positives.shift(), negatives.shift()].filter(
    isNotUndefined,
  );
  const rest = shuffle([...positives, ...negatives]);
  selected.push(
    ...rest.slice(
      0,
      Math.max(0, maximumNumberOfShownExamples - selected.length),
    ),
  );
  return shuffle(selected);
};
