import { getMasteries } from './learnScheduler.utils/getMasteries';
import {
  learningInProgressMasteryMin,
  learningInProgressMasteryMax,
  intensiveLearningInProgressMasteryMin,
  intensiveLearningInProgressMasteryMax,
  minTimeForRepetition,
} from './learnScheduler.constants';
import { LearnScheduler } from './learnScheduler';

interface DoSessionParams {
  day: number;
  index: number;
  session: string[];
}

interface CheckSessionParams {
  day: number;
  index: number;
  masteries: Record<string, number>;
  session: string[];
  results: Record<string, number>;
}

const createScheduler = (ids: string[]) =>
  new LearnScheduler(ids.map((id) => ({ id })));

const nextSessionIds = (
  scheduler: LearnScheduler,
  count: number,
  day: number,
) =>
  scheduler
    .nextSession(count, day)
    .map((taskDescription) => taskDescription.id);

const LearnSchedulerTestWrapper = ({
  learningTimes,
  taskDescriptions,
  taskDescriptionsPerSession,
  doSession,
  checkSession,
  doFinal,
}: {
  learningTimes: number[];
  taskDescriptions: string[];
  taskDescriptionsPerSession: number;
  doSession: (
    params: DoSessionParams,
  ) => Parameters<LearnScheduler['recordResults']>[0];
  checkSession: (params: CheckSessionParams) => void;
  doFinal?: (scheduler: LearnScheduler) => void;
}) => {
  const scheduler = createScheduler(taskDescriptions);
  const results: { id: string; day: number; correctness: number }[] = [];
  learningTimes.forEach((day, index) => {
    const session = nextSessionIds(scheduler, taskDescriptionsPerSession, day);
    const sessionResults = doSession({
      day,
      index,
      session,
    });

    scheduler.recordResults(sessionResults, day);

    results.push(
      ...Object.entries(sessionResults).map(([id, correctness]) => ({
        id,
        correctness,
        day,
      })),
    );

    const masteries = getMasteries(results, day);

    checkSession({
      day,
      index,
      masteries,
      session,
      results: sessionResults,
    });
  });

  doFinal?.(scheduler);
};

describe('LearnScheduler', () => {
  const taskDescriptions = Array.from({ length: 100 }).map((_, i) => `${i}`);

  const learningTimes1 = Array.from({ length: 10 }).map((_, i) => i);

  const doSession = ({ session }: DoSessionParams) =>
    Object.fromEntries(
      session.map((taskDescription) => [taskDescription, 0.5]),
    );

  const doSession2 = ({ session, index }: DoSessionParams) =>
    Object.fromEntries(
      session.map((taskDescription) => [
        taskDescription,
        index < 2 ? 0 : index < 4 ? 0.5 : 1,
      ]),
    );

  describe('creates valid sessions', () => {
    it('returns the requested number of distinct known taskDescriptions', () => {
      const scheduler = createScheduler(taskDescriptions);

      const session = nextSessionIds(scheduler, 10, 0);

      expect(session).toHaveLength(10);
      expect(new Set(session).size).toBe(session.length);
      expect(
        session.every((taskDescription) =>
          taskDescriptions.includes(taskDescription),
        ),
      ).toBe(true);
    });

    it('returns an empty session when no taskDescriptions are requested', () => {
      const scheduler = createScheduler(taskDescriptions);

      expect(nextSessionIds(scheduler, 0, 0)).toEqual([]);
    });
  });

  describe('repeats learned taskDescriptions', () => {
    it('keeps a mastered taskDescription available for later repetition', () => {
      const scheduler = createScheduler(['taskDescription']);

      const firstSession = nextSessionIds(scheduler, 1, 0);
      scheduler.recordResults({ taskDescription: 1 }, 0);

      expect(firstSession).toEqual(['taskDescription']);
      expect(nextSessionIds(scheduler, 1, 1)).toEqual(['taskDescription']);
      expect(nextSessionIds(scheduler, 1, 10)).toEqual(['taskDescription']);
    });

    it('uses a failed repetition to make the taskDescription available again', () => {
      const scheduler = createScheduler(['taskDescription']);

      expect(nextSessionIds(scheduler, 1, 0)).toEqual(['taskDescription']);
      scheduler.recordResults({ taskDescription: 0 }, 0);

      expect(nextSessionIds(scheduler, 1, 1)).toContain('taskDescription');
    });
  });

  describe.skip('limits number of learning in progress taskDescriptions', () => {
    it.each([
      { learningTimes: learningTimes1, doSession },
      { learningTimes: learningTimes1, doSession: doSession2 },
    ])('case $#', ({ learningTimes, doSession }) =>
      LearnSchedulerTestWrapper({
        learningTimes,
        taskDescriptions,
        taskDescriptionsPerSession: 10,
        doSession,
        checkSession: ({ masteries }) => {
          expect(Object.values(masteries).length).toEqual(100);
          expect(
            Object.values(masteries).filter(
              (value) =>
                value > learningInProgressMasteryMin &&
                value < learningInProgressMasteryMax,
            ).length,
          ).toBeLessThan(10);
        },
      }),
    );
  });

  describe('assures constant repetition of learning in progress taskDescriptions', () => {
    it.each([
      { learningTimes: learningTimes1, doSession },
      { learningTimes: learningTimes1, doSession: doSession2 },
    ])('case $#', ({ learningTimes, doSession }) => {
      let checkForNextSession: string[] = [];
      LearnSchedulerTestWrapper({
        learningTimes,
        taskDescriptions,
        taskDescriptionsPerSession: 10,
        doSession,
        checkSession: ({ masteries, session }) => {
          expect(
            checkForNextSession.every((taskDescription) =>
              session.includes(taskDescription),
            ),
          );
          checkForNextSession = session.filter(
            (taskDescription) =>
              masteries[taskDescription] >
                intensiveLearningInProgressMasteryMin &&
              masteries[taskDescription] <
                intensiveLearningInProgressMasteryMax,
          );
        },
      });
    });
  });

  describe('avoids unnecessary repetitions', () => {
    it.each([
      { learningTimes: learningTimes1, doSession },
      { learningTimes: learningTimes1, doSession: doSession2 },
    ])('case $#', ({ learningTimes, doSession }) => {
      let lastRepetition: Record<string, { day: number; mastery: number }> = {};
      LearnSchedulerTestWrapper({
        learningTimes,
        taskDescriptions,
        taskDescriptionsPerSession: 10,
        doSession,
        checkSession: ({ day, masteries, session }) => {
          expect(
            session.every(
              (taskDescription) =>
                !(
                  masteries[taskDescription] > learningInProgressMasteryMax &&
                  lastRepetition[taskDescription].mastery >
                    learningInProgressMasteryMax
                ) ||
                day - lastRepetition[taskDescription].day >
                  minTimeForRepetition,
            ),
          );

          lastRepetition = {
            ...lastRepetition,
            ...Object.fromEntries(
              session.map((taskDescription) => [
                taskDescription,
                { day, mastery: masteries[taskDescription] },
              ]),
            ),
          };
        },
      });
    });
  });
});
