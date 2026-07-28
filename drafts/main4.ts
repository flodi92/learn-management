type SimpleAspect = { id: string; example?: string };
type ComplexAspect = { id?: string; children: Aspect[]; example?: string };
type Aspect = SimpleAspect | ComplexAspect;
type Sequence = Aspect[];
type FAILED = 0;
type ResultValue = 3 | 2 | 1 | FAILED | undefined;
type AspectResults = [Date, ResultValue][];
type AspectsResult = Map<Aspect, ResultValue>;
type AspectsResults = Map<Aspect, AspectResults>;

type LearnedCondition = unknown;
type Priority = 1 | 2 | 3 | 4 | 5;

// examples // https://www.geeksforgeeks.org/dsa/write-regular-expressions/
const literals: SimpleAspect = { id: 'literals', example: 'hello' };
const characterClass: SimpleAspect = {
  id: 'characterClass',
  example: '[a-zA-Z0-9]',
};
const repeaters: SimpleAspect = {
  id: 'repeaters',
  example: 'ab*cd+e{4,5}f{8,}',
};
const wildCard: SimpleAspect = {
  id: 'wildCard',
  example: 'My favorit character is .',
};
const optional: SimpleAspect = { id: 'optional' };

const wildCardRepeaters: ComplexAspect = {
  id: 'wildCardRepeaters',
  example: 'My name is .*',
  children: [wildCard, repeaters],
};
const literalsOptional: ComplexAspect = {
  id: 'literalsOptional',
  example: 'This is (not)? good.',
  children: [optional, repeaters],
};

const basic: ComplexAspect = {
  id: 'basic',
  children: [literals, characterClass, repeaters, wildCard, optional],
};
// -----------------------

const isComplexAspect = (aspect: Aspect): aspect is ComplexAspect =>
  'children' in aspect;

const isSimpleAspect = (aspect: Aspect): aspect is SimpleAspect =>
  !('children' in aspect);

const compareAspects = (aspectA: Aspect, aspectB: Aspect) => {
  if (aspectA.id !== undefined && aspectA.id === aspectB.id) {
    return true;
  }
  if (
    isComplexAspect(aspectA) &&
    isComplexAspect(aspectB) &&
    aspectA.children.length === aspectB.children.length &&
    aspectA.children.every((childA) =>
      aspectB.children.some((childB) => compareAspects(childA, childB)),
    )
  ) {
    return true;
  }
  return false;
};

const isAspectPrecondition = (aspect: Aspect, ofAspect: Aspect) => {
  const getSimpleAspects = (aspect: Aspect): Set<string> => {
    if (isComplexAspect(aspect)) {
      aspect.children.reduce((acc: Set<string>, curr) => {
        Array.from(getSimpleAspects(curr).values()).forEach((value) =>
          acc.add(value),
        );
        return acc;
      }, new Set<string>());
    } else if (isSimpleAspect(aspect)) {
      return new Set<string>([aspect.id]);
    }
    return new Set<string>();
  };

  const aspectSimpleIds = [...getSimpleAspects(aspect)];
  const ofAspectSimpleIds = [...getSimpleAspects(ofAspect)];

  return (
    aspectSimpleIds.every((id) => ofAspectSimpleIds.includes(id)) &&
    aspectSimpleIds.length < ofAspectSimpleIds.length
  );
};

class TaskGenerator {
  generateTask(aspect: Aspect): unknown | undefined {
    throw 'not implemented';
  }
  hasTask(aspect: Aspect): boolean {
    throw 'not implemented';
  }
}

class Library {
  allAspects: Aspect[] = [];

  getPreconditionAspects(aspect: Aspect): Aspect[] {
    throw 'not implemented';
  }
  getFollowUpAspects(aspect: Aspect): Aspect[] {
    throw 'not implemented';
  }
}

class UserManager<L extends Library> {
  readonly library: L;
  currentSequence: Sequence = [];
  focusedAspects: Aspect[] = [];
  results: AspectsResults;

  // long term planning

  getAspectsResult(): AspectsResult {
    // const aspects = L.allAspects
    throw 'not implemented';
  }

  getUnlockedAspectsToLearn(): Aspect[] {
    throw 'not implemented';
  }
  setFocusedAspects(aspects: Aspect[]) {
    // assert in UnlockedAspectsToLearn
    this.focusedAspects = aspects;
  }

  excludeAspects(aspects: Aspect[]) {}

  // short term planning

  getFocusedAspects() {
    return this.focusedAspects;
  }

  getFocusedAspectsResults(): AspectsResults {
    throw 'not implemented';
  }

  getDecombinedFocusedAspectsForRepetition(): Aspect[] {
    throw 'not implemented';
  }

  getAspectsRepetitionState(): unknown {
    throw 'not implemented';
  }

  getSuggestedAspectsForRepetition(): Aspect[] {
    // learned some time ago
    // reasently repeated but failed
    // repeated but not often enough

    const getInFocus = (aspect: Aspect): boolean => {
      throw 'not implemented';
    };

    const getLastRepetition = (aspect: Aspect): 'long' | 'middle' | 'short' => {
      throw 'not implemented';
    };

    const getLastResult = (aspect: AspectResults): ResultValue => {
      throw 'not implemented';
    };

    const getPositiveRepetitions = (
      aspect: AspectResults,
    ): 'often' | 'fewTimes' | 'seldom' | 'never' => {
      throw 'not implemented';
    };

    const getPriority = (aspect: Aspect): Priority => {
      // uses getLastRepetition, getLastResult, getPositiveRepetitions
      throw 'not implemented';
    };

    const selectAspectsByPriority = (
      aspectWithPriority: [Aspect, Priority][],
      numberOfTasks: number,
    ) => {
      const sortedAspectsPriority: Map<Priority, Aspect[]> =
        aspectWithPriority.reduce(
          (acc, [aspect, priority]) => ({
            ...acc,
            [priority]: [...(acc[priority] ?? [aspect])],
            priority,
          }),
          new Map<Priority, Aspect[]>(), // TODO fix
        );

      const buffer: Aspect[] = [];

      for (let i: Priority = 1; i <= 5; i++) {
        const aspects = sortedAspectsPriority.get(i as Priority) ?? [];
        const remainingNumber = numberOfTasks - buffer.length;
        const rest =
          i === 5
            ? 0
            : Math.max(
                remainingNumber - aspects.length,
                Math.ceil(remainingNumber * 0.5),
              );
        const countOfPriority = aspects.length - rest;

        buffer.push(...aspects.slice(0, countOfPriority)); // TODO shuffle
      }
    };

    // go throw all aspects priority take all of 1 and a certain percentage of others

    throw 'not implemented';
  }

  // some getter for state if many aspects underrated

  setCurrentSequence(sequence: Sequence) {
    // assert sequence aspects in focusedAspects
  }

  // training

  setAspectResult(aspect: Aspect, result: ResultValue) {}

  finishSequenceWithResult(result: AspectsResult) {}

  getAspectsWithFailedResultInCurrentSequence(): AspectsResult[] {
    throw 'not implemented';
  }

  finishRepeatFailedAspects(result: AspectsResult) {}
}
