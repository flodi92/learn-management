I want console.displayStatistics and console.displayStatisticsItem to be separated.

The new types in overview.model.ts look like this:

```typescript
export interface OverviewRecursiveUndeterminedStatistics<
  Statistics extends object = object,
> {
  statistics: Statistics;
  childType?: string;
  children?: Record<
    string | number,
    OverviewRecursiveUndeterminedStatistics<Statistics>
  >;
}

export type OverviewRecursiveStatistics =
  OverviewRecursiveUndeterminedStatistics<OverviewStatistics>;
```

Put all files that start with "console.displayStatistics" into a folder "console.displayStatistics"
In the folder "console.displayStatistics" only the type OverviewRecursiveUndeterminedStatistics should be used. OverviewStatistics, OverviewSubjectStatisticsItem or OverviewAggregatedStatisticsItem should not be used in that folder.

Extract the logic that refers to OverviewRecursiveStatistics, OverviewStatistics, OverviewSubjectStatisticsItem or OverviewAggregatedStatisticsItem to a folder console.displayStatisticsItem into a file console.displayStatisticsItem.utils.ts

The function consoleDisplayStatistics should have more parameters that are arrow functions
Those arrow functions are expected to specify the sorting of items and the formatting of a statistics Item refering to OverviewRecursiveUndeterminedStatistics['statistics'] without knowing the specification of OverviewStatistics.

The file console.overview uses consoleDisplayStatistics and is expected to provide those arrow functions from the folder console.displayStatisticsItem.

The following functions might be moved to console.displayStatisticsItem.utils.ts

neverTrained
isOverviewSubjectStatisticsItem
formatAggregatedStatistics
formatSubjectStatistics
formatStatistics
getStatisticsColor
learningStateShares
compareAggregatedStatistics
isOverviewSubjectStatisticsItem
compareStatistics
sortChildren

It might also be necessary to migrate some of the logic that is now in class ConsoleDisplayStatistics

This is only a refactoring make sure the behaviour is exactly as before

Adopt the console.displayStatistics.md accordingly and migrate some text to a new file console.displayStatisticsItem.md in the other folder.

Migrate the unit tests from one file to the other
