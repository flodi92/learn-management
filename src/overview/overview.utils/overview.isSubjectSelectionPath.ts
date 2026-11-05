import { OverviewSelectionPath } from '../overview.model';

export const isSubjectSelectionPath = (path: OverviewSelectionPath) =>
  path[path.length - 1][0] === 'subject';
