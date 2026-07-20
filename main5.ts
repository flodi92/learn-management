export type Aspect = {};
export type Skill = { aspects: Aspect[] };
export type Task = { skill: Skill, question: string };
export type Sequence = Task[];
export type Open = -1;
export type Result = 3 | 2 | 1 | 0;
export type Priority = 1 | 2 | 3 | 4 | 5;
export type ResultsOfUser = Map<Date, [Skill, Result]>;

type suggestTestableSkills = (targetSkill: Skill, userResults: ResultsOfUser) => {skill: Skill, priority: Priority, estimatedTime: number};
// favor reasently learned skills over past skills
// assure repetition
// start with partial skills and combine them more and more
// destructure skills back to partial skills if having problems



type generateTasks = (skill: Skill) => Task;


interface User {
    startSession: (plannedTimeForToday: number) => void;
    planSession: (skillsToTrain: Skill[]) => void;
    startSequence: (skill: Skill) => void;
    noteResults: (skill: Skill, result: Result, problematicAspects: Aspect[]) => void;
    stopSession: () => void;
}


interface System {
    showGlobalProgress: () => [Skill, Result][];
    suggestTestableSkills: () => [Skill, Priority];
    showTodaysProgress: () => [Skill, Open | Priority];
    evaluate: (task: Task, answer: string) => Result;
}





