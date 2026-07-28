// // Paradigmen
// // ----------
// // 1. Aufbauender Schwierigkeitsgrad, wenn Aufgaben mit grundlegendem Schwierigkeitsgrad zu 80% beherrscht werden (Pareto)
// // 2. Isolation von kritischen Aspekten bei Wiederholung nach schlecht gelösten Aufgaben
// // 3. Zeitlich nahes Training von verwandten Aspekten, um Unterscheidung zu lernen
// // 4. Wiederholung von gelernten Aspekten entweder durch aufbauende Aufgaben oder durch gelegentliches Neustellen eines Aufgabentyps
// // 5. Komplexaufgaben zuerst mit häufigsten Teilaspekten, Später Sonderfälle einzeln und Sonderfälle in Komplexaufgaben
// // 6. Sitzung planen anhand verfügbarer Zeit, Anteil Wiederholungsaufgaben, Anteil Neuaufgaben
// // 7. Langfristige Planung

// // Generisch
// // ---------

// export interface AbstractAbility<I extends string>  {
//     id: I;
// }

// export interface SimpleAbility<N extends string, V extends string[] = []> extends AbstractAbility<N> {
//     values: V;
// }

// export interface ComplexAbility<N extends string, As extends Ability[]> extends AbstractAbility<N> {
//     mix: 'inTask' | 'inSequence' | 'inTaskAndSequence'
//     children: As;
// }

// export type Ability = SimpleAbility<string> | AbstractAbility<string>;
// export type Result = unknown;

// export type LearningPhase =
// | "new"
//   | "unsuccessfullyAttempted"
//   | "successfullyAttempted"
//   | "successInShorttermRepetition"
//   | "noSuccessInRepetition"
//   | "inLongtermRepetition";

//   export type Focus =
//   "inCurrentFocus"
//   | "notInCurrentFocus"

// export type LearningState = [LearningPhase, Focus]

// type PlanedSession = {
//     openTime: number;
//     doRepeat: boolean;
//     topics: string[];

// }
// type Session = {
//     repeat: {ability: Ability, numberOfTasks: number}[],
//     focus: {ability: Ability, numberOfTasks: number}[],
//     learn: {ability: Ability, numberOfTasks: number}[],
// };

// // Konkret
// type Sequence = {
//  ability: Ability;
//  numberOfTasks: number;
//  timeLinit: number;
// }

// type LearnSequence = {

// }
// type TrainSequence = {

// }

// type SequenceResult = {
//     timeSpent: number;
//     numberOfMistakes: number;
//     trainedAbility: Ability;
//     mistakenBaseAbilities: Ability;
// }

// export type YesNoValues = 'yes' | 'no';
// export type OperandsRangeValues = 'N' | 'Z'; // | ...
// export type OperatorValues = '+' | '-' | '*' | '/';

// export type AsText = SimpleAbility<'asText', [YesNoValues]>;
// export type OperandsRange = SimpleAbility<'operandsRange', [OperandsRangeValues]>;
// export type Operator = SimpleAbility<'operator', [OperatorValues]>;
// export type Compute = ComplexAbility<'compute', [OperandsRange, Operator]>

// // Helper
// const isAbilityLearned = (requestedAbility: Ability, results: {ability: Ability, mistakes: number, time: number}): boolean => {
//     throw 'not implemented';
// };

// const isAbilityReadyToLearn = (requestedAbility: Ability, results: {ability: Ability, mistakes: number, time: number}): boolean => {
//     throw 'not implemented';
// };

// const getNextAbilitiesToLearn = ( props: unknown): Ability => {
//     throw 'not implemented';
// }

// const setSessionByUser = () => {}

// const isBasicAbility = (questionedBaseAbility: Ability, ability: Ability): boolean => {
//     throw 'not implemented';
// };

// // getAbilityLearningState = () =>

// // suggestNextTasksToLearn

// // getStateOfAbility =

// // Ideen
// // attribut relevance
// // attribut last

// // Task analysis
// //
// // -
