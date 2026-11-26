import { RegExpTask, RegExpTaskDescription } from './regExp.model';

const validateMapping = (mapping: Record<string, string>) => {
  for (const [key, mapped] of Object.entries(mapping)) {
    if ([...key].length !== 1 || [...mapped].length !== 1) {
      throw new Error(
        `Mapping entries must be single-character strings, got "${key}": "${mapped}"`,
      );
    }
  }
};

const mapString = (text: string, mapping: Record<string, string>) =>
  [...text]
    .map((character) =>
      Object.hasOwn(mapping, character) ? mapping[character] : character,
    )
    .join('');

export const applyMapping = <T extends string | RegExp>(
  value: T,
  mapping: Record<string, string>,
): T => {
  validateMapping(mapping);

  if (value instanceof RegExp) {
    return new RegExp(mapString(value.source, mapping), value.flags) as T;
  }

  return mapString(value, mapping) as T;
};

export const getTask = (description: RegExpTaskDescription): RegExpTask => {
  const variant =
    description.variants[
      Math.floor(Math.random() * description.variants.length)
    ];
  if (variant.type === 'substitution') {
    const mapping =
      variant.mappings[Math.floor(Math.random() * variant.mappings.length)];

    return {
      taskDescriptionId: applyMapping(description.id, mapping),
      expression: applyMapping(description.expression, mapping),
      positiveExamples: description.positiveExamples.map((example) =>
        applyMapping(example, mapping),
      ),
      negativeExamples: description.negativeExamples.map((example) =>
        applyMapping(example, mapping),
      ),
      variant: {
        type: 'substitution',
        mapping,
      },
    };
  }

  throw 'variant type not supported';
};
