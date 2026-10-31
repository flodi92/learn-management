## Console display statistics items

This module supplies the overview-specific arrow functions used by
`ConsoleDisplayStatistics`:

- `formatStatistics` formats `OverviewStatistics`, using the short form for
  unfocused lines and the detailed form for the focused line.
- `getStatisticsColor` colors a subject by its learning state and aggregated
  statistics by their dominant learning state.
- `compareStatistics` sorts subjects by decreasing mastery and aggregated
  statistics by learned share, learning share, and then increasing not-learned
  share. Equal values retain their original order. Shares are normalized by
  the sum of `notLearned`, `learning`, `learned`, and `forRepeat`; a sum of
  zero produces a share of zero.

The formatter determines the item type with `isOverviewSubjectStatisticsItem`
and delegates to `formatSubjectStatistics` or
`formatAggregatedStatistics`. Only a focused line shows additional details;
the root line is never focused and therefore uses the short form. A child's id
or label is followed by a colon colored by `getStatisticsColor`.

### OverviewAggregatedStatisticsItem

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
