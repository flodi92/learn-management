import { learningStates } from '../../../model';
import { OverviewStatistics } from '../../../overview/overview.model';
import { learningStateColors } from '../console.constants';
import { isOverviewTaskDescriptionStatisticsItem } from './console.formatStatistics';

// TaskDescriptions use the color of their learning state, aggregated statistics the one of the highest number.
export const getStatisticsColor = (
  statistics: OverviewStatistics,
): ((text: string) => string) => {
  if (isOverviewTaskDescriptionStatisticsItem(statistics)) {
    return learningStateColors[statistics.learningState];
  }
  const dominantState = learningStates.reduce((dominant, state) =>
    statistics[state] > statistics[dominant] ? state : dominant,
  );
  return learningStateColors[dominantState];
};
