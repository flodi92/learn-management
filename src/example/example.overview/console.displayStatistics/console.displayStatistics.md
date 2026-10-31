## ConsoleDisplayStatistics

The class `ConsoleDisplayStatistics` displays a recursive
`OverviewRecursiveUndeterminedStatistics<Statistics, GroupType>` value on the
console. `GroupType` describes the string values used by `groupType` and the
first value in each `parentGroups` tuple.
The display tree does not know what a statistics item contains. The caller
provides arrow functions for formatting an item, coloring an item, and sorting
children.

One layer is displayed in the following way. Only the root layer starts with a
line containing its own statistics. All other layers show their statistics in
the line of the child that represents them.

Each layer contains a `${childType} statistics` line followed by one line per
child. Children are indented one level deeper than that heading. A child line
contains the label (or id) and the formatted statistics of the child, so the
child statistics are visible without expanding it. A child `label` is shown
instead of its id and is not repeated in the statistics.

The focused child can be changed with the up and down arrow keys and is
indicated by a yellow `>`. The right arrow expands the focused child, shows its
`${childType} statistics` line and children, and moves the focus to the first
child. This can be repeated for deeper layers; pressing right on a child
without children has no effect. The left arrow moves the focus to the parent
child (the child expanded to show the focused child) and collapses its
expansion. In the first layer there is no parent, so pressing left has no
effect. Up and down do not expand or collapse anything.

All lines that appear when expanding are indented one level deeper than the
line that triggered the expansion. The layers are therefore indicated by an
increasing number of indentation. When an expanded child is focused, pressing
down moves the focus to that child's first child. There is only one focus for
all layers. The root statistics and `${childType} statistics` lines cannot be
focused.

### Number of shown children

At most `numberOfInitiallyShownChildren` children (defined in
`console.constants.ts`) are shown for each node, in the order given by the
sorting function. If there are more children, an ellipsis sign (`…`) follows
the last shown child, indented like the children. The ellipsis cannot be
focused and is always shown dimmed.

When the last shown child (or, if it is expanded, the last line of its
expansion) is focused and down is pressed, the next 15 children are added and
the focus moves to the first of them. This repeats until all children are
shown, at which point the ellipsis disappears. Loaded children stay visible
while the node is collapsed and expanded again.

### Sorting and formatting

Children are sorted by the sorting arrow function supplied to
`consoleDisplayStatistics`. Formatting and colors are likewise supplied by the
caller. This keeps the display tree independent of any particular statistics
model. The overview-specific sorting and formatting functions are documented
in `console.displayStatisticsItem.md`.

### Opacity

Everything is shown with the opacity `inactiveOpacity` defined in
`console.constants.ts`, except:

- the focused child line;
- child lines with the focused line somewhere below them (the parents of the
  focused child); and
- the root statistics line and the `${childType} statistics` line of every
  node with the focused line as a child or further below.

All siblings of the focused child and its parents, as well as lines below the
focused child, remain dimmed. A terminal cannot display partial opacity, so the
faint style (`chalk.dim`) is used for dimmed lines.

All actions that can be performed and their effects are explained by gray
help text printed above the display. The implementation uses existing
libraries where appropriate, uses a color scheme similar to
`regExp.taskPresenter.ts`, and takes all colors from `console.constants.ts`.
