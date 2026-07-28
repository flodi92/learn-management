// export interface ScaledDifficulty {
//   [step: number]: string;
// }

// export interface NamedDifficulty {
//   [name: string]: string;
// }

// export type Difficulty = ScaledDifficulty | NamedDifficulty;

// export type TaskDescriptionGenerator<
//   AbilityConfigurationT extends AbilityConfiguration,
//   TaskDescriptionT
// > = (ConnectedToken: AbilityConfigurationT) => TaskDescriptionT;

// export type TaskGenerator<TaskDescriptionT, TaskT> = (
//   description: TaskDescriptionT
// ) => TaskT;

// export type AbilityConfiguration =
//   | SimpleAbilityConfiguration
//   | ConnectedAbilityConfiguration;

// export interface SimpleAbilityConfiguration {
//   name: string;
//   difficulties: Difficulty[];
// }

// export interface ConnectedAbilityConfiguration {
//   name: string;
//   abilityConfigurations: AbilityConfiguration;
//   difficulties: Difficulty[];
// }

// export type LearningState =
// | "new"
//   | "unsuccessfullyAttempted"
//   | "successfullyAttempted"
//   | "successInShorttermRepetition"
//   | "noSuccessInRepetition"
//   | "inLongtermRepetition";

//   export interface Ability {
//   configurations: AbilityConfiguration[];
//   learningState: LearningState;
// }

// export type LearningKanban = {
//     [state in LearningState]: AbilityConfiguration[];
// };

// export type Result =
//     | "good"
//     | "middle"
//     | "bad";

// export interface Session {
//     configuration: AbilityConfiguration;
//     result: Result;
//     timestamp: number;
// }

// // TODO
// export type AbilitySimplifier = (sessions: Session[]) => Ability;

// // example

// type Exact<T, Shape> =
// T extends Shape
// ? Exclude<keyof T, keyof Shape> extends never
// ? T
// : never
// : never;

// export interface MyAbilityConfiguration extends ConnectedAbilityConfiguration {
//     name: "css-selectors"
//     p:""
//     // TODO
// }

// type OK = Exact<MyAbilityConfiguration, ConnectedAbilityConfiguration>
