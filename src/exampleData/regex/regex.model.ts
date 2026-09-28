export type RegexTask = {
  id?: string;
  parentIds?: string;
  expression: RegExp;
  positiveExamples?: string[];
  negativeExamples?: string[];
  nots?: RegExp[];
};
