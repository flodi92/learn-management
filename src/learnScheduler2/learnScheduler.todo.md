- Examine the optimization targets for scheduling for consistency and completeness. Those optimization targets should be later on used for a spaced repetition algorithm which is described in the linked article. Ask me for further answers if some information for in a later propmpt defining the derived statistics for scheduling or implementation strategy is missing. Then add the missing information and definitions to the optimization targets chapter or correct some definitions. You can use the implementations and md files in src/learnScheduler as an inspiration. However, those implementations are not good enough and the definitions and later implementations in src/learnScheduler might differ from that.

- Define the implementation of derived statistics and the implementation strategy to meet the optimization strategy. Apply spaced repetition which is described in the linked article. Describe to logic as precise as possible without already defining technical details. Your definitions should be precise enough to be the basis for implementation in the next prompt. You can use the implementations and md files in src/learnScheduler as an inspiration. However, those implementations are not good enough and the definitions and later implementations in src/learnScheduler might differ from that.

- Implement the behaviour defined in Derived statistics and Implementation strategy to meet the optimization targets. You can use the implementations and md files in src/learnScheduler as an inspiration. However, those implementations are not good enough and the definitions and later implementations in src/learnScheduler might differ from that.

- article: https://pmc.ncbi.nlm.nih.gov/articles/PMC6410796/pdf/pnas.201815156.pdf

---

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
