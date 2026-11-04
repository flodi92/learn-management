# Project Guidelines

TypeScript (ESM, `strict`) project for generating learning tasks and scheduling spaced repetition. See the Documentation Index below.

## Code Style

- Formatting is handled by Prettier (`.prettierrc`: single quotes, one attribute per line). Run `npm run prettify` after larger edits.
- Shared domain types live in [src/model.ts](../src/model.ts); shared helpers in [src/utils.ts](../src/utils.ts).
- Do not write comments unless explicitly asked

## Naming Conventions

Follow the style of the surrounding files.

**Files and folders**

- camelCase with dot-separated segments: `<module>.<name>[.<kind>].<ext>`. Kinds are e.g. `model`, `constants`, `utils`, `main`, `test`.
- One main export per file, the file is named like it. Tests, docs and folders are named after what they cover and sit next to it.
- Folders are `<module>.<topic>/`, those in `src/example/` start with `example.`.

**Identifiers**

- PascalCase for classes, interfaces, types and type parameters (descriptive words, `T` only for pass-through helpers); camelCase for everything else, including constants and string-literal values. No enums, no UPPER_SNAKE_CASE, no default exports.
- Functions are arrow functions with verb-first names (`compute…`, `get…`, `determine…`, `is…` for predicates).
- Prefix a module's types with the module name (`RegExpTask`); parameter-object types are `<FunctionName>Props`.
- Collections are plural, counts are `numberOf…`, booleans read as statements (`isFocused`), units are part of the name (`…Days`), backing fields of accessors start with `_`.
- Spell it `regExp` and `dataBase`.
- Tests: `describe` names the unit under test, `it` describes behavior in third person.

## Architecture

Everything in `src/` except `src/example/` is generic: it makes no assumptions about how things are visualized, which tasks or subjects are learned, or which database is used. Those concerns are injected through abstractions such as `TaskPresenter`, `SaveDataBase` and `Overview<Subject>`.

- `src/learnScheduler/` – scheduling of learn sessions.
- `src/overview/` – learning progress statistics, grouped by relevance/category.
- `src/userInterface/` – abstract presentation of tasks.
- `src/example/` – examples of how the generic implementations can be used, runnable via the npm scripts below. Every choice made there is just one possible way and can be replaced, e.g. a web app could display things differently and tasks for other subjects could be created:
  - `example.dataBase/` – how a database is created (SQLite).
  - `example.overview/` – how statistics are displayed on the console.
  - `example.tasks/regExp/` – which tasks could be used (regular expressions) and how they are displayed on the console.
- Put anything specific to visualization, a task subject or a database into `src/example/`, never into generic code. Generic code must not import from `src/example/`.

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
