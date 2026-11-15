import { InitialRegExpTaskDescription } from './regExp.model';

export const initialTasks: InitialRegExpTaskDescription[] = [
  {
    expression: /^xyz$/,
    elements: ['^', '$', 'x'],
    positiveExamples: ['xyz'],
    negativeExamples: ['xy', 'xyzab', 'abxyz', 'XYZ'],
  },
  {
    expression: /^xyz/,
    elements: ['^'],
    positiveExamples: ['xyz', 'xyzab'],
    negativeExamples: ['abxyz', 'xy'],
    confusedWith: [/xyz$/, /^[^xyz]$/],
  },
  {
    expression: /xyz$/,
    elements: ['$'],
    positiveExamples: ['xyz', 'abxyz'],
    negativeExamples: ['xyzab', 'xy'],
    confusedWith: [/^xyz/],
  },
  {
    elements: ['[xyz]'],
    expression: /^[xyz]$/,
    positiveExamples: ['x', 'z'],
    negativeExamples: ['a', 'b', 'xy', ''],
    confusedWith: [/^[^xyz]$/],
  },
  {
    elements: ['[^xyz]'],
    expression: /^[^xyz]$/,
    positiveExamples: ['a', 'b'],
    negativeExamples: ['x', 'z', 'ab', ''],
    confusedWith: [/^[xyz]$/],
  },
  {
    elements: ['x|y'],
    expression: /^x|y$/,
    positiveExamples: ['x', 'y'],
    negativeExamples: ['xy', 'z'],
  },
  {
    elements: ['x*'],
    expression: /^x*$/,
    positiveExamples: ['', 'x', 'xx', 'xxxxxx'],
    negativeExamples: ['y', 'x*'],
  },
  {
    elements: ['x+'],
    expression: /^x+$/,
    positiveExamples: ['x', 'xx', 'xxxxxx'],
    negativeExamples: ['', 'y', 'x+'],
  },
  {
    elements: ['x?'],
    expression: /^x?$/,
    positiveExamples: ['x', ''],
    negativeExamples: ['xx', 'xxxxxx', 'y', 'x?'],
  },
  {
    expression: /^.$/,
    positiveExamples: ['x', '1', '\t', ' ', '$'],
    negativeExamples: ['\n', '\r'],
  },
  {
    expression: /^\s$/,
    positiveExamples: ['\t', ' '],
    negativeExamples: ['x', '1', '$'],
  },
  {
    expression: /^\S$/,
    positiveExamples: ['x', '1', '$'],
    negativeExamples: ['\t', ' '],
  },
  {
    expression: /^\w$/,
    positiveExamples: ['1', '7', 'a', 'x', '_'],
    negativeExamples: ['$', '\t', ' '],
  },
  {
    expression: /^\W$/,
    positiveExamples: ['$', '\t', ' '],
    negativeExamples: ['1', '7', 'a', 'x', '_'],
  },
  {
    expression: /^\d$/,
    positiveExamples: ['1', '7'],
    negativeExamples: ['x', '$', '\t', ' '],
  },
  {
    expression: /^\D$/,
    positiveExamples: ['x', '$', '\t', ' '],
    negativeExamples: ['1', '7'],
  },

  {
    expression: /^[xyz][^xyz]$/,
    elements: ['[xyz]', '[^xyz]'],
    positiveExamples: ['xa', 'yb'],
    negativeExamples: ['ax', 'xy', 'ab', 'by', 'yz', 'bc', 'x', '', 'xab'],
  },
  {
    expression: /^[xyz]+$/,
    elements: ['[xyz]', 'x+'],
    confusedWith: [/^(xyz)+$/],
    positiveExamples: ['x', 'xy', 'yx'],
    negativeExamples: ['a', 'xa'],
  },
  {
    expression: /^[xyz]+a$/,
    elements: ['[xyz]', 'x+', 'x'],
    positiveExamples: ['xa', 'xya', 'yxa'],
    negativeExamples: ['a', 'ab', 'x', 'xy'],
    confusedWith: [/^([xyz]a)+$/],
  },
  {
    expression: /^([xyz]a)+$/,
    elements: ['[xyz]', 'x', '(x)', 'x+'],
    positiveExamples: ['xa', 'xaya'],
    negativeExamples: ['x', 'a', 'xya', 'ax', 'axay', ''],
    confusedWith: [/^[xyz]+a$/],
  },
  {
    expression: /^(xyz)+$/,
    confusedWith: [/^[xyz]+$/],
    elements: ['(x)', 'x+'],
    positiveExamples: ['xyz', 'xyzxyz'],
    negativeExamples: ['x', 'xy', 'xyzx'],
  },
  {
    expression: /^(xy)|z$/,
    elements: ['(x)', 'x|y', 'x'],
    confusedWith: [/^xy|z$/],
    positiveExamples: ['xy', 'z'],
    negativeExamples: ['x', 'xyz', 'xz', 'zx', 'yx', ''],
  },
  {
    expression: /^xy|z$/,
    elements: ['x|y', 'x'],
    confusedWith: [/^(xy)|z$/],
    positiveExamples: ['xy', 'xz'],
    negativeExamples: ['z', 'xyz', 'yx', 'zx', ''],
  },
  {
    expression: /^x|y|z$/,
    elements: ['x', 'x|y'],
    confusedWith: [/^xyz$/],
    positiveExamples: ['x', 'y', 'z'],
    negativeExamples: ['xyz', ''],
  },
  {
    expression: /^((xy)|z)+$/,
    elements: ['x', 'x|y', '(x)', 'x+'],
    confusedWith: [/^((xy)+|z+)$/],
    positiveExamples: ['xy', 'z', 'xyz', 'xyxy', 'zxy', 'xyzxy'],
    negativeExamples: ['xz', 'xzy', 'yxz'],
  },
  {
    expression: /^((xy)+|z+)$/,
    elements: ['x', 'x|y', '(x)', 'x+'],
    confusedWith: [/^((xy)|z)+$/],
    positiveExamples: ['xy', 'z', 'xyxy', 'zz'],
    negativeExamples: ['xyz', 'xyzxy', 'xyzz', ''],
  },
];

export const regExpTasks = initialTasks;
