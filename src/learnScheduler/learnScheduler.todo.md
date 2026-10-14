# LearningScheduler Todos

- subjects can be combined
  - de-select if possible
- subjects can have parameters
- subjects can have a introduction and a task. The introduction is performed when the subject is introduced or after a very bad result.
- related subjects
- numbers for repetitions and forget are computed
- presentation of current results with various numbers
  - mastery
  - number of repetitions
  - last repetition
  - sunk mastery since last repetition
- learning plan => shows me which steps to do and when to win
- scheduling within a session

---

## Combining Principles

Learning subjects can be combined to form a unity. Tasks representing combined subjects will include all objects.

### 1

When one combined subject is repeated all the underlaying subjects are automatically considered as repeated as well and their level of mastery is computed accordingly.

### 2

A combined subject can only be scheduled once all the underlaying subjects have reached a high level of mastery.

### 3

When a combined learning subject is repeated with a low correctness it should be destructed into subsets of combined subjects to be examined in the following repetitions (in the same session and following sessions). The mistake in such a bad repetition can give a hint on which subsets to focus for the following repetions.

## Hierarchy Prinziples

Learning subjects can be clustered by belonging to groups, subgroups etc., using a composite pattern to allow for a variable hiearchy depth.

This hieararchy determines the degree of relationship between two subjects.

## 1

The scheduler aims to an optimal level of relationship clustering between subject to be introduced in a short period of time. Neither should there be just a single cluster of related subjects nor should there be a high amount of unrelated clusters.

## 2

Items that are repeated during a session should be ordered by their relation to each other.

## Relevance Principles

Subjects can be asigned to a level of relevance.

## 1

Subjects of high relevance are preferred over subjects of low relevance.

## Scaling principles

Certain Scales might be assigned to hierarchy groups or subjects. They might raise the level of difficulty.

### 1

Start with a low scale for each subject or combined subject. When the subject is examined with high correctness raise the scale, when examined with low correctness lower the scale

### 2

To compute the level of mastey with respect to a certain scale value all correct results of repetitions with higher scale value are considered and all incorrect results of repetitions with lower scale value are considered. (@todo What does that mean if correctnessis is a continuous value between 0 and 1?)
