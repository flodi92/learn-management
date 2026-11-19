import { OverviewSelectionPath } from '../overview.model';

export const isTaskDescriptionSelectionPath = (path: OverviewSelectionPath) =>
  path[path.length - 1][0] === 'taskDescription';
