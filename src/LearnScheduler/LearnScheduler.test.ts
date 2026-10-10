import { LearnScheduler } from './LearnScheduler';
import { getMasteries } from './LearnScheduler.utils/getMasteries';
import {
  learningInProgressMasteryMin,
  learningInProgressMasteryMax,
  intensiveLearningInProgressMasteryMin,
  intensiveLearningInProgressMasteryMax,
  minTimeForRepetition,
} from './LearnScheduler.constants';

interface DoSessionParams {
  time: number;
  index: number;
  session: string[];
}

interface CheckSessionParams {
  time: number;
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
  time: number,
) => scheduler.nextSession(count, time).map((task) => task.id);

const LearnSchedulerTestWrapper = ({
  learningTimes,
  subjects,
  tasksPerSession,
  doSession,
  checkSession,
  doFinal,
}: {
  learningTimes: number[];
  subjects: string[];
  tasksPerSession: number;
  doSession: (
    params: DoSessionParams,
  ) => Parameters<LearnScheduler['recordResults']>[0];
  checkSession: (params: CheckSessionParams) => void;
  doFinal?: (scheduler: LearnScheduler) => void;
}) => {
  const scheduler = createScheduler(subjects);
  const results: { id: string; time: number; correctness: number }[] = [];
  learningTimes.forEach((time, index) => {
    const session = nextSessionIds(scheduler, tasksPerSession, time);
    const sessionResults = doSession({
      time,
      index,
      session,
    });

    scheduler.recordResults(sessionResults, time);

    results.push(
      ...Object.entries(sessionResults).map(([id, correctness]) => ({
        id,
        correctness,
        time,
      })),
    );

    const masteries = getMasteries(results, time);

    checkSession({
      time,
      index,
      masteries,
      session,
      results: sessionResults,
    });
  });

  doFinal?.(scheduler);
};

describe('LearnScheduler', () => {
  const subjects = Array.from({ length: 100 }).map((_, i) => `${i}`);

  const learningTimes1 = Array.from({ length: 10 }).map((_, i) => i);

  const doSession = ({ session }: DoSessionParams) =>
    Object.fromEntries(session.map((task) => [task, 0.5]));

  const doSession2 = ({ session, index }: DoSessionParams) =>
    Object.fromEntries(
      session.map((task) => [task, index < 2 ? 0 : index < 4 ? 0.5 : 1]),
    );

  describe('creates valid sessions', () => {
    it('returns the requested number of distinct known subjects', () => {
      const scheduler = createScheduler(subjects);

      const session = nextSessionIds(scheduler, 10, 0);

      expect(session).toHaveLength(10);
      expect(new Set(session).size).toBe(session.length);
      expect(session.every((subject) => subjects.includes(subject))).toBe(true);
    });

    it('returns an empty session when no subjects are requested', () => {
      const scheduler = createScheduler(subjects);

      expect(nextSessionIds(scheduler, 0, 0)).toEqual([]);
    });
  });

  describe('repeats learned subjects', () => {
    it('keeps a mastered subject available for later repetition', () => {
      const scheduler = createScheduler(['subject']);

      const firstSession = nextSessionIds(scheduler, 1, 0);
      scheduler.recordResults({ subject: 1 }, 0);

      expect(firstSession).toEqual(['subject']);
      expect(nextSessionIds(scheduler, 1, 1)).toEqual(['subject']);
      expect(nextSessionIds(scheduler, 1, 10)).toEqual(['subject']);
    });

    it('uses a failed repetition to make the subject available again', () => {
      const scheduler = createScheduler(['subject']);

      expect(nextSessionIds(scheduler, 1, 0)).toEqual(['subject']);
      scheduler.recordResults({ subject: 0 }, 0);

      expect(nextSessionIds(scheduler, 1, 1)).toContain('subject');
    });
  });

  describe.skip('limits number of learning in progress subjects', () => {
    it.each([
      { learningTimes: learningTimes1, doSession },
      { learningTimes: learningTimes1, doSession: doSession2 },
    ])('case $#', ({ learningTimes, doSession }) =>
      LearnSchedulerTestWrapper({
        learningTimes,
        subjects,
        tasksPerSession: 10,
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

  describe('assures constant repetition of learning in progress subjects', () => {
    it.each([
      { learningTimes: learningTimes1, doSession },
      { learningTimes: learningTimes1, doSession: doSession2 },
    ])('case $#', ({ learningTimes, doSession }) => {
      let checkForNextSession: string[] = [];
      LearnSchedulerTestWrapper({
        learningTimes,
        subjects,
        tasksPerSession: 10,
        doSession,
        checkSession: ({ masteries, session }) => {
          expect(checkForNextSession.every((task) => session.includes(task)));
          checkForNextSession = session.filter(
            (task) =>
              masteries[task] > intensiveLearningInProgressMasteryMin &&
              masteries[task] < intensiveLearningInProgressMasteryMax,
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
      let lastRepetition: Record<string, { time: number; mastery: number }> =
        {};
      LearnSchedulerTestWrapper({
        learningTimes,
        subjects,
        tasksPerSession: 10,
        doSession,
        checkSession: ({ time, masteries, session }) => {
          expect(
            session.every(
              (task) =>
                !(
                  masteries[task] > learningInProgressMasteryMax &&
                  lastRepetition[task].mastery > learningInProgressMasteryMax
                ) || time - lastRepetition[task].time > minTimeForRepetition,
            ),
          );

          lastRepetition = {
            ...lastRepetition,
            ...Object.fromEntries(
              session.map((task) => [task, { time, mastery: masteries[task] }]),
            ),
          };
        },
      });
    });
  });
});
