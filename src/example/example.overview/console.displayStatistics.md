## ConsoleDisplayStatistics

The class ConsoleDisplayStatistics is a console tool to display the statistics of type OverviewRecursiveStatistics on the console.
The type OverviewRecursiveStatistics is recursive. ConsoleDisplayStatistics only shows the children of a statistic if it has been expanded.

One layer is displayed in the following way.
Only the root layer starts with a line containing its own statistics (see "Display of the statistics" below). All other layers show their statistics in the line of the child that represents them (see below).

Then there is a line `${childType} statistics`;
Underneath, it lists all the values of children, one per line. All children are indented one level deeper than the line `${childType} statistics`. Each child line consists of the label (or the id if there is no label) followed by the statistics of the child, so the statistics of a child are visible without expanding it. The focused child can be changed by the arrow keys up and down and is indicated by a yellow colored >.
Pressing the arrow right key expands the focused child and shows the line `${childType} statistics` and the children of that child in the same way as already described for one layer. Its children can be expanded again and so on. Pressing the arrow right key again on an expanded child collapses it again (toggle). Pressing it on a child without children of its own has no visible effect.
All lines that appear when expanding (`${childType} statistics` and the children) are indented one level deeper than the line that triggered the expansion. The layers are therefore indicated by an increasing number of indentation.
Having focused one expanded child and pressing the arrow down key the focus jumps to that child's first child. There is only one focus for all layers. The root statistics line and the `${childType} statistics` lines cannot be focused.
When a child statistic has a `label`, display the label instead of its id. The label is shown only once (as the name of the line) and is not repeated in the statistics.

### Sorting of the children

The children of a layer are sorted by `sortChildren` in console.displayStatistics.utils.ts.

- Children with an OverviewAggregatedStatisticsItem: the child with the highest share of `learned` comes first. If the shares are equal, the highest share of `learning` comes first. If these are equal, too, the lowest share of `notLearned` comes first. The shares are not the absolute numbers but the numbers normalized by the sum of notLearned, learning, learned and forRepeat (a sum of 0 results in the share 0).
- Children with an OverviewSubjectStatisticsItem: the highest `mastery` comes first.
- Children that are equal in all compared values keep their original order.

### Display of the statistics

The statistics of a line are formatted by `formatStatistics` in console.displayStatistics.utils.ts. It determines the type of the statistics (`isOverviewSubjectStatisticsItem`) and delegates to `formatSubjectStatistics` or `formatAggregatedStatistics`. Only the line that has the focus shows the additional details. The statistics of the root line are never focused and therefore show the short form.

The id or label of a child is colored like its statistics (`getStatisticsColor`): in the color of the learning state for an OverviewSubjectStatisticsItem, in the color of the learning state with the highest number for an OverviewAggregatedStatisticsItem.

### Opacity of the lines

Everything is shown with the opacity `inactiveOpacity` defined in console.constants.ts, except

- the focused child line,
- the child lines that have the focused line somewhere below them (the parents of the focused child), and
- the root statistics line and the `${childType} statistics` line of every node that has the focused line as a child or further below.

All siblings of the focused child (and of its parents) as well as the lines below the focused child remain dimmed. A terminal cannot display partial opacity, so the faint style (chalk.dim) is used for the dimmed lines.

OverviewAggregatedStatisticsItem

- `⌀ ${avgLastRepetitionBeforeDays} days before ` followed by the numbers of notLearned, learning, learned and forRepeat. Each number has the color of its learning state, the names of the learning states are not shown.
- Focused line: every number is preceded by its learning state in separate words, e.g. `not learned: 153`.

OverviewSubjectStatisticsItem

- `${learningState} (${Math.round(mastery * 100)}%)`, all in the color of the learning state, followed by `${numberOfRepetitions}x ${lastRepetitionBeforeDays} days before`.
- Focused line: all other values (e.g. lastMastery, lastCorrectness) are appended as `name: value` with the name transformed from camel case to separate words, e.g. `last mastery: 0.5`.

All actions that can be performed (which keys have which effect) should by explained by gray a console.log

Try to use already existing libraries for that job.
Use a color scheme similar to that used in the file regExp.taskPresenter.ts
All colors are defined in console.constants.ts.
