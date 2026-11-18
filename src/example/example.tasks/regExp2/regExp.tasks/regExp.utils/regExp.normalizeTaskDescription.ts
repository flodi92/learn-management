import {
  InitialRegExpTaskDescription,
  regExpSubstitutions,
  RegExpTaskDescription,
} from '../regExp.model';

export const normalizeTaskDescription = (
  input: InitialRegExpTaskDescription,
): RegExpTaskDescription => ({
  expression: input.expression,
  positiveExamples: input.positiveExamples,
  negativeExamples: input.negativeExamples,
  id: String(input.expression),
  parents: input.parents.map(String),
  confusedWith: input.confusedWith?.map(String) ?? [],
  equalTo: input.equalTo?.map(String) ?? [],
  subjects: [...input.subjects, ...(input.extraSubjects ?? [])],
  categories: input.categories,
  relevance: input.relevance,
  complexity: input.complexity,
  variants: [regExpSubstitutions],
});
