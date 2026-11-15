## consistency checks

[regExp.tasks.ts](./regExp.tasks.ts) contains the authored regExp tasks. When asked to check it for consistency, run every check listed here (use the `npx vitest run <file>` commands, never `npm test`, which starts watch mode), report each failing task by its expression, and do not change the task data unless asked to.

Prompt example: `Check regExp.tasks.ts for consistency.`

### checks

1. Examples fulfill their expression – [regExp.tasks.test.ts](./regExp.tasks.test.ts)
   - every entry of `positiveExamples` is matched by `expression`
   - no entry of `negativeExamples` is matched by `expression`
   - run it with `npx vitest run src/example/example.tasks/regExp2/regExp.tasks/regExp.tasks.test.ts`
   - on failure the test reports all offending examples of a task at once; decide per task whether the expression or the examples are wrong, e.g. alternation has the lowest precedence, so `/^x|y$/` means `^x` or `y$`, not `^(x|y)$`

More checks will be added to this list in the future. Every new check is a vitest test next to [regExp.tasks.ts](./regExp.tasks.ts) and gets an entry here with its test file, what it asserts and its run command.
