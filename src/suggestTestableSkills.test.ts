import { getConsciousness, Result } from './getConsciousness';
import { LearnScheduler } from './suggestTestableSkills';

const subjects = ['a', 'b', 'c', 'd', 'e'];

const getConsciousnesses = (
  results: { id: string; time: number; correctness: number }[],
  today: number,
) => {
  const ids = Array.from(new Set(results.map((result) => result.id)));

  const resultsBeforeDays = results.map((result) => ({
    ...result,
    beforeDays: today - result.time,
  }));

  return Object.fromEntries(
    ids.map((id) => [
      id,
      getConsciousness(resultsBeforeDays.filter((result) => result.id === id)),
    ]),
  );
};

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
  doSession: ({
    time,
    index,
    session,
  }: {
    time: number;
    index: number;
    session: ReturnType<LearnScheduler['nextSession']>;
  }) => Parameters<LearnScheduler['recordResults']>[0];
  checkSession: ({
    time,
    index,
    consciousnesses,
    session,
    results,
  }: {
    time: number;
    index: number;
    consciousnesses: Record<string, number>;
    session: string[];
    results: Record<string, number>;
  }) => void;
  doFinal?: (scheduler: LearnScheduler) => void;
}) => {
  const scheduler = new LearnScheduler(subjects);
  const results: { id: string; time: number; correctness: number }[] = [];
  learningTimes.forEach((time, index) => {
    const session = scheduler.nextSession(tasksPerSession, time);
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

    const consciousnesses = getConsciousnesses(results, time);

    checkSession({
      time,
      index,
      consciousnesses,
      session,
      results: sessionResults,
    });
  });

  doFinal?.(scheduler);
};

describe('LearnScheduler', () => {
  const learningTimes = Array.from({ length: 10 }).map((_, i) => i);
  const subjects = Array.from({ length: 100 }).map((_, i) => `${i}`);

  describe('limits number of learning in progress subjects', () => {
    it('case 0', () =>
      LearnSchedulerTestWrapper({
        learningTimes,
        subjects,
        tasksPerSession: 10,
        doSession: ({ session }) =>
          Object.fromEntries(session.map((task) => [task, 0.5])),
        checkSession: ({ consciousnesses }) => {
          expect(Object.values(consciousnesses).length).toEqual(100);
          expect(
            Object.values(consciousnesses).filter(
              (value) => value > 0.1 && value < 0.8,
            ).length,
          ).toBeLessThan(10);
        },
      }));
  });

  describe('assures constant repetition of currently learnt tasks', () => {
    it('case 0', () => {
      let checkForNextSession: string[] = [];
      LearnSchedulerTestWrapper({
        learningTimes,
        subjects,
        tasksPerSession: 10,
        doSession: ({ session }) =>
          Object.fromEntries(session.map((task) => [task, 0.5])),
        checkSession: ({ consciousnesses, session }) => {
          expect(checkForNextSession.every((task) => session.includes(task)));
          checkForNextSession = session.filter(
            (task) =>
              consciousnesses[task] > 0.1 && consciousnesses[task] < 0.4,
          );
        },
      });
    });
  });

  describe('avoids unnecessary repetitions', () => {
    it('case 0', () => {
      let lastRepetition: Record<
        string,
        { time: number; consciousness: number }
      > = {};
      LearnSchedulerTestWrapper({
        learningTimes,
        subjects,
        tasksPerSession: 10,
        doSession: ({ session }) =>
          Object.fromEntries(session.map((task) => [task, 0.5])),
        checkSession: ({ time, consciousnesses, session }) => {
          expect(
            session.every(
              (task) =>
                !(
                  consciousnesses[task] > 0.8 &&
                  lastRepetition[task].consciousness > 0.8
                ) || time - lastRepetition[task].time > 3,
            ),
          );

          lastRepetition = {
            ...lastRepetition,
            ...Object.fromEntries(
              session.map((task) => [
                task,
                { time, consciousness: consciousnesses[task] },
              ]),
            ),
          };
        },
      });
    });
  });
});
