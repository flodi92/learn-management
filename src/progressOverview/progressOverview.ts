import { LearningState } from '../model';

interface ProgressItem {
  label: string;
  mastery: number;
  lastRepetitionBeforeDays: number; // 1 to 365
  numberOfRepetitions: number; // 1 to 5
  learningState: LearningState;
}

type ProgressAggregation = {
  avgLastRepetitionBeforeDays: number; // 1 to 365
} & Record<LearningState, number>;

type Statistics<
  ChildType extends string | undefined = undefined,
  ChildKey extends string | number = string,
  ChildStatistics extends Statistics<any, any, any> = Statistics<any, any, any>,
> = {
  statistics: ChildType extends undefined ? ProgressItem : ProgressAggregation;
} & (ChildType extends undefined
  ? {}
  : {
      childType: ChildType;
      children: Record<ChildKey, ChildStatistics>;
    });

export type StatisticsHierarchy = Statistics<
  'category',
  string,
  Statistics<'relevance', number, Statistics>
>;

export class ProgressOverview {
  display(statistics: Statistics<any, any, any>) {
    throw 'not implemented';
  }
}
