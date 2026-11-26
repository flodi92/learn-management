import { RegExpComplexity } from '../regExp.model';
import { getSubjectsFromExpression } from './regExp.subjects';

export const getComplexityOfExpression = (
  expression: RegExp,
): RegExpComplexity => {
  const subjectsLength = getSubjectsFromExpression(expression).length;

  return subjectsLength <= 2 ? 1 : subjectsLength <= 4 ? 2 : 3;
};
