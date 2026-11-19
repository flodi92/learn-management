import {
  OverviewGroupTypeOrTaskDescription,
  OverviewSelectionKey,
} from '../overview.model';

export const getSelectionKey = (
  path: readonly (readonly [
    OverviewGroupTypeOrTaskDescription,
    string | number,
  ])[],
) => JSON.stringify(path) as OverviewSelectionKey;
