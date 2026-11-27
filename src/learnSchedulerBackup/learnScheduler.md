# LearningScheduler

## General function

LearningScheduler is a class that selects subjects to be learned during the next learning session aiming to optimize the selection based on analyzing former results.

learnScheduler2/learnScheduler.ts is a reimplementation of learnScheduler/learnScheduler.ts that aims for better algorithms.

## Data model to base on the scheduling algorithm

```typescript
// relevant types in model.ts
export interface TaskDescription {
  id: string;
  parents?: string[]; // ids of other TaskDescription instances, parents relationships between all TaskDescription instances build a directed graph
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

export type SaveData = TimedResult[];
```

## Optimization targets of scheduling

The scheduling algorithm by assembleNextSession should be designed in a way to meet the following optimization targets

1. Limit the number of learning in progress TaskDescription instances

Learning TaskDescription instances will take some repetitions until the level of mastery has raised to the point where the learner is confident of performing correctly.

To ensure that the learner can focus on a number of learning in progress TaskDescription instances the algorithm should only introduce new TaskDescription instances when others have already reached a certain degree of mastery.

2. Assure constant repetition of learning in progress TaskDescription instances

Subjects once introduced into the learning process should be repeated regularly with low temporal distance until the user has reached a certain level of mastery.

3. Avoids unnecessary repetitions

Subjects that have been answered with a high level of correctness for several times are considered of having a high level of mastery. They should be repeated with higher temporal distance to allow other TaskDescription instances to be learned.

4. Repeat learned TaskDescription instances

Subjects that have already reached a high level of mastery should be repeated from time to time in order to assure they are constantly kept by the learner. In case a repetition is successfull the temporal distance to the next repetition will even be greater. The oposite goes if the repetition shows a low correctness. In that case the repetitions will become more frequent.

5. Related TaskDescription instances should be scheduled temporarily close

- two TaskDescription instances are considered related if they have a category in common
- two TaskDescription instances are considered even more related if they are linked with confusedWith
- two TaskDescription instances are considered even more related if they are linked with equalsTo

Exception: A TaskDescription that is related to a scheduled TaskDescription does not necessarily have to be scheduled if the TaskDescription's relevance is higher than the highest relevance of the category

6. Do not schedule TaskDescription instances of a lower relavance (greater number) before TaskDescription instances of higher relevance of the same and of other categories have been learnt.

7. Do not schedule TaskDescription instances with several subjects before each TaskDescription that holds a subset of those subjects has been learnt.

8. Do not schedule TaskDescription instances as long as there are other TaskDescription instances in the same category that have a lower complexity.

## Derived statistics to base the scheduling on

### mastery

The mastery is a value between 0 and 1 and can be computed for a specific day and a specific TaskDescription based on the number of repetitions, their correctness and temporal distance which is extractd from SaveData.

The computation takes the following principles into account.

- The mastery is considered greater if the learner has had a greater number of repetitions with correct results.
- The mastery is considered greater if those repetitions are more resent.
- The mastery is considered greater if there are more correct results underneath the most resent repetitions.
- The mastery is considered greater if more time has passed between repetitions with correct results

A TaskDescription is considered to have been repeated at a specific day when a TimedResult with that specific id appears in SaveData or when another TaskDescription is repeated that has the latter TaskDescription as parent or as indirect ancestor.

### number of repetitions

The number of repetitions can be computed for a specific day and a specific TaskDescription based on SavedData.

### learning state

The learning state can be computed for a specific day and a specific TaskDescription based on SavedData.
The learning state can have the following values.

```typescript
// defined in model.ts
export const learningStates = [
  'notLearned', // not examined at all or examined long before without ever having learned
  'learning', // in progress of learning, should be repeated regularely until learned
  'learned', // considered to be learned because the user had enough repetitions with correct results, however this is not final. The more time has spent the more likly it is for the learner to have forgotten and needing a repetition
  'forRepeat', // learned some time ago, no repetition since then, so unsure of having kept, should be repeated => if repeated incorrectly then again learned state
] as const;

export type LearningState = (typeof learningStates)[number];
```

### more statistics

More statistics can be defined when ever necessary to find a good implementation strategy for the optimization targets.

## Implementation strategy

This paragraph is considered to define an implementation strategy for computing the former defined statistics and meeting the optimization targets for scheduling.

### Computation of mastery

@todo not yet described

### Computation of learning state

@todo not yet described

### Scheduling stategies based on statistics

@todo not yet described

The following is just an example of the style to define the scheduling strategy. It should not be taken seriously and it should be replaced by a better definition.

```md
@ todo remove and find better description

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
```

## interface

### constructor

LearnScheduler's constructor is invoked with an array of TaskDescription instances. It is just a string array of TaskDescription ids. The LearningScheduler does not concern on what concrete tasks are behind that TaskDescription instances.

### nextSession

The method nextSession requests a subset of the given TaskDescription instances to be learned in the next session which is based on the principles that are defined above. Count defines the number of TaskDescription instances to be put into that session. Time defines when that learning happens. A difference of one means one day.

### recordResults

The method recordResults is invoked once a session is done. The parameter results maps each TaskDescription to the result of examining that task. The result can be understood as level of correctness. It is a number between 0 and 1.

### get mastery

Returns the current level of mastery for each of the given TaskDescription instances
