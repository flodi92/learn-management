import { getMastery } from './getMastery';

describe('getMastery', () => {
  const checkValuesForNormalizedRange = (values: Record<string, number>) => {
    Object.entries(values).forEach(([name, value]) => {
      if (value < 0 || value > 1) {
        throw Error(
          `The value ${name} is expected to be value < 0 || value > 1 but is ${value}`,
        );
      }
    });
  };
  describe('mastery decreases with increasing time of last repetition', () => {
    it('case 0', () => {
      const a = getMastery([{ beforeDays: 1, correctness: 1 }]);
      const b = getMastery([{ beforeDays: 2, correctness: 1 }]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 1', () => {
      const a = getMastery([{ beforeDays: 1, correctness: 0.5 }]);
      const b = getMastery([{ beforeDays: 2, correctness: 0.5 }]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 2', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 6, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 2, correctness: 1 },
        { beforeDays: 7, correctness: 1 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 3', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.5 },
        { beforeDays: 6, correctness: 0.5 },
      ]);
      const b = getMastery([
        { beforeDays: 2, correctness: 0.5 },
        { beforeDays: 7, correctness: 0.5 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 4', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.5 },
        { beforeDays: 6, correctness: 0.6 },
        { beforeDays: 9, correctness: 0.6 },
      ]);
      const b = getMastery([
        { beforeDays: 2, correctness: 0.5 },
        { beforeDays: 7, correctness: 0.6 },
        { beforeDays: 10, correctness: 0.6 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
  });
  describe('mastery is considered less when the level of correctness is lower', () => {
    it('case 0', () => {
      const a = getMastery([{ beforeDays: 1, correctness: 1 }]);
      const b = getMastery([{ beforeDays: 1, correctness: 0.5 }]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 1', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.5 },
        { beforeDays: 5, correctness: 0.5 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 2', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 1 },
        { beforeDays: 10, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.5 },
        { beforeDays: 5, correctness: 0.5 },
        { beforeDays: 10, correctness: 0.5 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 3', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.6 },
        { beforeDays: 5, correctness: 0.5 },
        { beforeDays: 10, correctness: 0.4 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.5 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 10, correctness: 0.3 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 4', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.6 },
        { beforeDays: 5, correctness: 0.2 },
        { beforeDays: 10, correctness: 0.9 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.5 },
        { beforeDays: 5, correctness: 0.1 },
        { beforeDays: 10, correctness: 0.8 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
  });

  describe('mastery increases with more frequent repetitions', () => {
    it('case 0', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 1 },
      ]);
    });
    it('case 1', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 1 },
        { beforeDays: 3, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 1 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 2', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.3 },
        { beforeDays: 2, correctness: 0.3 },
        { beforeDays: 6, correctness: 0.3 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.3 },
        { beforeDays: 2, correctness: 0.3 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 3', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.3 },
        { beforeDays: 2, correctness: 0.3 },
        { beforeDays: 6, correctness: 0.3 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.3 },
        { beforeDays: 6, correctness: 0.3 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 4', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.9 },
        { beforeDays: 2, correctness: 0.8 },
        { beforeDays: 10, correctness: 0.2 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.9 },
        { beforeDays: 2, correctness: 0.8 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 5', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.6 },
        { beforeDays: 5, correctness: 1 },
        { beforeDays: 42, correctness: 0.1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.6 },
        { beforeDays: 5, correctness: 1 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
  });

  describe('mastery is considered more when the user has kept the skill for a longer time', () => {
    it('case 1', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 1 },
        { beforeDays: 10, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 1 },
        { beforeDays: 6, correctness: 1 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 2', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.6 },
        { beforeDays: 10, correctness: 0.6 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.6 },
        { beforeDays: 6, correctness: 0.6 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 3', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 10, correctness: 0.3 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 6, correctness: 0.3 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
  });
  describe('mastery is considered more when correctness in past repetitions was higher', () => {
    it('case 0', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 10, correctness: 0.4 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 10, correctness: 0.3 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
  });
  describe('mastery is considered more when the correectness has not fallen during past repetition', () => {
    it('case 0', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 0.5 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 1', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 10, correctness: 0.4 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 10, correctness: 0.5 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 2', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 10, correctness: 0.3 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.4 },
        { beforeDays: 10, correctness: 0.5 },
      ]);
      expect(a).toBeGreaterThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
  });
  describe('mastery is considered less when the level of correctness has fallen during past repetitions', () => {
    it('case 0', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.5 },
        { beforeDays: 2, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 1 },
      ]);
      expect(a).toBeLessThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 1', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.5 },
        { beforeDays: 2, correctness: 1 },
        { beforeDays: 9, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 1 },
        { beforeDays: 9, correctness: 1 },
      ]);
      expect(a).toBeLessThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 2', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 0.5 },
        { beforeDays: 42, correctness: 0.6 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 2, correctness: 0.6 },
        { beforeDays: 42, correctness: 0.6 },
      ]);
      expect(a).toBeLessThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 3', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 0.8 },
        { beforeDays: 2, correctness: 0.9 },
        { beforeDays: 9, correctness: 0.4 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 0.9 },
        { beforeDays: 2, correctness: 0.9 },
        { beforeDays: 9, correctness: 0.4 },
      ]);
      expect(a).toBeLessThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
  });

  describe('mastery is considered less when the user has lost the skill over a longer time', () => {
    it('case 1', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0 },
        { beforeDays: 10, correctness: 1 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0 },
        { beforeDays: 6, correctness: 1 },
      ]);
      expect(a).toBeLessThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
    it('case 2', () => {
      const a = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.3 },
        { beforeDays: 10, correctness: 0.4 },
      ]);
      const b = getMastery([
        { beforeDays: 1, correctness: 1 },
        { beforeDays: 5, correctness: 0.3 },
        { beforeDays: 6, correctness: 0.4 },
      ]);
      expect(a).toBeLessThan(b);
      checkValuesForNormalizedRange({ a, b });
    });
  });

  describe('mastery decreases less after a longer time', () => {
    it('case 0', () => {
      const a = getMastery([{ beforeDays: 1, correctness: 1 }]);
      const b = getMastery([{ beforeDays: 2, correctness: 1 }]);
      const c = getMastery([{ beforeDays: 9, correctness: 1 }]);
      const d = getMastery([{ beforeDays: 10, correctness: 1 }]);
      expect(a - b).toBeGreaterThan(c - d);
      checkValuesForNormalizedRange({ a, b, c, d });
    });
  });
});
