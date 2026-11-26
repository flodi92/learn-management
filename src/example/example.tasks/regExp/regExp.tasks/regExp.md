## consistency checks

[regExp.taskDescriptions.ts](./regExp.taskDescriptions.ts) contains the authored regExp task descriptions. When asked to check it for consistency, run every check listed here (use the `npx vitest run <file>` commands, never `npm test`, which starts watch mode), report each failing task description by its expression, and do not change the task descriptions unless asked to.

Prompt example: `Check regExp.taskDescriptions.ts for consistency.`

### checks

1. Examples fulfill their expression – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - every entry of `positiveExamples` is matched by `expression`
   - no entry of `negativeExamples` is matched by `expression`
   - every task description has at least one positive and at least one negative example
   - every task description has at least four examples in total, i.e. the number of `positiveExamples` plus the number of `negativeExamples` is 4 or more; the examples do not have to be split evenly between both kinds, and on failure add examples that illustrate the expression until the total is reached
   - run it with `npx vitest run src/example/example.tasks/regExp/regExp.tasks/regExp.taskDescriptions.test.ts`
   - on failure the test reports all offending examples of a task description at once; decide per task description whether the expression or the examples are wrong, e.g. alternation has the lowest precedence, so `/^x|y$/` means `^x` or `y$`, not `^(x|y)$`
2. `confusedWith` references existing task descriptions – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - `confusedWith` lists expressions a learner could mistake for the task description's own expression, so each of them must itself be the `expression` of another task description; otherwise the confusion could never be practiced
   - every entry of `confusedWith` equals (same source and flags) the `expression` of a different task description; a task description listing its own expression fails
   - task descriptions without `confusedWith` are not checked
   - run it with the same command as check 1
   - on failure the test reports all unknown expressions of a task description at once; either add a task description for the missing expression, fix a typo in the entry, or remove the entry
3. `confusedWith` is symmetric – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - principle: confusing two expressions is a relation between both of them, not a property of one. If task description A lists the expression of task description B in `confusedWith`, task description B must list the expression of task description A as well; e.g. `/^x|y$/` and `/^(x|y)$/` are listed in each other's `confusedWith`
   - this also holds for a task description without `confusedWith`: as soon as another task description lists its expression, it needs a `confusedWith` that lists the other task description back
   - a task description fails if it lists an expression of another task description whose `confusedWith` does not contain the task description's own expression; the failure is reported on the task description with the one-way entry and names the task descriptions that do not list it back
   - run it with the same command as check 1
   - on failure add the missing reverse entry to the named task descriptions, or remove the one-way entry if the confusion is not plausible in both directions
4. Confused task descriptions are distinguishable by examples – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - principle: two task descriptions linked via `confusedWith` are only worth practicing against each other if their examples show the difference. For every such pair at least one of the following holds: an example is a `positiveExamples` entry of one task description and a `negativeExamples` entry of the other, or an example is a `negativeExamples` entry of one task description and a `positiveExamples` entry of the other
   - the examples are compared as listed in the task descriptions (exact string equality), not evaluated against the other expression, so the distinguishing example has to be written into both task descriptions; reuse the same example in both task descriptions to make the commonalities and differences visible
   - the condition is symmetric, so a failing pair is reported on both task descriptions
   - run it with the same command as check 1
   - on failure add a distinguishing example to one of the two task descriptions, e.g. `'x'` as a negative example of `/^xyz$/`, because it is a positive example of `/^x|y|z$/`; if the two expressions match exactly the same strings, e.g. `/^((xy)|z)$/` and `/^(xy|z)$/` (the extra group is redundant), no example can distinguish them, so link them via `equalTo` (check 5) instead of `confusedWith`
5. `equalTo` task descriptions share their examples – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - principle: `equalTo` is parallel to `confusedWith` and lists expressions of other task descriptions that match exactly the same strings as the task description's own expression but are written differently, e.g. `/^((xy)|z)$/` and `/^(xy|z)$/` (the extra group is redundant). Because they match the same strings, no example can distinguish them, so they are not linked via `confusedWith` and are not checked by check 4
   - for every task description that lists the expression of another task description in `equalTo`, the sets of `positiveExamples` and the sets of `negativeExamples` of both task descriptions must be equal (order and duplicates are ignored); an example that is valid for one of them is valid for the other, so both task descriptions should show the same examples
   - link both task descriptions in each other's `equalTo`; the test only compares the examples of the pairs that are listed and does not check that the link is symmetric or that the listed expression exists
   - task descriptions without `equalTo` are not checked
   - run it with the same command as check 1
   - on failure the test names the expressions whose examples differ; adopt the missing examples in the task description that lacks them (check 1 ensures they are valid), e.g. `'x'` was added as a negative example of `/^(xy|z)$/`
6. `subjects` are derived from the expression – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - principle: the `subjects` of a task description are not authored freely, they are exactly the subjects that [getSubjectsFromExpression](./regExp.utils/regExp.subjects.ts) finds in its `expression`; the function is the single definition of which subject an expression part belongs to
   - the `subjects` of a task description and the result of `getSubjectsFromExpression(expression)` must contain the same entries (order is ignored); `subjects` is a required attribute of every task description, so a task description without subjects in its expression has `subjects: []`
   - consequences of the function's rules: a literal character like `x` is never a subject, `^` and `$` are only subjects if just one of them is used (an expression anchored on both ends has neither, e.g. `/^xyz$/` has `subjects: []`), `anywhere` is a subject if neither is used, and flags like `g` or `i` are subjects too
   - run it with the same command as check 1
   - on failure the test shows the `subjects` of the task description and the derived ones; adopt the derived ones in the task description, e.g. `/^(x|y)$/` has `['x|y', '(x)']`; if a derived subject is wrong for the expression, fix [regExp.subjects.ts](./regExp.utils/regExp.subjects.ts) and its test [regExp.subjects.test.ts](./regExp.utils/regExp.subjects.test.ts) instead of the task description
7. `categories` cover the subjects – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - principle: every subject has a category in `regExpSubjectDefinitions` in [regExp.model.ts](./regExp.model.ts); the `categories` of a task description list the categories of everything it teaches, so no category of one of its subjects may be missing
   - `categories` is a required attribute of every task description; for each entry of `subjects` and of the optional `extraSubjects` (subjects a task description teaches that [getSubjectsFromExpression](./regExp.utils/regExp.subjects.ts) does not derive from the expression, e.g. the literal `x` or the anchors of `/^xyz$/`) the category of its definition must be contained in `categories`; the order is ignored and a category is listed once, e.g. `/^[xyz]+$/` has `['characterClass', 'quantifier']`
   - the test only reports missing categories, so adopt exactly the categories of the subjects and extra subjects and do not add others
   - run it with the same command as check 1
   - on failure the test names the missing categories of a task description; add them to `categories`, and when `subjects` or `extraSubjects` of a task description change, update its `categories` as well
8. `parents` are derived from the subjects – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - principle: a task description builds on the task descriptions that teach only a part of its subjects, so the learning order follows from the `subjects` of the task descriptions; the `parents` of a task description are the expressions that [getParentExpressions](./regExp.utils/regExp.parents.ts) finds among all task descriptions, they are not authored freely
   - `parents` is a required attribute of every task description; it must contain the same expressions as `getParentExpressions(task, initialTaskDescriptions)` (order is ignored and expressions are compared by source and flags); a task description without parents has `parents: []`
   - consequences of the function's rules: a parent is a task description whose `subjects` are a proper subset of the `subjects` of the task description, task descriptions with identical `subjects` are not parents of each other, and only direct parents are listed, i.e. a parent is left out if another parent already contains its `subjects`; only `subjects` count, `extraSubjects` are ignored; the task description with `subjects: []`, e.g. `/^xyz$/`, is the parent of every task description that has no more specific parent
   - run it with the same command as check 1
   - on failure the test shows the `parents` of the task description and the derived ones; adopt the derived ones in the task description, e.g. `/^[xyz]+$/` has `[/^[xyz]$/, /^x+$/, /^[0-9]$/]`; when the `subjects` of a task description change or a task description is added or removed, update the `parents` of all task descriptions affected; if a derived parent is wrong, fix [regExp.parents.ts](./regExp.utils/regExp.parents.ts) and its test [regExp.parents.test.ts](./regExp.utils/regExp.parents.test.ts) instead of the task description
9. Expressions are unique – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
   - principle: the `expression` identifies a task description; `confusedWith`, `equalTo` and `parents` refer to other task descriptions by their expression, so no two task descriptions may share one
   - no expression (same source and flags) is the `expression` of more than one task description; this is checked first in the test file, before the checks of the single task descriptions
   - run it with the same command as check 1
   - on failure the test lists all duplicated expressions at once; remove the duplicate task description, or merge its examples and attributes into the other task description if they differ, or change the expression if the task descriptions are meant to teach different things
10. `relevance` is the maximum of the subjects – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
    - principle: every subject has a `relevance` in `regExpSubjectDefinitions` in [regExp.model.ts](./regExp.model.ts) (`1`, `2` or `3`); a task description teaches several subjects, and its `relevance` is the maximum of the relevances of all of them, so it is never lower than the relevance of one of its subjects
    - `relevance` is a required attribute of every task description; it must equal the maximum of the `relevance` of the definitions of all entries of `subjects` and of the optional `extraSubjects`, e.g. `/^[xyz][^xyz]$/` has `2` because `[^xyz]` has `2` while `[xyz]` has `1`; the maximum is the numerically highest value
    - run it with the same command as check 1
    - on failure the test names the task description with its `relevance` and the expected one; adopt the maximum, and when `subjects` or `extraSubjects` of a task description change or the `relevance` of a subject definition is changed, update the `relevance` of all task descriptions affected
11. `complexity` is derived from the expression – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
    - principle: the `complexity` of a task description is not authored freely, it is exactly what [getComplexityOfExpression](./regExp.utils/regExp.complexity.ts) returns for its `expression`; the function is the single definition of how complex an expression is
    - `complexity` is a required attribute of every task description; it must equal `getComplexityOfExpression(expression)`
    - consequences of the function's rules: the complexity depends on the number of subjects that [getSubjectsFromExpression](./regExp.utils/regExp.subjects.ts) finds in the expression, so `extraSubjects` do not count: up to 2 subjects give `1`, 3 or 4 subjects give `2`, more give `3`, e.g. `/^xyz$/` with no subjects has `1` and `/^((xy)|z)+$/` with the 3 subjects `x|y`, `(x)` and `x+` has `2`
    - run it with the same command as check 1
    - on failure the test names the task description with its `complexity` and the expected one; adopt the derived one, and when the `expression` of a task description changes, update its `complexity` as well; if a derived complexity is wrong, fix [regExp.complexity.ts](./regExp.utils/regExp.complexity.ts) instead of the task description
12. `confusedWith` is widely used – [regExp.taskDescriptions.test.ts](./regExp.taskDescriptions.test.ts)
    - principle: `confusedWith` only helps the learner if it is maintained for most of the task descriptions, so it must not be left out as an optional extra
    - at least 75% of all task descriptions have a non-empty `confusedWith`; this is a share of the whole list, so a single task description without `confusedWith` is fine, and the test is not run per task description
    - run it with the same command as check 1
    - on failure the test names how many of the task descriptions use `confusedWith`; add `confusedWith` to further task descriptions, in both directions as required by checks 3 and 4, until the share is reached

More checks will be added to this list in the future. Every new check is a vitest test next to [regExp.taskDescriptions.ts](./regExp.taskDescriptions.ts) and gets an entry here with its test file, what it asserts and its run command.
