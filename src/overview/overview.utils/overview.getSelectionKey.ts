import {
  OverviewGroupTypeOrSubject,
  OverviewSelectionKey,
} from '../overview.model';

export const getSelectionKey = (
  path: readonly (readonly [OverviewGroupTypeOrSubject, string | number])[],
) => JSON.stringify(path) as OverviewSelectionKey;
