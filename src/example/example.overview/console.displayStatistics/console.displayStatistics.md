## ConsoleDisplayStatistics

The class `ConsoleDisplayStatistics` displays a recursive
`OverviewRecursiveUndeterminedStatistics<Statistics, GroupType>` value on the
console. `GroupType` describes the string values used by `defaultGroupType`,
`possibleGroupTypes` and the first value in each `parentGroups` tuple.
Children are only read through `getChildren(groupType)` for the currently chosen
group type of a node, never through a `children` attribute.
The display tree does not know what a statistics item contains. The caller
provides arrow functions for formatting an item, formatting the details of an
item, coloring an item, sorting children, and toggling a group selection. The caller also provides an observable
for the current subject selection. The display reads it while rendering; it
does not store selection state itself.

One layer is displayed in the following way. Only the root layer starts with a
line containing its own statistics. The root statistics use the detailed
format. Every aggregated line starts with a selection indicator and the number of selected items. All
other layers show their statistics in the line of the child that represents
them.

Each layer contains a `${groupType} statistics` heading line followed by one line
per child. The heading shows the currently chosen group type of that layer,
which is `defaultGroupType` initially. It is focusable (yellow `>`); left and
right toggle the chosen group type through the selectable group types, which
are `possibleGroupTypes` plus `defaultGroupType` if that is missing there (as
for `taskDescription`). The choice is kept per node. Focus and expansion are
identified by a path of `[groupType, key]` pairs, so equal keys of different
group types do not clash. Children are indented one level deeper than that heading. A child line
contains the label (or id) and the formatted statistics of the child, so the
child statistics are visible without expanding it. A child `label` is shown
instead of its id and is not repeated in the statistics.

The focused child can be changed with the up and down arrow keys and is
indicated by a yellow `>`. The right arrow expands the focused child, shows its
`${groupType} statistics` line and children, and moves the focus to the first
child. This can be repeated for deeper layers; pressing right on a child
without children and without details has no effect. The left arrow moves the focus to the parent
child (the child expanded to show the focused child) and collapses its
expansion. In the first layer there is no parent, so pressing left has no
effect. Up and down do not expand or collapse anything. Pressing space toggles
the selection of the focused group or subject. A group cycles through explicitly
selected (`true`), explicitly unselected (`false`), and unspecified
(`undefined`). A subject only toggles between selected (`true`) and unspecified
(`undefined`), it never becomes explicitly unselected.
The most recent toggle wins over earlier ones for the subjects they have in
common, independent of the group types of the parent groups.

Subject lines start with a three-character selection indicator that uses the
subject selection observable: a selected subject is marked `[+]`, while an
unspecified subject has three spaces. The indicator of group lines is part of
their formatted statistics (see `console.displayStatisticsItem.utils.md`).
Selection indicators come from the current observables and are not retained by
the display.

All lines that appear when expanding are indented one level deeper than the
line that triggered the expansion. The layers are therefore indicated by an
increasing number of indentation. When an expanded child is focused, pressing
down moves the focus to that child's first child. There is only one focus for
all layers. The root statistics line cannot be focused. Space has no effect on a
heading. Toggling a subject passes `[['taskDescription', id]]`, toggling a group
passes its full path.

### Details of a child

A child can have detail lines, which the details arrow function returns as
text lines for the statistics of the child (for a taskDescription these are its
examinations). They form a layer of their own without a heading. Pressing right
on a child without children but with details shows its detail lines below the
child line, indented like the children of an expanded child, and moves the focus
to the first detail line. Detail lines can be focused with up and down like any
child, but they can neither be expanded nor selected: right and space have no
effect on them. The left arrow on a detail line closes the details and moves the
focus back to the child, as for any other layer. A child with children shows its
detail lines above its `${groupType} statistics` line.

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
in `console.displayStatisticsItem.utils.md`.

### Opacity

Everything is shown with the opacity `inactiveOpacity` defined in
`console.constants.ts`, except:

- the focused child line;
- child lines with the focused line somewhere below them (the parents of the
  focused child);
- all detail lines of a child that is focused or has a focused detail line; and
- the root statistics line and the `${groupType} statistics` line of every
  node with the focused line as a child or further below, and the focused
  heading itself.

All siblings of the focused child and its parents, as well as lines below the
focused child, remain dimmed. A terminal cannot display partial opacity, so the
faint style (`chalk.dim`) is used for dimmed lines.

All actions that can be performed and their effects are explained by gray
help text printed above the display. The implementation uses existing
libraries where appropriate, uses a color scheme similar to
`regExp.taskPresenter.ts`, and takes all colors from `console.constants.ts`.
