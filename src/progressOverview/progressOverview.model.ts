import { LearningState, LearnSubject } from '../model';

export interface ProgressItem {
  label: string;
  mastery: number;
  lastRepetitionBeforeDays: number;
  numberOfRepetitions: number;
  learningState: LearningState;
}

export type ProgressAggregation = {
  avgLastRepetitionBeforeDays: number;
} & Record<LearningState, number>;

export interface GeneralStatistics {
  statistics: ProgressItem | ProgressAggregation;
  childType?: string;
  children?: Record<string | number, GeneralStatistics>;
}

export type Line = {
  depth: number;
  text: string;
  // Only lines of children can be focused.
  path?: string[];
};

export type ProgressTuple<S extends LearnSubject> = [string, S, ProgressItem];

export type ProgressTuples<S extends LearnSubject> = ProgressTuple<S>[];
