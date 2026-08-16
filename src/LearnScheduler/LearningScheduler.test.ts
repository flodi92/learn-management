import { LearnScheduler } from './LearnScheduler';
import { getConsciousnesses } from './LearnScheduler.utils/getConsciousnesses';
import {
  learningInProgressConsciousnessMin,
  learningInProgressConsciousnessMax,
  intensiveLearningInProgressConsciousnessMin,
  intensiveLearningInProgressConsciousnessMax,
  minTimeForRepetition,
} from './LearningScheduler.constants';

interface DoSessionParams {
  time: number;
  index: number;
  session: ReturnType<LearnScheduler['nextSession']>;
}

interface CheckSessionParams {
  time: number;
  index: number;
  consciousnesses: Record<string, number>;
  session: string[];
  results: Record<string, number>;
}

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
  const subjects = Array.from({ length: 100 }).map((_, i) => `${i}`);

  const learningTimes1 = Array.from({ length: 10 }).map((_, i) => i);

  const doSession = ({ session }: DoSessionParams) =>
    Object.fromEntries(session.map((task) => [task, 0.5]));

  const doSession2 = ({ session, index }: DoSessionParams) =>
    Object.fromEntries(
      session.map((task) => [task, index < 2 ? 0 : index < 4 ? 0.5 : 1]),
    );

  describe('limits number of learning in progress subjects', () => {
    it.each([
      { learningTimes: learningTimes1, doSession },
      { learningTimes: learningTimes1, doSession: doSession2 },
    ])('case $#', ({ learningTimes, doSession }) =>
      LearnSchedulerTestWrapper({
        learningTimes,
        subjects,
        tasksPerSession: 10,
        doSession,
        checkSession: ({ consciousnesses }) => {
          expect(Object.values(consciousnesses).length).toEqual(100);
          expect(
            Object.values(consciousnesses).filter(
              (value) =>
                value > learningInProgressConsciousnessMin &&
                value < learningInProgressConsciousnessMax,
            ).length,
          ).toBeLessThan(10);
        },
      }),
    );
  });

  describe('assures constant repetition of currently learnt tasks', () => {
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
        checkSession: ({ consciousnesses, session }) => {
          expect(checkForNextSession.every((task) => session.includes(task)));
          checkForNextSession = session.filter(
            (task) =>
              consciousnesses[task] >
                intensiveLearningInProgressConsciousnessMin &&
              consciousnesses[task] <
                intensiveLearningInProgressConsciousnessMax,
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
      let lastRepetition: Record<
        string,
        { time: number; consciousness: number }
      > = {};
      LearnSchedulerTestWrapper({
        learningTimes,
        subjects,
        tasksPerSession: 10,
        doSession,
        checkSession: ({ time, consciousnesses, session }) => {
          expect(
            session.every(
              (task) =>
                !(
                  consciousnesses[task] > learningInProgressConsciousnessMax &&
                  lastRepetition[task].consciousness >
                    learningInProgressConsciousnessMax
                ) || time - lastRepetition[task].time > minTimeForRepetition,
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
