## model to build on the scheduling algorithm

```typescript
// relevant types in model.ts
export interface TaskDescription {
  id: string;
  parents?: string[]; // ids of other TaskDescription instances
  confusedWith?: string[]; // ids of other TaskDescription instances, related in a way that they could be confused with this TaskDescription
  equalTo?: string[]; // ids of other TaskDescription instances, handled problem is equal to this one
  subjects?: string[]; // list of learning subjects this TaskDescription covers
  categories?: string[]; // list of categories the TaskDescription belongs to
  relevance?: number; // 1 means most relevant TaskDescription, higher number means some edge case to be learnt later on
  complexity?: number; // 1 means least complex, raising complexity with raising numbers
}

export interface Result {
  id: string; // id of a TaskDescription that has been examined
  correctness: number; // between 0 and 1, 0 means incorrect, 1 means correct, all intermediates possible
}

export interface TimedResult extends Result {
  day: number; // day when the TaskDescription has been examined (counted since 1970)
}

export type SaveData = TimedResult[];
```

## intermediate data

Mastery is a value between 0 and 1 and can be computed for a specific day and a specific TaskDescription based on SaveData

## targets

1. Repetition

- Repeat TaskDescription instances until they are learnt

2. Related TaskDescription instances should be scheduled temporarily close

- two TaskDescription instances are considered related if they have a category in common
- two TaskDescription instances are considered even more related if they are linked with confusedWith
- two TaskDescription instances are considered even more related if they are linked with equalsTo

Exception 2.1: A TaskDescription that is related to a scheduled TaskDescription does not necessarily have to be scheduled if the TaskDescription's relevance is higher than the highest relevance of the category

3. Do not schedule TaskDescription instances of a lower relavance (greater number) before TaskDescription instances of higher relevance of the same and of other categories have been learnt.

4. Do not schedule TaskDescription instances with several subjects before each TaskDescription that holds a subset of those subject has been learnt. (@todo define learnt)

5. Do not schedule TaskDescription instances as long as there are other TaskDescription instances in the same category that have a lower complexity.

## prioritizeTaskDescriptions first attempt

It gets an array of TaskDescription and it gets TaskDescriptionStatistics.
It returns a sorted array of TaskDescription
Low indices in that array are considered to have a higher priority than high indices.
The sorting is performed by the following rules.

1. prefer low relevance over high relevance
2. prefer low complexity over high complexity
3.

You should try to adapt the programming style of the old implementation but it is more important to meet all the requirements defined in this file.

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
