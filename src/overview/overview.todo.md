I want the statistics "selected" to be rendered everywhere where OverviewAggregatedStatisticsItem is rendered.

This should be achieved in the following way.

- OverviewSubjectStatisticsItem should have another required parameter id. That should be set on the appropriate place.

- The computeAggregatedStatistics function takes another parameter selectedIds that is a string array. So hand that parameter down from overview and overview.computeStatistics It evaluates based on statisticsItems how many of the statisticsItems ids are in the array selectedIds. That value is used for the new parameter of the output object "selected". So OverviewAggregatedStatisticsItem should specify that parameter.

- formatAggregatedStastistics must implicitly render the new value selected from AggregatedStatisticsItem
- so formatAggregatedStatistics does not need the optional parameter numberOfSelectedItems anymore. Remove that and also recursively remove that in the client files if not need on another place.
