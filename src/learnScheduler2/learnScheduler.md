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

The scheduling algorithm by assembleNextSession should be designed in a way to meet the following optimization targets.

The targets follow the spaced repetition model of the article (wiki/article.md, MEMORIZE): the learner is expected to forget exponentially with the time since the last repetition, correct repetitions slow down forgetting, incorrect ones speed it up, and the more likely an item is forgotten the more urgent its repetition is. Targets 2 to 4 are different views on this one principle. Targets 1 and 5 to 8 are about which TaskDescription instances take part in the learning process at all and in which order.

### Terms used by the targets

Everything is evaluated per TaskDescription instance (not per group of TaskDescription instances with equal characteristics).

- **recall probability**: the estimated probability that the learner answers correctly on a given day. It decreases with the days passed since the last repetition. How fast it decreases (the forgetting rate) is lowered by correct and raised by incorrect repetitions. A correctness between 0 and 1 acts as an interpolation between a fully correct and a fully incorrect repetition. The mastery (see below) must meet its four principles; whether mastery is the recall probability itself or derived from it is defined in the derived statistics.
- **stability**: the retention half-life in days that follows from the forgetting rate. In contrast to the recall probability it does not decay over time, it only changes through repetitions. It grows with correct repetitions, especially if they are spaced far apart, and shrinks with incorrect ones.
- **introduced**: a TaskDescription that has at least one result.
- **learnt**: a TaskDescription whose stability has reached the learnt threshold at least once. It stays learnt for all conditions below, even if it later has to be repeated or its stability falls again. Otherwise a forgotten TaskDescription would block the introduction of others again.
- **learning in progress**: introduced but not learnt. If a learning in progress TaskDescription has not been repeated for so long that its recall probability fell below a drop-out threshold it is considered not learned again (does not count as learning in progress), so that abandoned instances cannot block the limit forever.
- **due**: the recall probability is lower than the target recall probability of its phase. The target is high for learning in progress instances (short temporal distance) and lower for learnt instances (long temporal distance). This corresponds to the parameter q of the article, which trades off recall probability against the number of repetitions per item.
- **eligible for introduction**: not introduced and passing the conditions of targets 1 and 6 to 8.
- **effective relevance / effective complexity**: the smallest relevance (complexity) of the TaskDescription itself and of all TaskDescription instances that have it as proper subset of their subjects (target 7). A TaskDescription that is a prerequisite of a more relevant (simpler) TaskDescription must not be blocked by the targets 6 and 8, otherwise they would contradict target 7.
- **optional fields**: a TaskDescription without relevance does not take part in target 6, without complexity not in target 8, without subjects (or with an empty list) not in target 7, without categories not in target 5 (via category) and 8. It is neither blocked nor does it block.
- **parameters**: the learning in progress fraction (target 1), the learnt threshold for stability, the drop-out threshold, the target recall probability for learning in progress and for learnt instances and the minimum distance between two repetitions (one day) are constants to be defined in the implementation strategy.

### Targets

1. Limit the number of learning in progress TaskDescription instances

Learning TaskDescription instances will take some repetitions until the level of mastery has raised to the point where the learner is confident of performing correctly.

To ensure that the learner can focus on a number of learning in progress TaskDescription instances the algorithm should only introduce new TaskDescription instances when others have already been learnt.

- The limit is global (over all categories) and proportional to the session size: at most `max(1, ceil(learningInProgressFraction * count))` TaskDescription instances may be learning in progress. Therefore all of them can be repeated within one session.
- A new TaskDescription is only introduced while the number of learning in progress instances, including those introduced earlier in the same session, is below the limit.
- Learnt instances do not count, they leave the learning in progress phase.

2. Assure constant repetition of learning in progress TaskDescription instances

TaskDescription instances once introduced into the learning process should be repeated regularly with low temporal distance until they are learnt.

- A learning in progress TaskDescription is repeated as soon as it is due. Its target recall probability is high, so the repetition happens after a few days at most.
- A TaskDescription is repeated at most once per day, so the temporal distance is at least one day. Repeating it in the same session twice is not wanted.
- If more learning in progress instances are due than fit into a session, those with the lowest recall probability come first.

3. Avoid unnecessary repetitions

TaskDescription instances that have been answered with a high level of correctness several times, preferably with temporal distance in between, have a high stability and a high mastery. They should be repeated with higher temporal distance to allow other TaskDescription instances to be learned.

- A TaskDescription that is not due is not scheduled as long as there are other candidates (due or eligible for introduction) to fill the session.
- The temporal distance until a TaskDescription becomes due again grows with its stability. No fixed intervals are prescribed.

4. Repeat learnt TaskDescription instances

TaskDescription instances that have already reached a high level of mastery should be repeated from time to time in order to assure they are constantly kept by the learner. In case a repetition is successful the temporal distance to the next repetition will even be greater (stability grows). The opposite goes if the repetition shows a low correctness. In that case the repetitions will become more frequent (stability shrinks).

- A learnt TaskDescription becomes due when its recall probability falls below its target recall probability, which is lower than that of learning in progress instances but greater than zero, so it is never dropped from repetition.
- Due learnt instances are ordered by their recall probability, the lowest comes first.

5. Related TaskDescription instances should be scheduled temporally close

- two TaskDescription instances are considered related if they have a category in common
- two TaskDescription instances are considered even more related if they are linked with confusedWith
- two TaskDescription instances are considered even more related if they are linked with equalTo

A link counts in both directions, regardless of which of the two TaskDescription instances declares it. The stronger the relation, the stronger the aim to schedule them temporally close: preferably within the same session, otherwise within a few days.

- This target only influences the choice among candidates. It never overrides the due conditions of targets 2 to 4, the limit of target 1 and the conditions of targets 6 to 8.
- If slots of a session remain after all due and eligible candidates have been chosen, TaskDescription instances related to the already chosen ones are preferred.

Exception: A TaskDescription that is related to a scheduled TaskDescription does not necessarily have to be scheduled if its relevance number is greater than the smallest relevance number of its category (it is less relevant than the most relevant TaskDescription instances of the category). If it has several categories the one with the smallest number counts.

6. Do not introduce TaskDescription instances of a lower relevance (greater number) before all TaskDescription instances of higher relevance (smaller number) have been learnt.

- This is a hard condition and global: it compares with all TaskDescription instances of all categories, not only those of the same category.
- A TaskDescription is eligible for introduction only if every TaskDescription with a smaller effective relevance is learnt.

7. Do not introduce TaskDescription instances with several subjects before each TaskDescription that holds a proper subset of those subjects has been learnt.

- Only non-empty proper subsets count. TaskDescription instances with exactly the same subjects do not block each other.
- It is a hard condition and global, it compares with all TaskDescription instances independent of their categories.
- It has precedence over targets 6 and 8 by means of the effective relevance and effective complexity, so that these targets never demand the opposite order.

8. Do not introduce TaskDescription instances as long as there are other TaskDescription instances in the same category that have the same effective relevance and a lower effective complexity and are not learnt yet.

- Relevance has precedence over complexity: TaskDescription instances of a different relevance are ordered by target 6 only. Complexity orders TaskDescription instances of the same relevance.
- "Same category" means at least one category in common.

### Precedence between targets

1. The conditions 6, 7 and 8 and the limit of 1 decide which TaskDescription instances may be introduced at all (hard conditions).
2. If not all candidates fit into a session, the slots are given to: due learning in progress instances (2), then due learnt instances (4), then newly introduced instances (1, 6 to 8). Within each group the lowest recall probability, respectively the lowest effective relevance and effective complexity comes first.
3. Target 5 reorders only otherwise equal candidates and fills remaining slots.
4. If still slots remain and nothing is due or eligible, the TaskDescription instances with the lowest recall probability are repeated to fill the session (target 3 gives way). If there are no candidates at all, fewer TaskDescription instances than requested are returned.
5. The selection is deterministic. Equal priorities are resolved by id. Unlike MEMORIZE it does not sample repetition times randomly.

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
