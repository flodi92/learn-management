import chalk from 'chalk';
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
