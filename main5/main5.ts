export type Aspect = { name: string };
export type Skill = { name: string,  aspects: Aspect[] };
export type Task = { skill: Skill, question: string };
export type Sequence = Task[];
export type Open = -1;
export type Result = 3 | 2 | 1 | 0;
export type Priority = 1 | 2 | 3 | 4 | 5;
export type ResultsOfUser = Map<Date, {skill: Skill, result: Result, aspects: Aspect[]}>;
export type Suggestion = {
    repeat: Skill[];
    train: Skill[];
};

type SuggestTestableSkills = (targetSkill: Skill, userResults: ResultsOfUser) => {skill: Skill, priority: Priority, estimatedTime: number};
// favor reasently learned skills over past skills
// assure repetition
// start with partial skills and combine them more and more
// destructure skills back to partial skills if having problems


const suggestTestableSkills1: SuggestTestableSkills = (targetSkill, userResults) => {
    const getLearnHierarchy = (targetSkill: Skill, userResults: ResultsOfUser) => {

        interface Hierachy {
            skill: Skill;
            parents: Hierachy
        }
        return undefined as unknown as Hierachy;
    };

    const hierarchy = getLearnHierarchy(targetSkill, userResults); 

}
const suggestTestableSkills2: SuggestTestableSkills = (targetSkill, userResults) => {

    // 1. bestimme zu wiederholende Skills, zu trainierende Skills, neu zu lernende Skills
    // 2. wäge anhand der verfügbaren Zeit ab
    const determineRepetitionSkills = ()=> {
        
    }
}



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


const main = () => {
    const user = null as unknown as User; 
    const system = null as unknown as System;

    const time = prompt('Wie viel Zeit hast du heute?')!;

    user.startSession(parseInt(time))

    
    const session = [] as Skill[];
    let accept = false;
    do {
        const suggestion = system.suggestTestableSkills();
        console.log('Folgende Inhalte werden dir für diese Sitzung vorgeschlagen?');
        console.log(suggestion);
    
        const addSkill = prompt(`Wähle so lange aus den Vorschlägen aus, bis du die Sitzung hast ${suggestion}`) as unknown as Skill;
        session.push(addSkill);
        const computeTime = (x: Skill[]) => ''
        console.log('Die geschätzte Zeit ist' + computeTime(session));
        const sessionInTime = () => true as boolean;

        console.log(sessionInTime() ? "Deine Planung ist noch unter der Zeit" : "Deine Planung ist über der geplanten Zeit")
        accept = confirm('Hast du fertig geplant?');

    } while(!accept)

    const examine = false;
   
    for (const skill of session){
        const examineLearner = (skill: Skill) => [undefined as unknown as Result, undefined as unknown as Aspect[]] as const;

        const [result, problematicAspects] = examineLearner(skill);
        user.noteResults(skill, result, problematicAspects)
    }



}


