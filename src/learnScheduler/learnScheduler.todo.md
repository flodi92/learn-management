## characteristics

Implement the following functions in their own utils files. The second one gets characteristics string as imput

```typescript
export const getTaskCharacteristics = ({
  subjects,
  relevance,
  complexity,
}: Required<TaskDescription>) =>
  `${subjects.sort().join('_')}_relevance_${relevance}_complexity_${complexity}`;

export const resolveTaskCharacteristics = (
  value: string,
  taskDescriptions: TaskDescription[],
): TaskDescription[] => {
  throw 'not implemented';
};
```

--

Write a function computeTaskCharacteristicsStatisticsAt that computes statistics for each task characteristics based on the function getTaskCharacteristics

--

use computeTaskCharacteristicsStatisticsAt instead of computeTaskDescriptionStatisticsAt

collect learning states learning, forRepeat and notLearned for those characteristics instead as for taskDescriptions

Then resolve those characteristics again to TaskDescriptions using resolveTaskCharacteristics
The rest of the implementation remains equal
