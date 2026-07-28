describe('UserManager', () => {
  describe('getSuggestedAspectsForRepetition', () => {
    describe('getPriority', () => {
      it('', () => {
        const lastRepetition = 'short';
        const lastResult = 'bad';

        const actual = 'getPriority()';
        expect(actual).toEqual(1);
      });
      it('', () => {
        const inFocus = true;
        const lastResult = 'bad';

        const actual = 'getPriority()';
        expect(actual).toEqual(1);
      });
      it('', () => {
        const lastRepetition = 'long';
        const lastResult = 'middle';
        const positiveRepetitions = 'seldom';

        const actual = 'getPriority()';
        expect(actual).toEqual(3);
      });
      it('', () => {
        const inFocus = true;
        const lastResult = 'middle';

        const actual = 'getPriority()';
        expect(actual).toEqual(2);
      });
      it('', () => {
        const lastRepetition = 'short';
        const lastResult = 'good';
        const positiveRepetitions = 'often';

        const actual = 'getPriority()';
        expect(actual).toEqual(5);
      });
    });

    describe('selectAspectsByPriority', () => {
      // TODO research spaced repetition
      it('select all of priority 1 if amount less than numberOfTasks', () => {
        const aspectWithPriority: [Aspect, Priority][] = [];
        const numberOfTasks: number = 42;
        expect(true).toEqual(true);
      });
      it('fill rest with priority 2', () => {
        const aspectWithPriority: [Aspect, Priority][] = [];
        const numberOfTasks: number = 42;
        expect(true).toEqual(true);
      });
      it('', () => {
        const aspectWithPriority: [Aspect, Priority][] = [];
        const numberOfTasks: number = 42;
        expect(true).toEqual(true);
      });
      it('', () => {
        const aspectWithPriority: [Aspect, Priority][] = [];
        const numberOfTasks: number = 42;
        expect(true).toEqual(true);
      });
    });
  });
});
