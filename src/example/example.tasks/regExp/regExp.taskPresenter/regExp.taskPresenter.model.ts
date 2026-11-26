import { RegExpTaskDescription } from '../regExp.tasks/regExp.model';

export type Example = {
  text: string;
  alternative: string;
  isPositive: boolean;
  answer?: 'positive' | 'negative';
};

export type Confusion = {
  example: Example;
  linkedTaskDescription: RegExpTaskDescription;
};

export type DetermineConfusionsProps = {
  taskDescription: RegExpTaskDescription;
  examples: Example[];
  allTaskDescriptions: RegExpTaskDescription[];
};
