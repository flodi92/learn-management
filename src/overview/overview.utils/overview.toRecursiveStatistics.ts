import { OverviewRecursiveStatistics } from '../overview.model';
import { OverviewStatisticsTree } from './overview.toRecursiveStatistics.model';

export const toRecursiveStatistics = ({
  statistics,
  defaultGroupType,
  children,
}: OverviewStatisticsTree): OverviewRecursiveStatistics => ({
  statistics,
  defaultGroupType,
  possibleGroupTypes:
    defaultGroupType === undefined || defaultGroupType === 'taskDescription'
      ? []
      : [defaultGroupType],
  getChildren: (groupType) =>
    groupType === defaultGroupType && children
      ? Object.fromEntries(
          Object.entries(children).map(([key, child]) => [
            key,
            toRecursiveStatistics(child),
          ]),
        )
      : undefined,
});
