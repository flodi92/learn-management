## prioritizeTaskDescription current behaviour

- if compared TaskDescription instances have different categories
  - if one TaskDescription belongs to a category with no learning in progress and the other one's category has TaskDescriptions with learning in progress prefer the one with learning in progress
- if compared TaskDescription instances categories have both instances for learning in progress
  - and if the categories are similar
    - take the one with higher relevance (smaller number)
  - and if categories are not similar
    - take the one with higher percentage of learning in progress instances
- if compared TaskDescription instances categories have both not learning in progress
  - and if the categories are similar
    - take the one with higher relevance (smaller number)
  - and if the categories are not similar
    - take the one with higher percentage of not learned instances

if category of TaskDescription has already learning in progress then prefer that

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
