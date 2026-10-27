- "- Infinity" by relevance statistics

Adopt the expanding behaviour.
Pressing on right arrow it expands and jumps to the first element of the expansion.
Pressing on the left arrow it jumps to the parent element and the expansion is closed.
The behaviour for up arrow and down arrow should remain the same.

- adopt the md accordingly

---

Only show a maximum of 15 children for each element.
If the list of children is longer than 15 indicate that by an eclipse sign in that row.

When focusing the last element before the eclipse and going down again the children's list is added the next 15 children and so on until all children are shown.

Adopt the md accordingly

---

The children of each layer should be sorted in the following way.

- If the layer's children have an OverviewAggregatedStatisticsItem then the element is shown first that has the highest number for learned. If that number is equal it sorts for the highest number of learning. If that number is equal, too it sorts for the lowest number of not learned. But do not use the absolute numbers for the sorting comparisons for not learned, learning, learned, for repeat. Use releative numbers normalized by the sum of all of them instead.
- If the layer's children have an OverviewSubjectStatisticsItem it sorts for the mastery. Highest mastery first.
- adopt the md accordingly
- extract the sort logic to the existing utils file.

---

I want to have the current id or label to be colored in the same color as the learning state or for OverviewAggregatedStatisticsItem in the color of the learning state with the highest number.

All layers that are currently not focused or have children that are currently not focused should have opacity of only 60%. Value should be defined in constants file.

---

Currently the expanded statistics looks like this. (I copied only some of the console output)

```
 avgLastRepetitionBeforeDays: Infinity, notLearned: 153, learning: 0, learned: 0, forRepeat: 0
  category statistics
    characterClass
      avgLastRepetitionBeforeDays: Infinity, notLearned: 106, learning: 0, learned: 0, forRepeat: 0
      relevance statistics
        1
          avgLastRepetitionBeforeDays: Infinity, notLearned: 11, learning: 0, learned: 0, forRepeat: 0
          subject statistics
          > /^[xyz]$/
              label: /^[xyz]$/, mastery: 0, lastRepetitionBeforeDays: Infinity, numberOfRepetitions: 0, learningState: notLearned, lastMastery: undefined, lastCorrectness: undefined
            /^.$/
            /^\s$/
            /^\d$/
```

Rewrite consoleDisplayStatistics in the following way:

- Each child already shows statistics even if not expanded.
- Those statistics are shown in the same line as the id or label of the expandable element. In this case between characterClass, 1 and /^[xyz]$/
- Only for the root element the statistics should remain in an own line before `${childType} statistics`
- The statistics should be displayed in the following
  - For OverviewAggregatedStatisticsItem
    - Only display the numbers but keep the color codes
    - avgLastRepetitionBeforeDays is displayed like `⌀ ${avgLastRepetitionBeforeDays} days before `
    - When a line is focused the learning state is shown before the number, e.g. `not learned: 153`
  - For OverviewSubjectStatisticsItem
    - Only show label once not twice as currently
    - `${learningState} (${Math.round(mastery * 100)}%)` all in the same color as currently the learning state
    - `${numberOfRepetitions}x ${lastRepetitionBeforeDays} days before`
    - all other values are only shown when the line is focused but transformed from camel case to separate words
- Adapt the md file accordingly
- in order to achieve that behaviour
  - extract the writing of a statistics attribute into a utils function in console.displayStatistics.utils.ts
  - that function determines the type of statistics OverviewSubjectStatisticsItem or OverviewAggregatedStatisticsItem (invoking an extra function)
  - depending on that type invokes even another function to print that type according to the specifications above
  - the color values should be extracted to an extra file console.constants
