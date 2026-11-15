## consistency checks

[regExp.tasks.ts](./regExp.tasks.ts) contains the authored regExp tasks. When asked to check it for consistency, run every check listed here (use the `npx vitest run <file>` commands, never `npm test`, which starts watch mode), report each failing task by its expression, and do not change the task data unless asked to.

Prompt example: `Check regExp.tasks.ts for consistency.`

### checks

1. Examples fulfill their expression – [regExp.tasks.test.ts](./regExp.tasks.test.ts)
   - every entry of `positiveExamples` is matched by `expression`
   - no entry of `negativeExamples` is matched by `expression`
   - every task has at least one positive and at least one negative example
   - run it with `npx vitest run src/example/example.tasks/regExp2/regExp.tasks/regExp.tasks.test.ts`
   - on failure the test reports all offending examples of a task at once; decide per task whether the expression or the examples are wrong, e.g. alternation has the lowest precedence, so `/^x|y$/` means `^x` or `y$`, not `^(x|y)$`
2. `confusedWith` references existing tasks – [regExp.tasks.test.ts](./regExp.tasks.test.ts)
   - `confusedWith` lists expressions a learner could mistake for the task's own expression, so each of them must itself be the `expression` of another task; otherwise the confusion could never be practiced
   - every entry of `confusedWith` equals (same source and flags) the `expression` of a different task; a task listing its own expression fails
   - tasks without `confusedWith` are not checked
   - run it with the same command as check 1
   - on failure the test reports all unknown expressions of a task at once; either add a task for the missing expression, fix a typo in the entry, or remove the entry
3. `confusedWith` is symmetric – [regExp.tasks.test.ts](./regExp.tasks.test.ts)
   - principle: confusing two expressions is a relation between both of them, not a property of one. If task A lists the expression of task B in `confusedWith`, task B must list the expression of task A as well; e.g. `/^x|y$/` and `/^(x|y)$/` are listed in each other's `confusedWith`
   - this also holds for a task without `confusedWith`: as soon as another task lists its expression, it needs a `confusedWith` that lists the other task back
   - a task fails if it lists an expression of another task whose `confusedWith` does not contain the task's own expression; the failure is reported on the task with the one-way entry and names the tasks that do not list it back
   - run it with the same command as check 1
   - on failure add the missing reverse entry to the named tasks, or remove the one-way entry if the confusion is not plausible in both directions
4. Confused tasks are distinguishable by examples – [regExp.tasks.test.ts](./regExp.tasks.test.ts)
   - principle: two tasks linked via `confusedWith` are only worth practicing against each other if their examples show the difference. For every such pair at least one of the following holds: an example is a `positiveExamples` entry of one task and a `negativeExamples` entry of the other, or an example is a `negativeExamples` entry of one task and a `positiveExamples` entry of the other
   - the examples are compared as listed in the tasks (exact string equality), not evaluated against the other expression, so the distinguishing example has to be written into both tasks; reuse the same example in both tasks to make the commonalities and differences visible
   - the condition is symmetric, so a failing pair is reported on both tasks
   - run it with the same command as check 1
   - on failure add a distinguishing example to one of the two tasks, e.g. `'x'` as a negative example of `/^xyz$/`, because it is a positive example of `/^x|y|z$/`; if the two expressions match exactly the same strings, e.g. `/^((xy)|z)$/` and `/^(xy|z)$/` (the extra group is redundant), no example can distinguish them, so link them via `equalTo` (check 5) instead of `confusedWith`
5. `equalTo` tasks share their examples – [regExp.tasks.test.ts](./regExp.tasks.test.ts)
   - principle: `equalTo` is parallel to `confusedWith` and lists expressions of other tasks that match exactly the same strings as the task's own expression but are written differently, e.g. `/^((xy)|z)$/` and `/^(xy|z)$/` (the extra group is redundant). Because they match the same strings, no example can distinguish them, so they are not linked via `confusedWith` and are not checked by check 4
   - for every task that lists the expression of another task in `equalTo`, the sets of `positiveExamples` and the sets of `negativeExamples` of both tasks must be equal (order and duplicates are ignored); an example that is valid for one of them is valid for the other, so both tasks should show the same examples
   - link both tasks in each other's `equalTo`; the test only compares the examples of the pairs that are listed and does not check that the link is symmetric or that the listed expression exists
   - tasks without `equalTo` are not checked
   - run it with the same command as check 1
   - on failure the test names the expressions whose examples differ; adopt the missing examples in the task that lacks them (check 1 ensures they are valid), e.g. `'x'` was added as a negative example of `/^(xy|z)$/`

More checks will be added to this list in the future. Every new check is a vitest test next to [regExp.tasks.ts](./regExp.tasks.ts) and gets an entry here with its test file, what it asserts and its run command.
