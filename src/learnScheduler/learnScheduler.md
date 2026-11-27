# LearningScheduler

## General function

LearningScheduler is a class that selects subjects to be learned during the next learning session aiming to optimize the selection based on analyzing former results.

The scheduler is implemented in `learnScheduler.ts`.

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
  wasConfusedWith?: string[]; // ids of TaskDescription instances linked by confusedWith that the learner confused this TaskDescription with
}

export type SaveData = TimedResult[];
```

## Optimization targets of scheduling

The scheduling algorithm by assembleNextSession should be designed in a way to meet the following optimization targets.

The targets follow the spaced repetition model described in the section below: the learner is expected to forget exponentially with the time since the last repetition, correct repetitions slow down forgetting, incorrect ones speed it up, and the more likely an item is forgotten the more urgent its repetition is. Targets 2 to 4 are different views on this one principle. Targets 1 and 5 to 8 are about which TaskDescription instances take part in the learning process at all and in which order.

### Spaced repetition model

The model and the terminology are taken from Tabibian et al., "Enhancing human learning via spaced repetition optimization", PNAS 116(10), 2019 (algorithm MEMORIZE), https://pmc.ncbi.nlm.nih.gov/articles/PMC6410796/pdf/pnas.201815156.pdf. This section contains everything of it that is needed to understand the scheduler, the article itself is not required. The article calls the repeated things items, here they are TaskDescription instances.

- **Review events**: each repetition is a test. The learner either recalls the item (r = 1) or forgets it (r = 0). Here the correctness between 0 and 1 replaces that binary outcome.
- **Forgetting curve**: the probability to recall an item at time t is `m(t) = exp(-n * (t - tr))` with the time of the last repetition `tr` and the forgetting rate `n`. It starts at 1 at the repetition and decays exponentially. The inverse of the forgetting rate is called memory strength or half-life. The scheduler uses the half-life `S` (`n = ln(2) / S`), so `m(t) = 2^(-(t - tr) / S)`.
- **Effect of a repetition on the forgetting rate**: it is multiplicative. A successful recall multiplies the forgetting rate by `(1 - alpha)` with `alpha <= 1`, an unsuccessful one by `(1 + beta)` with `beta >= 0`. So successful repetitions make forgetting slower (the half-life grows), failed ones faster. The initial forgetting rate expresses the difficulty of an item: difficult items are forgotten faster. The parameters were estimated from data (half-life regression) in the article and are constants in the model.
- **Simplification of the article**: studies show that repeating an item while it is still in short-term memory (mass practice) does not improve long-term retention (inverted U shape). The article does not model it because it is hard to optimize and does not improve predictions on its data. The scheduler models it simply: a repetition on the same day as the previous one does not increase the stability.
- **Optimization problem**: reviewing an item more often keeps the recall probability high but costs repetitions. The article therefore minimizes a loss that rewards a high recall probability and penalizes the number of repetitions, weighted by a parameter `q` per item (a smaller `q` means more repetitions, a higher recall probability, and may favour the learning of one item over another).
- **Optimal reviewing intensity**: under that loss the optimal rate of repetitions of an item at time t is `u(t) = q^(-1/2) * (1 - m(t))`. It depends only on the current recall probability: the lower it is, i.e. the more likely the item is forgotten, the more urgent a repetition. MEMORIZE samples the actual repetition times randomly from that intensity.
- **Independence of items**: the model treats items as independent and runs one instance per item. Dependencies between items (a repetition influencing the memory of other items) are not part of it. The scheduler adds such dependencies itself (inherited repetitions via parents, related items in target 5).

How the scheduler uses the model, deviating from the article where it says so:

- The recall probability and the half-life are computed for each TaskDescription from its repetitions in the way defined in Computation of stability and recall probability.
- Instead of sampling random repetition times, a TaskDescription is due when its recall probability falls below a target recall probability. For a given `q` the intensity `u` grows linearly with `1 - m`, so reaching a certain `m` is equivalent to a certain urgency and the order by the lowest recall probability is the order by urgency. The two targets (learning and learnt) play the role of `q`: a higher target means more frequent repetitions.
- The selection is deterministic and made in sessions of a limited size, so the ranking by recall probability decides which of the due instances take part.
- After a repetition the recall probability is not always reset to 1 as in the article. It is set depending on the correctness, which is the article's remark that the recall probability right after a review may be below 1 for difficult items.

### Terms used by the targets

Everything is evaluated per TaskDescription instance (not per group of TaskDescription instances with equal characteristics).

- **recall probability**: the estimated probability that the learner answers correctly on a given day. It decreases with the days passed since the last repetition. How fast it decreases (the forgetting rate) is lowered by correct and raised by incorrect repetitions. A correctness between 0 and 1 acts as an interpolation between a fully correct and a fully incorrect repetition. The mastery (see below) must meet its four principles; whether mastery is the recall probability itself or derived from it is defined in the derived statistics.
- **stability**: the retention half-life in days that follows from the forgetting rate. In contrast to the recall probability it does not decay over time, it only changes through repetitions. It grows with correct repetitions, especially if they are spaced far apart, and shrinks with incorrect ones.
- **introduced**: a TaskDescription that has at least one repetition (see repetitions, this includes repetitions inherited from descendants).
- **learnt**: a TaskDescription whose stability has reached the learnt threshold at least once. It stays learnt for all conditions below, even if it later has to be repeated or its stability falls again. Otherwise a forgotten TaskDescription would block the introduction of others again.
- **learning in progress**: introduced but not learnt. If a learning in progress TaskDescription has not been repeated for so long that its recall probability fell below a drop-out threshold it is considered not learned again (does not count as learning in progress), so that abandoned instances cannot block the limit forever.
- **due**: the recall probability is lower than the target recall probability of its phase. The target is high for learning in progress instances (short temporal distance) and lower for learnt instances (long temporal distance). This corresponds to the parameter `q` of the spaced repetition model, which trades off recall probability against the number of repetitions per item.
- **eligible for introduction**: in learning state notLearned (never introduced or dropped out, see learning state) and passing the conditions of targets 1 and 6 to 8.
- **effective relevance / effective complexity**: the smallest relevance (complexity) of the TaskDescription itself and of all TaskDescription instances that have it as proper subset of their subjects (target 7). A TaskDescription that is a prerequisite of a more relevant (simpler) TaskDescription must not be blocked by the targets 6 and 8, otherwise they would contradict target 7.
- **optional fields**: a TaskDescription without relevance does not take part in target 6, without complexity not in target 8, without subjects (or with an empty list) not in target 7, without categories not in target 5 (via category) and 8. It is neither blocked nor does it block.
- **parameters**: the learning in progress fraction (target 1), the learnt threshold for stability, the drop-out threshold, the target recall probability for learning in progress and for learnt instances and the minimum distance between two repetitions (one day) are constants, they are defined in the parameters table of the implementation strategy.

### Targets

1. Limit the number of learning in progress TaskDescription instances

Learning TaskDescription instances will take some repetitions until the level of mastery has raised to the point where the learner is confident of performing correctly.

To ensure that the learner can focus on a number of learning in progress TaskDescription instances the algorithm should only introduce new TaskDescription instances when others have already been learnt.

- The limit is global (over all categories) and proportional to the session size: at most `max(1, ceil(learningInProgressFraction * count))` TaskDescription instances may be learning in progress. Therefore all of them can be repeated within one session.
- A new TaskDescription is only introduced while the number of learning in progress instances, including those introduced earlier in the same session, is below the limit.
- Learnt instances do not count, they leave the learning in progress phase.
- The limit only restricts the introductions of step 4. If slots of the session remain after all other candidates were chosen, further instances are introduced beyond the limit (see precedence between targets), so that the session has the requested size whenever enough instances are eligible for introduction.

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
4. If still slots remain and nothing is due or eligible within the limit of target 1, the TaskDescription instances with the lowest recall probability are repeated to fill the session (target 3 gives way).
5. If still slots remain, further TaskDescription instances eligible for introduction are introduced beyond the limit of target 1 (target 1 gives way, the conditions 6 to 8 still hold). If there are no candidates at all, fewer TaskDescription instances than requested are returned.
6. The selection is deterministic. Equal priorities are resolved by id. Unlike MEMORIZE (see spaced repetition model) it does not sample repetition times randomly.

## Derived statistics to base the scheduling on

All statistics are computed for a specific timestamp and a specific TaskDescription from SaveData. Only results with `result.timestamp <= timestamp` are taken into account, later ones are ignored. Timestamps are milliseconds as in TimedResult.timestamp (like `Date.now()`). The computations themselves are based on days, so timestamps and time spans are converted with `convertTimestampToDay` first. "Same day" always means the same integer part of the day (`Math.floor`).

### repetitions

A TaskDescription is considered to have been repeated on a day when a TimedResult with its id exists for that day or when a TimedResult exists for a TaskDescription that has it as parent or as indirect ancestor (transitively over `parents`). The correctness of such an inherited repetition is the correctness of the original result. Links by `confusedWith` and `equalTo` do not create repetitions, those relations are only used by target 5.

The repetitions of a TaskDescription are the list of these (day, correctness) pairs ordered by day. Several repetitions on the same day are allowed and are kept in the order in which they were recorded.

- **number of repetitions**: the length of that list.
- **last repetition**: the timestamp of the last element, undefined without repetitions.
- **last correctness**: the correctness of the last element, undefined without repetitions.

### stability

The retention half-life in days as defined in the terms of the targets. It is a result of replaying all repetitions of the TaskDescription in chronological order, see Computation of stability and recall probability. A TaskDescription without repetitions has no stability.

### recall probability and mastery

The recall probability is the estimated probability to answer correctly on the given day. It is 0 for a TaskDescription without repetitions. Otherwise it is derived from the stability, the last repetition and its correctness, see Computation of stability and recall probability.

The **mastery** is defined as exactly this recall probability. It is a value between 0 and 1 and fulfils the four principles of the mastery:

- It is greater with more repetitions with correct results, because each of them increases the stability.
- It is greater if the repetitions are more recent, because the recall probability declines with the days since the last repetition.
- It is greater if there are more correct results underneath the most recent repetitions, because repetitions are replayed in chronological order and every correct one increases and every incorrect one decreases the stability, so the most recent ones shape it most.
- It is greater if more time has passed between repetitions with correct results, because a correct repetition increases the stability more the lower the recall probability was at the time of the repetition.

**last mastery** is the recall probability immediately after the last repetition (undefined without repetitions).

### learnt

A TaskDescription is learnt if its stability was greater than or equal to the learnt threshold directly after at least one of its repetitions. Once learnt it stays learnt.

### due

A TaskDescription is due on a day if it has been introduced, is not dropped out (see learning state) and its recall probability is lower than the target recall probability of its phase: the learning target while it is not learnt, the learnt target once it is learnt.

### learning state

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

The learning state of a TaskDescription on a day is determined by the first matching rule:

1. No repetitions: `notLearned`.
2. Not learnt and recall probability lower than the drop-out threshold: `notLearned` (dropped out, its history is kept).
3. Not learnt: `learning`.
4. Learnt and recall probability lower than the learnt target (= due): `forRepeat`.
5. Otherwise: `learned`.

Consequences: only `learning` instances count as learning in progress (target 1). `notLearned` instances are the candidates for introduction. A learnt TaskDescription never returns to `learning` or `notLearned`, a bad repetition only makes it `forRepeat` more often.

### effective relevance and effective complexity

Defined in the terms of the targets. Computed once for all TaskDescription instances from the TaskDescription graph only (independent of results): the effective relevance of a TaskDescription is the minimum of its own relevance and the relevance of all TaskDescription instances whose subjects contain its subjects as non-empty proper subset. Missing values are ignored, if none exists the value is undefined. The effective complexity is computed in the same way from complexity.

### relatedness

Relatedness between two different TaskDescription instances A and B is a strength, links count in both directions:

- 3: A is in `equalTo` of B or B in `equalTo` of A
- 2: otherwise, A is in `confusedWith` of B or vice versa
- 1: otherwise, A and B have at least one category in common
- 0: otherwise (not related)

The strength of a TaskDescription towards a set of chosen TaskDescription instances is the maximum strength to any member of the set.

### more statistics

More statistics can be defined when ever necessary to find a good implementation strategy for the optimization targets.

## Implementation strategy

This paragraph is considered to define an implementation strategy for computing the former defined statistics and meeting the optimization targets for scheduling.

### Parameters

All parameters are constants (in `learnScheduler.constants.ts`). The values are start values that were checked against the example below. They may be tuned as long as the properties at the end of the scheduling strategy hold.

| parameter                       | value | meaning                                                                                      |
| ------------------------------- | ----- | -------------------------------------------------------------------------------------------- |
| initialStabilityDays            | 2     | stability before the first repetition                                                        |
| stabilityGain                   | 2     | maximum additional growth factor of the stability by a correct repetition                    |
| spacingFloor                    | 0.4   | share of the gain a correct repetition gets even without any elapsed time                    |
| failureFactor                   | 0.4   | factor of the stability for a fully incorrect repetition                                     |
| minStabilityDays                | 1     | lower bound of the stability                                                                 |
| maxStabilityDays                | 365   | upper bound of the stability                                                                 |
| failedRecallProbability         | 0.5   | recall probability right after a fully incorrect repetition                                  |
| learntStabilityDays             | 20    | stability from which a TaskDescription is learnt                                             |
| dropOutRecallProbability        | 0.1   | recall probability below which a not learnt TaskDescription is notLearned again              |
| learningTargetRecallProbability | 0.85  | due threshold while not learnt (parameter q of the spaced repetition model, short distances) |
| learntTargetRecallProbability   | 0.6   | due threshold once learnt (long distances)                                                   |
| learningInProgressFraction      | 0.5   | share of the session size that may be learning in progress (target 1)                        |
| relatedLookAheadDays            | 2     | how many days ahead a related TaskDescription is regarded as nearly due                      |

### Computation of stability and recall probability

Replay the repetitions of a TaskDescription (see repetitions) in chronological order. State: stability `S`, day `L` and recall probability right after the last repetition `R`. Before the first repetition `S = initialStabilityDays` and there is no `L` and `R`.

For each repetition with day `d` and correctness `c`:

1. Recall probability right before the repetition `before`: `1` for the first repetition, otherwise `R * 2^(-(d - L) / S)`.
2. Spacing `spacing = 1 - before`, so a repetition after a long time (low recall probability) counts as more spaced.
3. Growth factor for a fully correct repetition: `1 + stabilityGain * (spacingFloor + (1 - spacingFloor) * spacing)`. If the repetition is on the same day as the previous one it is `1` (mass practice does not improve the stability, see spaced repetition model).
4. Factor of the repetition: `growth^c * failureFactor^(1 - c)`. This interpolates between a correct and an incorrect repetition in the same way as the multiplicative effect on the forgetting rate in the spaced repetition model (a stability factor above 1 corresponds to `1 - alpha`, below 1 to `1 + beta`), and `c = 0.5` is neutral for the standard values.
5. New stability: `S * factor`, limited to `[minStabilityDays, maxStabilityDays]`.
6. `R = failedRecallProbability + (1 - failedRecallProbability) * c` and `L = d`.
7. If the new stability is at least `learntStabilityDays` the TaskDescription is learnt.

The recall probability (mastery) on a day `D >= L` is `R * 2^(-(D - L) / S)`. This is the exponential forgetting curve of the spaced repetition model with the half-life `S` (forgetting rate `ln(2) / S`). Results after `D` are not part of the repetitions, so `D >= L` always holds.

Example for perfect answers, each given on the first day it is due (rounded):

| repetition | day | stability | state after |
| ---------- | --- | --------- | ----------- |
| 1          | 0   | 3.6       | learning    |
| 2          | 1   | 7.2       | learning    |
| 3          | 3   | 14.5      | learning    |
| 4          | 7   | 29.2      | learned     |
| 5          | 29  | 66.8      | learned     |
| 6          | 79  | 152.7     | learned     |

With a correctness of 0.8 each time 7 repetitions are needed to be learnt, with 0.6 each time the stability does not leave the learning phase for a long time.

### Computation of learning state

Apply the rules of the learning state with `dropOutRecallProbability`, `learntStabilityDays` and `learntTargetRecallProbability` (see Parameters). The due flag uses `learningTargetRecallProbability` for TaskDescription instances that are not learnt and `learntTargetRecallProbability` for learnt ones. A TaskDescription in state `learning` that has dropped out is `notLearned`, but keeps its stability and history, so when it is repeated again it continues from there (a long pause gives a large spacing and thus a large growth for a correct repetition).

### Scheduling strategy based on statistics

`assembleNextSession` selects at most `count` TaskDescription instances for `day` in the following steps. A fractional count is rounded down for the number of available slots. It returns an empty array for `count <= 0` and fewer than `count` instances if there are not enough candidates. The order of the returned array is the order of selection. Whenever the order of candidates is not decided by the given criteria, the id decides (ascending), so the result is deterministic.

**Step 1: statistics.** Compute for all TaskDescription instances the learning state, the recall probability, the due flag, the effective relevance and complexity, and whether it has been **repeated today** (`lastRepetition` is defined and is on the same day as `day`; inherited repetitions count). TaskDescription instances repeated today are excluded from all selections below (once per day), but they still count for learning states, the learnt condition and the limit of learning in progress instances.

**Step 2: due learning in progress instances.** Candidates are all instances in state `learning` that are due. Order: recall probability ascending, then effective relevance ascending, then effective complexity ascending (undefined values last). Take them in that order while slots are left.

**Step 3: due learnt instances.** Candidates are all instances in state `forRepeat`. Order: recall probability ascending. Take them while slots are left.

**Step 4: introductions.** Only while slots are left and the room for learning in progress instances is greater than 0. The room is `max(1, ceil(learningInProgressFraction * count))` minus the number of instances in state `learning` (due or not, repeated today or not). Every introduced instance reduces the room by 1. Step 6 introduces further candidates ignoring the room. Candidates are the instances in state `notLearned` that fulfil all of the following conditions, evaluated on the learning states at `day` (instances chosen in this session do not count as learnt):

- Target 6: if it has an effective relevance, every instance with a smaller effective relevance is learnt.
- Target 7: every instance whose subjects are a non-empty proper subset of its subjects is learnt.
- Target 8: if it has an effective relevance, an effective complexity and categories, every instance that shares at least one category with it, has the same effective relevance and a smaller effective complexity is learnt.

Order of candidates: effective relevance ascending, effective complexity ascending (undefined last), then the relatedness preference (see below), then id. The candidate is picked one at a time, the relatedness preference is recalculated after each pick because the set of chosen instances grows.

**Step 5: fill.** If slots are left, fill them with introduced instances that are not chosen yet, are in state `learning` or `learned` (not due, otherwise they were chosen in step 2 and 3) and are not repeated today. Order: relatedness preference first, then nearly due before others, then recall probability ascending. An instance is nearly due if its recall probability on `day + relatedLookAheadDays` would be lower than its target recall probability. One at a time, the preference is recalculated after each pick.

**Step 6: further introductions.** If slots are left, the remaining candidates of step 4 (the conditions of targets 6 to 8 are unchanged) are introduced in the same order, one at a time, without the limit of learning in progress instances. This is needed because the room of step 4 is at most `ceil(learningInProgressFraction * count)`, which would otherwise leave slots of the session empty, e.g. in the first session.

**Relatedness preference (target 5).** A candidate has the preference if its relatedness strength to the set of already chosen instances is greater than 0 and the exception does not apply. A higher strength is preferred. The exception applies if the candidate has a relevance and categories and its relevance is greater than the smallest relevance found in the categories it belongs to (the smallest of the per category minimums, over all instances of that category). The preference only reorders otherwise equal candidates in step 4 and orders the fill in step 5, it never admits an instance that does not fulfil the conditions of the steps above.

**Properties that must hold** (basis for tests):

- Introductions in step 4 never exceed the limit of learning in progress instances, only step 6 may exceed it and only to fill otherwise empty slots.
- The session has `count` instances whenever enough instances are available (not repeated today and, if not introduced yet, eligible for introduction).
- No instance appears twice or is repeated on a day it has already been repeated.
- An instance with a smaller effective relevance is learnt before an instance with a greater one is introduced.
- Perfect answers at the moment they become due need 4 repetitions to be learnt (see example above); a never repeated learning in progress instance drops out and does not block the limit.
- The temporal distance between due repetitions grows with every perfect answer (rounded days in the example above: 1, 2, 4, 22, 50).
- A fully incorrect answer makes the instance due on the next day.
- Given the same SaveData, day and count the result is always the same.

## interface

### constructor

LearnScheduler's constructor is invoked with an array of TaskDescription instances. The LearningScheduler does not concern itself with what concrete tasks are behind those TaskDescription instances. Effective characteristics are computed from this array at construction.

### nextSession

The method nextSession requests a subset of the given TaskDescription instances to be learned in the next session which is based on the principles that are defined above. Count defines the number of TaskDescription instances to be put into that session. Time is a timestamp in milliseconds (default: now) and defines when that learning happens.

### recordResults

The method recordResults is invoked once a session is done. The parameter results maps each TaskDescription to the result of examining that task. The result can be understood as level of correctness. It is a number between 0 and 1.

### recordResult

The method recordResult records a single `Result` for the given timestamp in milliseconds (default: now), including its optional `wasConfusedWith`. Results of unknown TaskDescription ids are ignored, a correctness outside 0 to 1 throws. `recordResults` records each of its entries this way. The scheduler only stores `wasConfusedWith` with the result (it is part of SaveData); it does not influence the scheduling.

### get mastery

Returns the current level of mastery for each of the given TaskDescription instances
