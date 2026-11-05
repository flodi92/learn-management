## Console display statistics items

This module supplies the overview-specific arrow functions used by
`ConsoleDisplayStatistics`:

- `formatStatistics` formats `OverviewStatistics`, using the short form for
  unfocused lines and the detailed form for the focused line. The root line is
  rendered in the detailed form.
- `getStatisticsColor` colors a subject by its learning state and aggregated
  statistics by their dominant learning state.
- `compareStatistics` sorts subjects by decreasing mastery and aggregated
  statistics by learned share, learning share, and then increasing not-learned
  share. Equal values retain their original order. Shares are normalized by
  the sum of `notLearned`, `learning`, `learned`, and `forRepeat`; a sum of
  zero produces a share of zero.

The formatter determines the item type with `isOverviewSubjectStatisticsItem`
and delegates to `formatSubjectStatistics` or
`formatAggregatedStatistics`. Only a focused line shows additional details, except for the root line, which
always uses the detailed form. A child's id or label is followed by a
colon colored by `getStatisticsColor`.

### OverviewAggregatedStatisticsItem

- Every aggregated line starts with a selection indicator derived from
  `selectionState`, followed by `selected: ${selected}, `, the number of
  subjects whose ids are selected. The indicator is a three-character text
  taken from `selectionStateIndicators` in `console.constants.ts`:
  `implicitNoSelection` is three spaces, `implicitSelection` and
  `implicitFullSelection` are `[*]`, `explicitSelectionUnselections` and
  `explicitSelection` are `[+]`, and `explicitUnselection` is `[-]`. The
  states `implicitFullSelection`, `explicitSelection` and
  `explicitUnselection` are weakly highlighted with a slight yellow
  background (`selectionHighlightColor`). Unfocused lines show the indicator
  text in gray (`unfocusedSelectionColor`) whatever the state is; the
  background highlight is kept.
- The short form contains the numbers of `notLearned`, `learning`, `learned`
  and `forRepeat`, followed by
  `⌀ ${avgLastRepetitionBeforeDays} days before`. Each number has the color of
  its learning state and the state names are omitted. An infinite average is
  shown as `never trained` instead of `⌀ Infinity days before`.
- In the focused form, every number is preceded by its learning state in
  separate words, for example `not learned: 153`. All data is separated by
  commas.

### OverviewSubjectStatisticsItem

- The short form contains only
  `${Math.round(mastery * 100)}%`, colored by the learning state, without
  brackets or the state name.
- The focused form contains
  `${learningState} (${Math.round(mastery * 100)}%)`, all colored by the
  learning state, followed by
  `${numberOfRepetitions}x ${lastRepetitionBeforeDays} days before`. If
  `lastRepetitionBeforeDays` is infinite, only `${numberOfRepetitions}x` is
  shown. Other values, such as `lastMastery` and `lastCorrectness`, are
  appended as `name: value`, with camel-case names transformed into separate
  words, for example `last mastery: 0.5`.
