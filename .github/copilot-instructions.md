# Project Guidelines

TypeScript (ESM, `strict`) project for generating learning tasks and scheduling spaced repetition. See the Documentation Index below.

## Code Style

- Formatting is handled by Prettier (`.prettierrc`: single quotes, one attribute per line). Run `npm run prettify` after larger edits.
- Files are named `<module>.<topic>.ts`, e.g. `overview.computeStatistics.ts`, with types in `<module>.<topic>.model.ts` and tests in `<module>.test.ts`.
- Shared domain types live in [src/model.ts](../src/model.ts); shared helpers in [src/utils.ts](../src/utils.ts).
- Do not write comments unless explicitly asked

## Architecture

- `src/learnScheduler/` – scheduling of learn sessions.
- `src/overview/` – learning progress statistics, grouped by relevance/category.
- `src/userInterface/` – presentation of tasks.
- `src/example/` – runnable examples and sample data.

## Build and Test

- Tests: `npx vitest run` (vitest with globals; auto-approved in `.vscode/settings.json`). `npm test` starts watch mode, so avoid it.
- Run examples: `npm run start-overview`, `npm run start-regExp`.
- Format: `npm run prettify`.

## Conventions

- Add or update vitest tests when changing scheduler or statistics logic.
- Keep changes small and focused; don't refactor unrelated code.
- Keep the language of an existing file when editing it. Code and identifiers are English.
- Whenever you add a markdown file, link it with a one-line description in the Documentation Index below, in the matching group (create a group if none fits). Update or remove the entry when the file is changed in purpose, renamed or deleted. Exception: files covered by the Context Blacklist are not linked.

## Context Blacklist

Do not read, search, link or use as context, unless the user explicitly names the file in the prompt:

- everything in `wiki/`
- everything in `drafts/`
- every file ending with `.todo.md`
- `src/learnScheduler/learnScheduler.utils/getMastery.md`

Also exclude these paths from codebase-wide searches and summaries.

## Documentation Index

Read the relevant file before working in the corresponding area.

**Learn scheduler**

- [src/learnScheduler/learnScheduler.md](../src/learnScheduler/learnScheduler.md) – how `LearningScheduler` selects subjects for the next session and the principles behind it.

**Overview**

- [src/example/example.overview/console.displayStatistics/console.displayStatistics.md](../src/example/example.overview/console.displayStatistics/console.displayStatistics.md) – `ConsoleDisplayStatistics`: rendering of the recursive statistics tree in the console. It is important that this files does not make any assumptions about which data is included by statistics if that is the case use `console.displayStatisticsItem.utils.md`
- [src/example/example.overview/console.displayStatisticsItem.utils/console.displayStatisticsItem.utils.md](../src/example/example.overview/console.displayStatisticsItem.utils/console.displayStatisticsItem.utils.md) – formatting, coloring and sorting functions for statistics items.

**RegExp tasks**

- [src/example/example.tasks/regExp/regExp.md](../src/example/example.tasks/regExp/regExp.md) – **guidelines for authoring regExp tasks and examples; follow when adding or editing them.**
- [src/example/example.tasks/regExp/regExp.taskPresenter/regExp.taskPresenter.md](../src/example/example.tasks/regExp/regExp.taskPresenter/regExp.taskPresenter.md) – `RegExpTaskPresenter`: console interaction for classifying examples.
