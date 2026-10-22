import { LearnSubject } from '../model';
import { getToday } from '../utils';
import { StatisticsHierarchy } from './progressOverview';

const computeData = <S extends LearnSubject>(
  idSubjectMapping: Record<string, S>,
  day: number = getToday(),
): StatisticsHierarchy => {
  throw 'not implemented';
};
