// type Session = Sequence[];
// type Task = unknown;
// type Sequence = Aspect[];
// type SimpleAspect = { id: string }
// type ComplexAspect = { id: string, children: Aspect[] };
// type Aspect = SimpleAspect | ComplexAspect;
// type FAILED = 0;
// type Result = 3 | 2 | 1 | FAILED | undefined;
// // type Date = number;
// //

// class Manager {
//   currentSession: Session = [];
//   currentSequenceIdx?: number = undefined;
//   results = new Map<Aspect, {result: Result, date: Date}[]>();
//   targetDate = new Map<Aspect, Date>();

//   // user interactions
//   addAspectToSession(aspect: Aspect) {
//     const findFittingSequence = () => 42;
    
//     this.currentSession[findFittingSequence()].push(aspect);
//   }
//   removeAspectFromSession() {}
//   startSession() {}

//   finishSessionWithResult(result: Result) {
//     this.currentSession[this.currentSequenceIdx!].forEach(aspect => this.setAspectResult(aspect, result));
//   }

//   setAspectResult(aspect: Aspect, result: Result) {
//     this.results.set(aspect, this.results.get(aspect) ?? []);
//     this.results.set(aspect, [...this.results.get(aspect)!, {result, date: new Date()}]);
//   } // invoked by previous

//   getTasksForCurrentSequence() {}

//   combineAspects() {}
//   // user interactions less relevant
//   setTargetDateForTopic() {}
//   requestSuggestionForNextSession() {}
//   // user informations
//   getLearnedAspects() {}
//   getLearningStateForAspect() {}
//   getAspectsToRepeat() {}
//   getTimeEstimationForSession() {}
//   getExpectedResultForSession() {
//     // = getLastResultsForSession
//   }
//   getMissingPreconditions() {}
// }

// class Library {
//   aspects: Aspect[];

//   getTask(aspect: Aspect): Task {
//     throw "not imiplemented";
//   }

//   getPreconditions(aspect: Aspect): Aspect[] {
//     throw "not imiplemented";
//   }
//   getRetrainPreconditions(aspect: Aspect, result: Result): Aspect[] {
//     throw "not imiplemented";
//   }
//   getFollowUpAspects(aspect: Aspect, result: Result): Aspect[] {
//     throw "not imiplemented";
//   }
//   getPathToAspect(aspect: Aspect): Aspect[] {
//     throw "not imiplemented";

//   }
// }

// // utils
// const isAspectPreconditionOfAspect = (
//   preAspect: Aspect,
//   aspect: Aspect
// ): boolean => {
//   throw "notImiplemented";
// };
